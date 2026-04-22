"use client";

import { useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { startSession } from "@/lib/actions/sessions";
import { formatVND } from "@/lib/utils/format";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  venue: { id: string; name: string; type: string; hourlyRate: number };
  open: boolean;
  onClose: () => void;
}

export default function StartSessionModal({ venue, open, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleStart() {
    startTransition(async () => {
      try {
        const session = await startSession(venue.id);
        toast.success(`Đã mở ${venue.name}`);
        onClose();
        router.push(`/session/${session.id}`);
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Lỗi khi mở phiên");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Mở phiên - {venue.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-2 text-sm text-gray-600">
          <p>Loại: {venue.type === "BILLIARD" ? "🎱 Bàn bida" : "⚽ Sân thể thao"}</p>
          <p>Giá: {formatVND(venue.hourlyRate)}/giờ</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>Hủy</Button>
          <Button onClick={handleStart} disabled={isPending} className="bg-green-600 hover:bg-green-700">
            {isPending ? "Đang mở..." : "Bắt đầu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
