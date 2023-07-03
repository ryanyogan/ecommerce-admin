"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ApiList } from "../ui/api-list";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "./data-table";

interface ColorClientProps {
  data: ColorColumn[];
}

export default function ColorClient({ data }: ColorClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors for your products"
        />

        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API calls for colors" />

      <Separator />

      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
}
