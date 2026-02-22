import { prisma } from '@shopu/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/proxy/requireAuth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

/**
 * Getting the address details using the addressId
 * @param req -> taking the token to check the authentication
 * @param param1 -> taking the id of the address
 * @returns -> Gives the address details with the given address id
 */

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) return auth.response;

    const user = auth.user;
    if (!user) return shopuErrorHandler(new ShopUError(401, 'Invalid credentials'));

    const { id } = await params;

    const address = await prisma.address.findUnique({ where: { id } });

    if (!address || address.userId !== user.id) {
      return shopuErrorHandler(new ShopUError(404, 'Address not found'));
    }

    return NextResponse.json({ success: true, message: 'Fetched address successfully', address }, { status: 200 });
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

/**
 * Updating the address
 * @param req -> taking the token to check the authentication
 * @param param1 -> taking the id of the address
 * @returns -> Updating the address details
 */

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) return auth.response;

    const user = auth.user;
    if (!user) return shopuErrorHandler(new ShopUError(401, 'Invalid credentials'));

    const { id } = await params;
    const body = await req.json();

    const existingAddress = await prisma.address.findUnique({ where: { id } });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return shopuErrorHandler(new ShopUError(404, 'Address not found'));
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
        isDefault: body.isDefault,
        fullName: body.fullName,
        phone: body.phone,
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Address updated successfully', updatedAddress },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

// Delete address
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) return auth.response;

    const user = auth.user;
    if (!user) return shopuErrorHandler(new ShopUError(401, 'Invalid credentials'));

    const { id } = await params;

    const existingAddress = await prisma.address.findUnique({ where: { id } });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return shopuErrorHandler(new ShopUError(404, 'Address not found'));
    }

    await prisma.address.delete({ where: { id } });

    return NextResponse.json(
      { success: true, message: 'Address deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
