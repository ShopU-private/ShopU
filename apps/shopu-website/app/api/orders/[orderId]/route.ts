import { prisma } from '@shopu/prisma/prismaClient';
import { getAuthUserId, verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { ShopUError } from '@/proxy/ShopUError';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const userId = getAuthUserId(req);
    const { orderId } = await params;

    if (!orderId) {
      return shopuErrorHandler(new ShopUError(400, 'order id is required'));
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order || order.userId !== userId) {
      return shopuErrorHandler(new ShopUError(400, 'Order not found'));
    }

    return NextResponse.json(
      { success: true, message: 'Order details fetched', order },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
