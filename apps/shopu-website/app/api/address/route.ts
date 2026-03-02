import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { getAuthUserId } from '@/lib/auth';

/**
 * Get the user details using the token
 * @param req -> taking the token from the cookie
 * @returns -> Gives the address details of the particular user using the token
 */

export async function GET(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);

    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    const normalizedAddresses = addresses.map(address => ({
      ...address,
      fullName: address.fullName ?? '',
      addressLine1: address.addressLine1 ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      country: address.country ?? '',
      postalCode: address.postalCode ?? '',
      phone: address.phone ?? '',
    }));

    return NextResponse.json(
      {
        success: true,
        message: 'Address fetched successfully',
        normalizedAddresses,
      },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

/**
 * Adding the new address of the user
 * @param req -> taking the token from the cookie
 * @returns -> Add the new address of the particular user using the cookies
 */

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);

    const {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      phone,
      latitude,
      longitude,
    } = await req.json();

    const requiredFields = {
      fullName,
      addressLine1,
      city,
      state,
      country,
      postalCode,
      phone,
      latitude,
      longitude,
    };
    let missingFields: string[] | null = null;

    for (const key in requiredFields) {
      if (!requiredFields[key as keyof typeof requiredFields]) {
        (missingFields ??= []).push(key);
      }
    }

    if (missingFields?.length) {
      return shopuErrorHandler(
        new ShopUError(401, `Missing fields required: ${missingFields.join(', ')}`)
      );
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        fullName,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        country,
        postalCode,
        phone,
        latitude: latitude !== undefined && latitude !== null ? Number(latitude) : null,
        longitude: longitude !== undefined && longitude !== null ? Number(longitude) : null,
        isDefault: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Address created successfully',
        newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
