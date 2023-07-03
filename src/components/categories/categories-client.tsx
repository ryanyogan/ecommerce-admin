"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ApiList } from "../ui/api-list";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "./data-table";

interface CategoriesClientProps {
  data: CategoryColumn[];
}

export default function CategoriesClient({ data }: CategoriesClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="label" columns={columns} data={data} />

      <Heading title="API" description="API calls for categories" />

      <Separator />

      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
}
