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
        toast.success(`Đã thêm ${item.name}`);
      } catch {
        toast.error("Lỗi khi thêm dụng cụ");
      }
    });
  }

  if (equipment.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8 text-sm">
        Chưa có dụng cụ nào. Vào Dụng cụ để thêm.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {equipment.map((item) => (
        <button
          key={item.id}
          onClick={() => handleAdd(item)}
          disabled={isPending || item.available === 0}
          className="flex justify-between items-center px-3 py-2 bg-white border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          <div>
            <p className="font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-400">
              {item.rentalUnit === "PER_USE" ? "Theo lần" : "Theo giờ"}
            </p>
          </div>
          <div className="text-right ml-2 flex-shrink-0">
            <p className="text-green-600 font-semibold">{formatVND(item.rentalPrice)}</p>
            {item.available === 0 && (
              <p className="text-xs text-red-400">Hết</p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
