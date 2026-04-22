"use client";

import { useTransition } from "react";
import { removeOrderItem } from "@/lib/actions/orders";
import { formatVND } from "@/lib/utils/format";
import { X } from "lucide-react";
import { toast } from "sonner";

type Item = { id: string; name: string; quantity: number; amount: number; type: string };

interface Props {
  orderId: string;
  items: Item[];
}

export default function OrderItemsList({ orderId, items }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleRemove(itemId: string, name: string) {
    startTransition(async () => {
      try {
        await removeOrderItem(orderId, itemId);
        toast.success(`Đã xóa ${name}`);
      } catch {
        toast.error("Lỗi khi xóa");
      }
    });
  }

  if (items.length === 0) {
    return <p className="text-xs text-gray-400 text-center py-4">Chưa gọi thêm gì</p>;
  }

  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between text-sm group">
          <div className="flex-1 min-w-0">
            <span className="text-gray-700">
              {item.name}
              {item.quantity > 1 && <span className="text-gray-400"> ×{item.quantity}</span>}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-gray-600 tabular-nums">{formatVND(item.amount)}</span>
            <button
              onClick={() => handleRemove(item.id, item.name)}
              disabled={isPending}
              className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
