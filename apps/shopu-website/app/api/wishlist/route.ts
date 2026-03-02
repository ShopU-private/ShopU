import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { getAuthUserId } from '@/lib/auth';

// Add product to wishlist
export async function POST(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);

    const body = await req.json();
    const { name, image_url, productId } = body;

    const requiredFields = { name, image_url, productId };
    let missingFields: string[] | null = null;

    for (const key in requiredFields) {
      if (!requiredFields[key as keyof typeof requiredFields]) {
        (missingFields ??= []).push(key);
      }
    }

    if (missingFields) {
      throw new ShopUError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    const existing = await prisma.wishlist.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (existing) {
      throw new ShopUError(400, 'Already exists in wishlist');
    }

    const item = await prisma.wishlist.create({
      data: {
        name,
        image_url,
        productId,
        userId,
      },
    });

    if (!item) {
      throw new ShopUError(404, 'Fail to add in wishlist');
    }

    return NextResponse.json(
      { success: true, message: 'Added to wishlist', item },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

//Get products
export async function GET(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);

    //Query wishlist for the specific user
    const items = await prisma.wishlist.findMany({
      where: {
        is_active: true,
        userId: userId,
      },
      include: {
        product: {
          select: {
            stock: true,
            price: true,
          },
        },
      },
    });

    // Map to send stock along with wishlist item
    const response = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.product?.price ?? 0,
      image_url: item.image_url,
      productId: item.productId,
      createdAt: item.createdAt,
      stock: item.product?.stock ?? 0,
    }));

    return NextResponse.json(
      { success: true, message: 'Wishlist fetched', response },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

//Delete product to wishlist
export async function DELETE(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      throw new ShopUError(400, 'Product ID not found');
    }
    const deletedItem = await prisma.wishlist.deleteMany({
      where: {
        productId,
        userId,
      },
    });

    if (deletedItem.count === 0) {
      throw new ShopUError(404, 'Item not found in the wishlist');
    }

    return NextResponse.json({ success: true, message: 'Removed from wishlist' }, { status: 200 });
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
