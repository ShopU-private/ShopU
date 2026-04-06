import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { isAdmin } from '@/lib/auth';


export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rawStatus = searchParams.get('status');
    const status = rawStatus || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    type OrderWhereInput = NonNullable<Parameters<typeof prisma.order.findMany>[0]>['where'];
    const where: OrderWhereInput = status ? ({ status } as OrderWhereInput) : {};

    const orders = await prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        address: true,
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            combination: {
              include: {
                values: {
                  include: {
                    variantValue: {
                      include: {
                        variantType: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        payments: true,
      },
    });

    const totalOrders = await prisma.order.count({ where });

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        pages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error) {
    console.error('[GET /api/admin/orders]', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
