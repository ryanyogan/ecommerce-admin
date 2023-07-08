import { db } from "@/lib/prisma-db";

async function seed() {
  await db.product.deleteMany();
  await db.billboard.deleteMany();
  await db.size.deleteMany();
  await db.color.deleteMany();
  await db.order.deleteMany();
  await db.category.deleteMany();
}

const categories = ["Suits", "Shirts", "Glasses"];

const sizes = [
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Small", value: "sm" },
  { label: "Extra Small", value: "xs" },
];

const colors = [
  { label: "Blue", value: "#ffffff" },
  { label: "White", value: "#ffffff" },
  { label: "Red", value: "#ffffff" },
  { label: "Green", value: "#ffffff" },
  { label: "Black", value: "#ffffff" },
];
