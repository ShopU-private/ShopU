import { isAdmin } from '@/lib/auth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { prisma } from '@shopu/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return shopuErrorHandler(new ShopUError(403, 'Admin account required'));
    }

    const {
      code,
      name,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      startDate,
      expiryDate,
    } = await req.json();

    const requiredFields = {
      code,
      name,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      startDate,
      expiryDate,
    };

    let missingFields: string[] | null = null;

    for (const key in requiredFields) {
      if (!requiredFields[key as keyof typeof missingFields]) {
        (missingFields ??= []).push(key);
      }
    }

    const checkCoupons = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (checkCoupons) {
      return shopuErrorHandler(new ShopUError(400, 'Coupon already exists'));
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        name,
        code,
        description,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscountValue,
        startDate: new Date(startDate),
        expiryDate: new Date(expiryDate),
      },
    });

    if (!newCoupon) {
      return shopuErrorHandler(new ShopUError(400, 'Failed to create new coupon'));
    }

    return NextResponse.json({ success: true, message: '', newCoupon }, { status: 201 });
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return shopuErrorHandler(new ShopUError(403, 'Admin account required'));
    }

    const allCoupon = await prisma.coupon.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { success: true, message: 'Coupon details fetched', allCoupon },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
