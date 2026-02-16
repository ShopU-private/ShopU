import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';

export async function GET(req: NextRequest) {
  try {
    // Read query params
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Number(searchParams.get('limit') || '20'));
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const category = searchParams.get('category');

    const skip = (page - 1) * limit;

    // prisma where clause
    const whereClause = {
      imageUrl: { not: '' },
      ...(category && {
        subCategory: {
          category: {
            name: {
              contains: category,
              mode: 'insensitive' as const,
            },
          },
        },
      }),
    };

    // DB queries (parallel)
    const [totalCount, products] = await Promise.all([
      prisma.product.count({ where: whereClause }),
      prisma.product.findMany({
        where: whereClause,
        include: {
          subCategory: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [{ stock: 'desc' }, { price: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    // Product transformation
    const productsWithDiscount = products.map(product => {
      const discount = (Number(product.id) % 30) + 10;
      const originalPrice = Math.ceil(Number(product.price) * (100 / (100 - discount)));

      return {
        ...product,
        discount,
        originalPrice,
        featured: true,
      };
    });

    // Response object
    const responseData = {
      success: true,
      products: productsWithDiscount,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      fromCache: false,
    };

    return NextResponse.json(responseData);
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
