import { db } from "@/lib/prisma-db";

export async function getSalesCount(storeId: string): Promise<number> {
  const salesCount = await db.order.count({
    where: { storeId, isPaid: true },
  });

  return salesCount;
}
