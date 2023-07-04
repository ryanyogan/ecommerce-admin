import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "./data-table";

interface OrdersClientProps {
  data: OrderColumn[];
}

export function OrdersClient({ data }: OrdersClientProps) {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />

      <Separator />

      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
}
