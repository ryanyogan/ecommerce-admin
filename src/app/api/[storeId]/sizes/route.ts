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

    const { name, value } = body;

    if (!userId || !params.storeId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !value) {
      return new NextResponse("Name & BillboardID is required", {
        status: 400,
      });
    }

    const storeByUserId = await db.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await db.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_POST]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const sizes = await db.size.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log(`[SIZES_GET]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
