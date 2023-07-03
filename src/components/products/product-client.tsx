"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ApiList } from "../ui/api-list";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "./data-table";

interface ProductClientProps {
  data: ProductColumn[];
}

export default function ProductClient({ data }: ProductClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="label" columns={columns} data={data} />

      <Heading title="API" description="API calls for products" />

      <Separator />

      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
}
