import { db } from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    const color = await db.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLOR_GET]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; colorId: string } }
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

    if (!params.colorId) {
      return new NextResponse("Color is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await db.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLOR_PATCH]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Category is required", { status: 400 });
    }

    // const storeByUserId = await db.store.findFirst({
    //   where: { id: params.billboardId, userId },
    // });

    // if (!storeByUserId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    const color = await db.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLOR_DELETE]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
