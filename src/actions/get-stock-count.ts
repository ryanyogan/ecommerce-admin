import { db } from "@/lib/prisma-db";

export async function getStockCount(storeId: string): Promise<number> {
  const stockCount = await db.product.count({
    where: { storeId, isArchived: false },
  });

  return stockCount;
}
