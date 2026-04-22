"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { endSession } from "@/lib/actions/sessions";
import { formatVND, calcTimeAmount } from "@/lib/utils/format";
import { toast } from "sonner";
import { Banknote, CreditCard } from "lucide-react";

interface Props {
  session: {
    id: string;
    startedAt: Date;
    venue: { name: string; hourlyRate: number };
    order: {
      id: string;
      totalAmount: number;
      items: Array<{ id: string; name: string; quantity: number; amount: number }>;
    } | null;
  };
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ session, open, onClose }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TRANSFER">("CASH");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const now = new Date();
  const timeAmount = calcTimeAmount(new Date(session.startedAt), now, session.venue.hourlyRate);
  const itemsTotal = session.order?.items.reduce((s, i) => s + i.amount, 0) ?? 0;
  const total = timeAmount + itemsTotal;

  function handleCheckout() {
    startTransition(async () => {
      try {
        await endSession(session.id, paymentMethod);
        toast.success("Thanh toán thành công!");
        onClose();
        router.push("/");
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Lỗi khi thanh toán");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thanh toán - {session.venue.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Bill summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tiền thời gian</span>
              <span className="font-medium">{formatVND(timeAmount)}</span>
            </div>
            {session.order?.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} × {item.quantity}</span>
                <span>{formatVND(item.amount)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-green-600">{formatVND(total)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="text-sm font-medium mb-2">Hình thức thanh toán</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("CASH")}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === "CASH" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <Banknote size={24} className={paymentMethod === "CASH" ? "text-blue-500" : "text-gray-400"} />
                <span className="text-sm font-medium">Tiền mặt</span>
              </button>
              <button
                onClick={() => setPaymentMethod("TRANSFER")}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === "TRANSFER" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <CreditCard size={24} className={paymentMethod === "TRANSFER" ? "text-blue-500" : "text-gray-400"} />
                <span className="text-sm font-medium">Chuyển khoản</span>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>Hủy</Button>
          <Button onClick={handleCheckout} disabled={isPending} className="bg-green-600 hover:bg-green-700">
            {isPending ? "Đang xử lý..." : `Thanh toán ${formatVND(total)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
