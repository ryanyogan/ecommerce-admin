import { ProductForm } from "@/components/forms/product-form";
import { db } from "@/lib/prisma-db";

export default async function ProductPage({
  params,
}: {
  params: { productId: string; storeId: string };
}) {
  const [product, categories, sizes, colors] = await Promise.all([
    db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
      },
    }),
    db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    }),
    db.size.findMany({
      where: {
        storeId: params.storeId,
      },
    }),
    db.color.findMany({
      where: {
        storeId: params.storeId,
      },
    }),
  ]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          colors={colors}
          sizes={sizes}
          categories={categories}
        />
      </div>
    </div>
  );
}
