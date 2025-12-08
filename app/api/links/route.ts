import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateShortCode } from '@/utils/base62';
import { TIER_LIMITS } from '@/lib/constants';

// GET - Fetch all links for the authenticated user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const links = await prisma.shortLink.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST - Create a new shortened link
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    const authObj = await auth();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for features using Clerk billing (B2C)
    let plan: keyof typeof TIER_LIMITS = 'generate_3_urls';
    if (authObj.has({ feature: 'unlimited_urls' })) {
      plan = 'unlimited_urls';
    } else if (authObj.has({ feature: 'generate_up_to_25_links' })) {
      plan = 'generate_up_to_25_links';
    } else if (user.publicMetadata?.admin === true) {
      plan = 'unlimited_urls';
    }
    const limit = TIER_LIMITS[plan];

    const count = await prisma.shortLink.count({
      where: {
        userId: user.id,
      },
    });

    if (count >= limit) {
      return NextResponse.json(
        {
          error: `You have reached your limit of ${limit} links.`,
          code: 'LIMIT_REACHED'
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { originalUrl, alias } = body;

    if (!originalUrl) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check if Prisma is initialized
    if (!prisma) {
      console.error('Prisma client not initialized');
      return NextResponse.json(
        { error: 'Database not initialized. Run: npm run db:generate' },
        { status: 500 }
      );
    }

    // Generate a unique short code
    let shortCode = alias || generateShortCode();
    let attempts = 0;

    // Ensure uniqueness
    while (attempts < 10) {
      const existing = await prisma.shortLink.findUnique({
        where: { shortCode },
      });

      if (!existing) break;
      shortCode = generateShortCode();
      attempts++;
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { error: 'Failed to generate unique short code' },
        { status: 500 }
      );
    }

    const link = await prisma.shortLink.create({
      data: {
        userId: user.id,
        originalUrl,
        shortCode,
        alias: alias || null,
      },
    });

    return NextResponse.json(link);
  } catch (error: any) {
    console.error('Error creating link:', error);

    // Check for common Prisma errors
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Cannot reach database. Check your DATABASE_URL environment variable.' },
        { status: 500 }
      );
    }

    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'This short code already exists. Please try again.' },
        { status: 409 }
      );
    }

    // Return more detailed error message in development
    const errorMessage = process.env.NODE_ENV === 'development'
      ? `${error?.message || 'Failed to create link'} (Code: ${error?.code || 'N/A'})`
      : error?.message || 'Failed to create link';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

