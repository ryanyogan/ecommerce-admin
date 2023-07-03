import { db } from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await request.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId || !params.storeId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (
      !name ||
      !price ||
      !images.length ||
      !categoryId ||
      !colorId ||
      !sizeId
    ) {
      return new NextResponse("Name & ImageURL is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await db.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCT_POST]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log(`[BILLBOARD_GET]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
