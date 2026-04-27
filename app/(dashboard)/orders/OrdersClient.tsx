"use client";

import { useState } from "react";
import { formatVND } from "@/lib/utils/format";
import { format, differenceInMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import PeriodFilter from "@/components/PeriodFilter";

type OrderItem = {
  id: string;
  type: string;
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

type Order = {
  id: string;
  totalAmount: number;
  paidAt: Date | null;
  paymentMethod: string | null;
  items: OrderItem[];
  session: {
    startedAt: Date;
    endedAt: Date | null;
    venue: { name: string; type: string; hourlyRate: number };
  };
};

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h} giờ`;
  return `${h} giờ ${m} phút`;
}

function OrderDetail({ order }: { order: Order }) {
  const { session, items, totalAmount, paidAt, paymentMethod } = order;
  const startedAt = new Date(session.startedAt);
  const endedAt = session.endedAt ? new Date(session.endedAt) : null;
  const durationMin = endedAt ? differenceInMinutes(endedAt, startedAt) : 0;
  const hours = durationMin / 60;
  const timeAmount = Math.round(hours * session.venue.hourlyRate);

  const productItems = items.filter((i) => i.type === "PRODUCT");
  const equipmentItems = items.filter((i) => i.type === "EQUIPMENT");

  return (
    <div className="space-y-5">
      {/* Thông tin bàn */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Bàn/Sân</span>
          <span className="font-semibold">{session.venue.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Bắt đầu</span>
          <span>{format(startedAt, "HH:mm - dd/MM/yyyy", { locale: vi })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Kết thúc</span>
          <span>{endedAt ? format(endedAt, "HH:mm - dd/MM/yyyy", { locale: vi }) : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Thời gian chơi</span>
          <span className="font-semibold text-blue-600">{formatDuration(durationMin)}</span>
        </div>
      </div>

      {/* Chi tiết tiền */}
      <div className="space-y-3">
        {/* Tiền giờ */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tiền giờ</p>
          <div className="flex justify-between text-sm">
            <span>{formatDuration(durationMin)} × {formatVND(session.venue.hourlyRate)}/giờ</span>
            <span className="font-medium">{formatVND(timeAmount)}</span>
          </div>
        </div>

        {/* Sản phẩm */}
        {productItems.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Đồ dùng / Bán hàng</p>
            <div className="space-y-1">
              {productItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="font-medium">{formatVND(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dụng cụ */}
        {equipmentItems.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Dụng cụ thuê</p>
            <div className="space-y-1">
              {equipmentItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="font-medium">{formatVND(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tổng */}
        <div className="border-t pt-3 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Thanh toán: </span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
              paymentMethod === "CASH" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
            }`}>
              {paymentMethod === "CASH" ? "Tiền mặt" : "Chuyển khoản"}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Tổng cộng</p>
            <p className="text-xl font-bold text-green-600">{formatVND(totalAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  orders: Order[];
  period: string;
}

export default function OrdersClient({ orders, period }: Props) {
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
        <PeriodFilter current={period} />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>Không có đơn hàng trong khoảng thời gian này</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Bàn/Sân</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Thời gian</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Thanh toán</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelected(order)}
                >
                  <td className="px-4 py-3 font-medium">{order.session.venue.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.paidAt
                      ? format(new Date(order.paidAt), "dd/MM HH:mm", { locale: vi })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      order.paymentMethod === "CASH"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {order.paymentMethod === "CASH" ? "Tiền mặt" : "Chuyển khoản"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    {formatVND(order.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal chi tiết */}
      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-lg font-bold">Chi tiết hoá đơn</Dialog.Title>
                <Dialog.Close className="p-1.5 rounded-lg hover:bg-gray-100">
                  <X size={20} />
                </Dialog.Close>
              </div>
              {selected && <OrderDetail order={selected} />}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
