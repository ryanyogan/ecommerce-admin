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

    const color = await db.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLOR_POST]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const colors = await db.color.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log(`[COLOR_GET]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
