"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function getAllVenuesWithSession() {
  return prisma.venue.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: {
      sessions: {
        where: { endedAt: null },
        include: {
          order: { include: { items: true } },
        },
        take: 1,
      },
    },
  });
}

export async function startSession(venueId: string) {
  const venue = await prisma.venue.findUniqueOrThrow({ where: { id: venueId } });
  if (venue.status !== "AVAILABLE") throw new Error("Bàn/sân đang được sử dụng");

  const session = await prisma.session.create({
    data: {
      venueId,
      order: { create: {} },
    },
  });

  await prisma.venue.update({ where: { id: venueId }, data: { status: "OCCUPIED" } });
  revalidatePath("/");
  return session;
}

export async function endSession(sessionId: string, paymentMethod: "CASH" | "TRANSFER") {
  const session = await prisma.session.findUniqueOrThrow({
    where: { id: sessionId },
    include: {
      venue: true,
      order: { include: { items: true } },
    },
  });

  const endedAt = new Date();
  const ms = endedAt.getTime() - session.startedAt.getTime();
  const hours = ms / (1000 * 60 * 60);
  const timeAmount = Math.round(hours * session.venue.hourlyRate);
  const itemsTotal = session.order?.items.reduce((s, i) => s + i.amount, 0) ?? 0;
  const totalAmount = timeAmount + itemsTotal;

  await prisma.session.update({ where: { id: sessionId }, data: { endedAt } });

  if (session.order) {
    await prisma.order.update({
      where: { id: session.order.id },
      data: { status: "PAID", paymentMethod, totalAmount, paidAt: endedAt },
    });
  }

  await prisma.venue.update({ where: { id: session.venueId }, data: { status: "AVAILABLE" } });
  revalidatePath("/");
  return { totalAmount };
}
