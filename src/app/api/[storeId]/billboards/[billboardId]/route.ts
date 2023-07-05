import { db } from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    const billboard = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_GET]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { label, imageUrl } = body;

    if (!label || !imageUrl) {
      return new NextResponse("Name & ImageURL is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const store = await db.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log(`[BILLBOARD_PATCH]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("StoreID is required", { status: 400 });
    }

    // const storeByUserId = await db.store.findFirst({
    //   where: { id: params.billboardId, userId },
    // });

    // if (!storeByUserId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    const billboard = await db.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    console.log(billboard);

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_DELETE]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
