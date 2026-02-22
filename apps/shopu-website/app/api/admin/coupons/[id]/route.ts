import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { isAdmin } from '@/lib/auth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdmin(request)) {
      return shopuErrorHandler(new ShopUError(403, 'Unauthorized access'));
    }
    const { id } = await params;

    const deletedCoupon = await prisma.coupon.delete({
      where: { id },
    });

    if (!deletedCoupon) {
      return shopuErrorHandler(new ShopUError(401, 'Failed to delete the coupon'));
    }

    return NextResponse.json(
      { success: true, message: 'Coupon deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
