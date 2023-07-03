import { db } from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    const size = await db.category.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_GET]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, value } = body;

    if (!name || !value) {
      return new NextResponse("Name & Value is required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await db.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_PATCH]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Category is required", { status: 400 });
    }

    // const storeByUserId = await db.store.findFirst({
    //   where: { id: params.billboardId, userId },
    // });

    // if (!storeByUserId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    const size = await db.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_DELETE]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
