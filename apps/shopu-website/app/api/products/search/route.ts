import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get('name');
    const limit = Number(searchParams.get('limit') || '30');

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const trimmed = name.trim().toLowerCase();

    /** --- MEDICINES SEARCH -- */
    const medicines = await prisma.medicine.findMany({
      where: {
        name: {
          contains: trimmed,
          mode: 'insensitive',
        },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    /** --- PRODUCTS SEARCH -- */
    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: trimmed,
                  mode: 'insensitive',
                },
              },
              {
                subCategory: {
                  name: {
                    contains: trimmed,
                    mode: 'insensitive',
                  },
                },
              },
              {
                subCategory: {
                  category: {
                    name: {
                      contains: trimmed,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
        ],
      },

      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
      },

      take: limit,
      orderBy: { name: 'asc' },
    });

    // merge + tag type
    const results = [
      ...medicines.map(m => ({ ...m, type: 'medicine' })),
      ...products.map(p => ({ ...p, type: 'product' })),
    ].slice(0, limit); // enforce limit after merge

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error('[MERGED_SEARCH_ERROR]', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
