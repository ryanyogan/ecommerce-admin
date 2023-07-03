import { SizeColumn } from "@/components/sizes/columns";
import SizesClient from "@/components/sizes/sizes-client";
import { db } from "@/lib/prisma-db";
import { format } from "date-fns";

export default async function SizesPage({
  params,
}: {
  params: { storeId: string; billboardId: string };
}) {
  const sizes = await db.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
}
