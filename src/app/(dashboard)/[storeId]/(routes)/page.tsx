import { db } from "@/lib/prisma-db";

interface DashboardPageProps {
  params: { storeId: string };
}
export default async function DashboardPage({ params }: DashboardPageProps) {
  const store = await db.store.findFirst({
    where: { id: params.storeId },
  });

  return <div>Active store: {store?.name}</div>;
}
