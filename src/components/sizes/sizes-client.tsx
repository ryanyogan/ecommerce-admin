"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ApiList } from "../ui/api-list";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "./data-table";

interface SizesClientProps {
  data: SizeColumn[];
}

export default function SizesClient({ data }: SizesClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API calls for sizes" />

      <Separator />

      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
}
