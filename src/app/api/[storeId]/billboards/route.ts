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

    const { label, imageUrl, featured } = body;

    if (!userId || !params.storeId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label || !imageUrl) {
      return new NextResponse("Name & ImageURL is required", { status: 400 });
    }

    if (featured) {
      await db.billboard.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    const storeByUserId = await db.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const store = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
        featured,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log(`[BILLBOARD_POST]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const billboards = await db.billboard.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log(`[BILLBOARD_GET]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
