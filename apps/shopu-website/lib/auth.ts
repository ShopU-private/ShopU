import { jwtDecode } from 'jwt-decode';
import { prisma } from '@shopu/prisma/prismaClient';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { envs } from '@shopu/config/config';
import { requireAuth } from '@/proxy/requireAuth';
import { ShopUError } from '@/proxy/ShopUError';

const JWT_SECRET = envs.JWT_SECRET || 'your-secret-key';
interface TokenPayload {
  id: string;
  role: string;
  phoneNumber?: string;
  exp?: number;
  iat?: number;
}

export function generateToken(user: { id: string; role: string; phoneNumber?: string }) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      phoneNumber: user.phoneNumber,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): TokenPayload {
  try {
    if (!token || token.trim() === '') {
      throw new Error('Empty token provided');
    }

    const decoded = jwtDecode<TokenPayload>(token);

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      throw new Error('Token expired');
    }

    return decoded;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Token verification failed:', error.message);
    } else {
      console.error('Token verification failed:', error);
    }
    throw new Error('Invalid token');
  }
}

export function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    console.log('No token provided for admin check');
    return false;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      console.log('Token expired for admin check');
      return false;
    }

    return decoded.role?.toUpperCase() === 'ADMIN';
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in isAdmin check:', error.message);
    } else {
      console.error('Error in isAdmin check:', error);
    }
    return false;
  }
}

export async function getUserFromToken(token: string) {
  try {
    if (!token || token.trim() === '') return null;
    const payload = jwtDecode<TokenPayload>(token);

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

export function getAuthUserId(req: NextRequest): string {
  const auth = requireAuth(req);

  if (!auth.authenticated) {
    throw auth.response;
  }

  const user = auth.user;
  if (!user?.id) {
    throw new ShopUError(401, 'Invalid credentials');
  }

  return user.id;
}

export function isUserLoggedIn(req: NextRequest): boolean {
  const auth = requireAuth(req);
  return auth.authenticated;
}
