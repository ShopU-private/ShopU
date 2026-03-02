import { isAdmin } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import { createProductSchema } from '@/lib/schema/adminSchema';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { prisma } from '@shopu/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return shopuErrorHandler(new ShopUError(401, 'Admin account required'));
    }

    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return shopuErrorHandler(
        new ShopUError(400, `zod error: ${JSON.stringify(parsed.error.format())}`)
      );
    }

    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      compareAtPrice,
      costPrice,
      stock,
      lowStockThreshold,
      sku,
      barcode,
      weight,
      dimensions,
      imageUrl,
      subCategoryId,
      manufacturer,
      manufacturerAddress,
      type,
      packaging,
      packageQty,
      productForm,
      productHighlights,
      information,
      keyIngredients,
      keyBenefits,
      directionsForUse,
      safetyInformation,
      countryOfOrigin,
      manufacturerDetails,
      marketerDetails,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = parsed.data;

    const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
      folder: 'products',
    });

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl: uploadResponse.secure_url,
        subCategoryId,
        type,
        slug,
        packageQty,
        packaging,
        productForm,
        productHighlights,
        information,
        keyBenefits,
        keyIngredients,
        dimensions,
        directionsForUse,
        safetyInformation,
        shortDescription,
        compareAtPrice,
        costPrice,
        lowStockThreshold,
        sku,
        barcode,
        weight,
        manufacturer,
        manufacturerAddress,
        countryOfOrigin,
        manufacturerDetails,
        marketerDetails,
        metaTitle,
        metaDescription,
        metaKeywords,
      },
    });

    if (!product) {
      return shopuErrorHandler(new ShopUError(400, 'Failed to create the product'));
    }

    return NextResponse.json(
      { success: true, message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return shopuErrorHandler(new ShopUError(401, 'Admin account is required'));
    }

    const product = await prisma.product.findMany({
      include: {
        combinations: true,
        variantTypes: true,
        reviews: true,
        images: true,
        subCategory: true,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Product details fetched successfully', product },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
