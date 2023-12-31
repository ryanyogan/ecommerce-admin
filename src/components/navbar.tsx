import { db } from "@/lib/prisma-db";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { MainNav } from "./main-nav";
import { StoreSwitcher } from "./store-switcher";
import { ThemeToggle } from "./ui/theme-toggle";

interface NavbarProps {}

export async function Navbar() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6 overflow-auto" />
        <div className="ml-auto hidden sm:flex items-center space-x-1 sm:space-x-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
