import { db } from "@/lib/prisma-db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const billboard = await db.billboard.findFirst({
      where: { storeId: params.storeId, featured: true },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_GET]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
