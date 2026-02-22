import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { getAuthUserId } from '@/lib/auth';

export async function DELETE(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return shopuErrorHandler(new ShopUError(401, 'Invalid credentials'));
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account deleted successfully',
      },
      { status: 200 }
    );

    response.cookies.delete('token');

    return response;
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
