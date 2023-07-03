import { SizesForm } from "@/components/forms/sizes-form";
import { db } from "@/lib/prisma-db";

export default async function SizePage({
  params,
}: {
  params: { sizeId: string };
}) {
  const size = await db.size.findUnique({
    where: { id: params.sizeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesForm initialData={size} />
      </div>
    </div>
  );
}
