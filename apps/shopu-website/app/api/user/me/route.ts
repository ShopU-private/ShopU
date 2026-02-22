import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { getAuthUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);

    if (!userId) {
      return shopuErrorHandler(new ShopUError(401, 'Invalid token'));
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isProfileComplete: true,
      },
    });

    if (!userDetails) {
      return shopuErrorHandler(new ShopUError(404, 'User not found'));
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User details fetched successfully',
        user: userDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
