"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function getProducts() {
  return prisma.product.findMany({ where: { active: true }, orderBy: [{ category: "asc" }, { name: "asc" }] });
}

export async function getAllProducts() {
  return prisma.product.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
}

export async function createProduct(data: { name: string; category: string; price: number; stock?: number }) {
  await prisma.product.create({ data });
  revalidatePath("/products");
}

export async function updateProduct(id: string, data: { name?: string; category?: string; price?: number; stock?: number; active?: boolean }) {
  await prisma.product.update({ where: { id }, data });
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.update({ where: { id }, data: { active: false } });
  revalidatePath("/products");
}
