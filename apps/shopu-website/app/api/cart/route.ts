import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { getAuthUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      select: {
        id: true,
        quantity: true,
        productId: true,
        medicineId: true,
        addedAt: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
        medicine: {
          select: {
            id: true,
            name: true,
            price: true,
            manufacturerName: true,
            packSizeLabel: true,
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json(
      { success: true, message: 'Cart item fetched', cartItems },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);
    const { productId, medicineId, quantity = 1 } = await req.json();

    if (!productId && !medicineId) {
      return shopuErrorHandler(new ShopUError(400, 'Product ID or Medicine ID is required'));
    }

    if (productId && medicineId) {
      return shopuErrorHandler(
        new ShopUError(400, 'Cannot add both Medicine ID and Product ID at once')
      );
    }

    if (quantity <= 0) {
      return shopuErrorHandler(new ShopUError(400, 'Item quantity should be greater than 0'));
    }

    if (productId) {
      const exists = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });
      if (!exists) {
        return shopuErrorHandler(new ShopUError(404, 'Product not found'));
      }
    }

    if (medicineId) {
      const exists = await prisma.medicine.findUnique({
        where: { id: medicineId },
        select: { id: true },
      });
      if (!exists) {
        return shopuErrorHandler(new ShopUError(404, 'Medicine not found'));
      }
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId: productId ?? undefined,
        medicineId: medicineId ?? undefined,
      },
    });

    const cartItem = existingItem
      ? await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: { increment: quantity },
          },
          include: {
            product: productId
              ? { select: { id: true, name: true, price: true, imageUrl: true } }
              : undefined,
            medicine: medicineId
              ? {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    manufacturerName: true,
                    packSizeLabel: true,
                  },
                }
              : undefined,
          },
        })
      : await prisma.cartItem.create({
          data: {
            userId,
            productId: productId ?? null,
            medicineId: medicineId ?? null,
            quantity,
          },
          include: {
            product: productId
              ? { select: { id: true, name: true, price: true, imageUrl: true } }
              : undefined,
            medicine: medicineId
              ? {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    manufacturerName: true,
                    packSizeLabel: true,
                  },
                }
              : undefined,
          },
        });
    return NextResponse.json(
      {
        success: true,
        message: 'Item added to cart',
        cartItem,
      },
      { status: existingItem ? 200 : 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
