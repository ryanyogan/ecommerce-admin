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

    const { name, billboardId } = body;

    if (!userId || !params.storeId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !billboardId) {
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

    const category = await db.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORY_POST]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const categories = await db.category.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(`[CATEGORY_GET]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
