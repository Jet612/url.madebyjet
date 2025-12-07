import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Redirect to original URL
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    // Validate short code format
    if (!/^[a-zA-Z0-9]{6,12}$/.test(shortCode)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const link = await prisma.shortLink.findUnique({
      where: { shortCode },
    });

    if (!link) {
      // Return 404 instead of redirecting to prevent information leakage
      return new NextResponse('Link not found', { status: 404 });
    }

    // Increment click count (fire and forget to avoid blocking redirect)
    prisma.shortLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    }).catch(err => console.error('Error updating clicks:', err));

    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

