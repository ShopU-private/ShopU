import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { isAdmin } from '@/lib/auth';
import { createCategorySchema } from '@/lib/schema/adminSchema';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { error } from 'console';

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      throw new ShopUError(401, 'Admin account is required');
    }
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true,
      },
    });
    return NextResponse.json(
      { success: true, message: 'Category fetched successfully', categories },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      throw new ShopUError(401, 'Admin account is required');
    }

    const body = await request.json();

    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      throw new ShopUError(400, `Error: ${parsed.error.format()}`);
    }

    const { name } = parsed.data;

    if (!name) {
      throw new ShopUError(400, 'Name is required');
    }

    const existing = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ShopUError(409, 'Category alreay exists');
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const newCategory = await prisma.category.create({ data: { name, slug } });

    if (!newCategory) {
      throw new ShopUError(401, 'Failed to creare category');
    }

    return NextResponse.json(
      { success: true, message: 'New category added successfully', newCategory },
      { status: 200 }
    );
  } catch {
    return shopuErrorHandler(error);
  }
}
