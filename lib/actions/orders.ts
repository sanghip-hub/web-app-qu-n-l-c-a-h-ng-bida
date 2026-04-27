"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function getSessionWithOrder(sessionId: string) {
  return prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      venue: true,
      order: { include: { items: true } },
    },
  });
}

export async function addProductToOrder(
  orderId: string,
  product: { id: string; name: string; price: number },
  quantity: number
) {
  await prisma.orderItem.create({
    data: {
      orderId,
      type: "PRODUCT",
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      amount: product.price * quantity,
    },
  });
  await updateOrderTotal(orderId);
  revalidatePath("/session/[id]", "page");
}

export async function addEquipmentToOrder(
  orderId: string,
  sessionId: string,
  equipment: { id: string; name: string; rentalPrice: number },
  quantity: number
) {
  await prisma.orderItem.create({
    data: {
      orderId,
      type: "EQUIPMENT",
      equipmentId: equipment.id,
      name: equipment.name,
      quantity,
      unitPrice: equipment.rentalPrice,
      amount: equipment.rentalPrice * quantity,
    },
  });
  await prisma.equipmentRental.create({
    data: { sessionId, equipmentId: equipment.id, quantity },
  });
  await updateOrderTotal(orderId);
  revalidatePath("/session/[id]", "page");
}

export async function removeOrderItem(orderId: string, itemId: string) {
  await prisma.orderItem.delete({ where: { id: itemId } });
  await updateOrderTotal(orderId);
  revalidatePath("/session/[id]", "page");
}

async function updateOrderTotal(orderId: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  const total = items.reduce((s, i) => s + i.amount, 0);
  await prisma.order.update({ where: { id: orderId }, data: { totalAmount: total } });
}

export async function getRecentOrders(limit = 100, from?: Date, to?: Date) {
  return prisma.order.findMany({
    where: {
      status: "PAID",
      ...(from && to ? { paidAt: { gte: from, lte: to } } : {}),
    },
    orderBy: { paidAt: "desc" },
    take: limit,
    include: {
      session: {
        include: { venue: true },
      },
      items: { orderBy: { type: "asc" } },
    },
  });
}
