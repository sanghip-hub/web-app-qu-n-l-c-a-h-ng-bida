"use client";

import { useTransition } from "react";
import { addEquipmentToOrder } from "@/lib/actions/orders";
import { formatVND } from "@/lib/utils/format";
import { toast } from "sonner";

type Equipment = { id: string; name: string; rentalPrice: number; rentalUnit: string; available: number };

interface Props {
  orderId: string;
  sessionId: string;
  equipment: Equipment[];
}

export default function AddEquipmentPanel({ orderId, sessionId, equipment }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleAdd(item: Equipment) {
    startTransition(async () => {
      try {
        await addEquipmentToOrder(orderId, sessionId, item, 1);
        toast.success(`Đã thuê ${item.name}`);
      } catch {
        toast.error("Lỗi khi thuê dụng cụ");
      }
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {equipment.map((item) => (
        <button
          key={item.id}
          onClick={() => handleAdd(item)}
          disabled={isPending || item.available === 0}
          className="flex flex-col px-3 py-3 bg-white border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-medium text-gray-800">{item.name}</span>
          <span className="text-green-600 font-semibold mt-0.5">
            {formatVND(item.rentalPrice)}/{item.rentalUnit === "PER_USE" ? "lần" : "giờ"}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">Còn: {item.available}</span>
        </button>
      ))}
      {equipment.length === 0 && (
        <p className="col-span-2 text-center text-gray-400 py-8 text-sm">Chưa có dụng cụ</p>
      )}
    </div>
  );
}
