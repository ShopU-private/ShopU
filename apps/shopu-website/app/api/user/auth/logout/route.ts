import { requireAuth } from '@/proxy/requireAuth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);

  if (!auth.authenticated) {
    return auth.response;
  }

  const user = auth.user;

  if (!user) {
    return shopuErrorHandler(new ShopUError(401, 'Invalid credentials'));
  }

  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
