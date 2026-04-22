"use server";

import { prisma } from "@/lib/db";

export async function getRevenueReport(from: Date, to: Date) {
  const sessions = await prisma.session.findMany({
    where: {
      endedAt: { gte: from, lte: to },
      order: { status: "PAID" },
    },
    include: {
      venue: true,
      order: { include: { items: true } },
    },
    orderBy: { endedAt: "asc" },
  });

  const totalRevenue = sessions.reduce((s, sess) => s + (sess.order?.totalAmount ?? 0), 0);
  const totalSessions = sessions.length;

  const productRevenue = sessions.reduce((s, sess) => {
    return s + (sess.order?.items ?? [])
      .filter((i) => i.type === "PRODUCT")
      .reduce((ss, i) => ss + i.amount, 0);
  }, 0);

  const equipmentRevenue = sessions.reduce((s, sess) => {
    return s + (sess.order?.items ?? [])
      .filter((i) => i.type === "EQUIPMENT")
      .reduce((ss, i) => ss + i.amount, 0);
  }, 0);

  const timeRevenue = totalRevenue - productRevenue - equipmentRevenue;

  const productMap = new Map<string, { name: string; qty: number; amount: number }>();
  for (const sess of sessions) {
    for (const item of sess.order?.items ?? []) {
      if (item.type === "PRODUCT") {
        const existing = productMap.get(item.name) ?? { name: item.name, qty: 0, amount: 0 };
        productMap.set(item.name, {
          name: item.name,
          qty: existing.qty + item.quantity,
          amount: existing.amount + item.amount,
        });
      }
    }
  }
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  return { totalRevenue, totalSessions, timeRevenue, productRevenue, equipmentRevenue, topProducts, sessions };
}
