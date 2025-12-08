'use server';

import { currentUser, auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TIER_LIMITS } from '@/lib/constants';

export async function getSubscriptionStatus() {
  const user = await currentUser();
  const authObj = await auth();

  if (!user) {
    throw new Error('User not found');
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

  return {
    plan,
    limit,
    count,
    isOverLimit: count > limit,
  };
}

export async function getUserLinks() {
  const user = await currentUser();

  if (!user) {
    throw new Error('User not found');
  }

  const links = await prisma.shortLink.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      shortCode: true,
      originalUrl: true,
      alias: true,
      createdAt: true,
      clicks: true,
    },
  });

  return links;
}

export async function deleteLinks(linkIds: string[]) {
  const user = await currentUser();

  if (!user) {
    throw new Error('User not found');
  }

  await prisma.shortLink.deleteMany({
    where: {
      id: {
        in: linkIds,
      },
      userId: user.id, // Ensure user owns the links
    },
  });

  revalidatePath('/subscription-cleanup');

  // Re-check status to see if we can redirect
  const status = await getSubscriptionStatus();
  if (!status.isOverLimit) {
    return { success: true, redirect: true };
  }

  return { success: true, redirect: false };
}
