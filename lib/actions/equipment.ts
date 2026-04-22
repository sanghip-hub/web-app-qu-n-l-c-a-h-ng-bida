"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function getEquipment() {
  return prisma.equipment.findMany({ where: { active: true }, orderBy: { name: "asc" } });
}

export async function getAllEquipment() {
  return prisma.equipment.findMany({ orderBy: { name: "asc" } });
}

export async function createEquipment(data: {
  name: string;
  rentalPrice: number;
  rentalUnit: string;
  available: number;
}) {
  await prisma.equipment.create({ data });
  revalidatePath("/equipment");
}

export async function updateEquipment(
  id: string,
  data: { name?: string; rentalPrice?: number; rentalUnit?: string; available?: number; active?: boolean }
) {
  await prisma.equipment.update({ where: { id }, data });
  revalidatePath("/equipment");
}

export async function deleteEquipment(id: string) {
  await prisma.equipment.update({ where: { id }, data: { active: false } });
  revalidatePath("/equipment");
}
