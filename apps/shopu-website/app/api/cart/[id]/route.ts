import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { getAuthUserId } from '@/lib/auth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

// PUT - update cart item quantity
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: cartItemId } = await params;
    const userId = getAuthUserId(req);

    const { quantity } = await req.json();

    if (!Number.isInteger(quantity) || quantity < 1) {
      return shopuErrorHandler(new ShopUError(400, 'Quantity must be a positive integer'));
    }

    // Find the cart item and check if it belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (!cartItem) {
      return shopuErrorHandler(new ShopUError(404, 'Cart item not found'));
    }

    // Update the cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
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
    });

    return NextResponse.json(
      { success: true, message: 'Cart item updated', cartItem: updatedCartItem },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

// DELETE - remove an item from the cart
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: cartItemId } = await params;
    const userId = getAuthUserId(req);

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (!cartItem) {
      return shopuErrorHandler(new ShopUError(404, 'Cart item not found'));
    }

    // Delete the cart item
    const deleteCartItem = await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    if (!deleteCartItem) {
      return shopuErrorHandler(new ShopUError(404, ''))
    }

    return NextResponse.json({ success: true, message: 'Item removed from cart' }, { status: 200 });
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
