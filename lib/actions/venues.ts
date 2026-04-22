"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function getVenues() {
  return prisma.venue.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }] });
}

export async function createVenue(data: { name: string; type: string; hourlyRate: number }) {
  await prisma.venue.create({ data });
  revalidatePath("/settings");
  revalidatePath("/");
}

export async function updateVenue(
  id: string,
  data: { name?: string; hourlyRate?: number; status?: string }
) {
  await prisma.venue.update({ where: { id }, data });
  revalidatePath("/settings");
  revalidatePath("/");
}

export async function deleteVenue(id: string) {
  const active = await prisma.session.count({ where: { venueId: id, endedAt: null } });
  if (active > 0) throw new Error("Bàn/sân đang có người dùng, không thể xóa");
  await prisma.venue.delete({ where: { id } });
  revalidatePath("/settings");
  revalidatePath("/");
}
