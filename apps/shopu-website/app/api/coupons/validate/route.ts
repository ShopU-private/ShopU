// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@shopu/prisma/prismaClient';

import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { prisma } from '@shopu/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const { code, orderAmount } = await req.json();

//     const coupon = await prisma.coupon.findFirst({
//       where: { code: code.trim().toUpperCase() },
//     });

//     if (!coupon) {
//       return NextResponse.json({ valid: false, message: 'Coupon not found' }, { status: 404 });
//     }

//     if (new Date(coupon.expiryDate) < new Date()) {
//       return NextResponse.json({ valid: false, message: 'Coupon expired' }, { status: 400 });
//     }

//     if ('usageLimit' in coupon && typeof coupon.usageLimit === 'number' && coupon.usageLimit <= 0) {
//       return NextResponse.json(
//         { valid: false, message: 'Coupon usage limit reached' },
//         { status: 400 }
//       );
//     }

//     const discountAmount = (orderAmount * Number(coupon.discountValue)) / (coupon.discountType === 'percentage' ? 100 : 1);
//     const finalAmount = orderAmount - discountAmount;

//     return NextResponse.json({
//       valid: true,
//       coupon,
//       discountAmount,
//       finalAmount,
//     });
//   } catch (err) {
//     console.error('Error validating coupon:', err);
//     return NextResponse.json({ valid: false, message: 'Server error' }, { status: 500 });
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const { code, orderAmount } = await req.json();

    if (!code || !orderAmount) {
      return shopuErrorHandler(new ShopUError(404, 'All fields are required'));
    }

    console.log(orderAmount);

    const existingCode = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
      select: {
        expiryDate: true,
        minOrderValue: true,
        discountValue: true,
        discountType: true,
      },
    });

    if (!existingCode) {
      return shopuErrorHandler(new ShopUError(404, 'Coupon with given code not found'));
    }

    if (existingCode.expiryDate < new Date()) {
      return shopuErrorHandler(new ShopUError(401, 'Coupon already exipred'));
    }

    if (!existingCode.minOrderValue) {
      return shopuErrorHandler(
        new ShopUError(404, `Minimum order value of ${existingCode.minOrderValue} is required`)
      );
    }

    if (orderAmount < existingCode.minOrderValue) {
      return shopuErrorHandler(
        new ShopUError(
          400,
          `Order value is too low, Minimum order value of ${existingCode.minOrderValue} is required`
        )
      );
    }

    const discountAmount =
      (orderAmount * Number(existingCode.discountValue)) /
      (existingCode.discountType === 'PERCENTAGE' ? 100 : 1);

    console.log(discountAmount);

    const finalAmount = orderAmount - discountAmount;

    console.log(finalAmount);

    return NextResponse.json(
      {
        success: true,
        message: 'Coupon added successfully',
        existingCode,
        finalAmount,
        discountAmount,
        valid: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
