import { db } from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const body = await request.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await db.store.create({
      data: {
        userId,
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log(`[STORES_POST]`, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
