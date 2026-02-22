import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return shopuErrorHandler(new ShopUError(401, 'Phone number is required'));
    }

    // Static OTP logic
    return NextResponse.json(
      { success: true, message: 'OTP sent successfully', otp: '111111' },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
