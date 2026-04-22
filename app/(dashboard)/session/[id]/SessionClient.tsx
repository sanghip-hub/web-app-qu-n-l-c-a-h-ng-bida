"use client";

import { useState } from "react";
import Link from "next/link";
import { formatVND, calcCurrentAmount } from "@/lib/utils/format";
import TimerDisplay from "@/components/shared/TimerDisplay";
import AddProductPanel from "@/components/session/AddProductPanel";
import AddEquipmentPanel from "@/components/session/AddEquipmentPanel";
import OrderItemsList from "@/components/session/OrderItemsList";
import CheckoutModal from "@/components/session/CheckoutModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CreditCard, ShoppingBag, Wrench } from "lucide-react";

type Session = {
  id: string;
  startedAt: Date;
  venue: { id: string; name: string; type: string; hourlyRate: number };
  order: {
    id: string;
    totalAmount: number;
    items: Array<{ id: string; name: string; quantity: number; unitPrice: number; amount: number; type: string }>;
  } | null;
};

type Product = { id: string; name: string; category: string; price: number };
type Equipment = { id: string; name: string; rentalPrice: number; rentalUnit: string; available: number };

interface Props {
  session: Session;
  products: Product[];
  equipment: Equipment[];
}

export default function SessionClient({ session, products, equipment }: Props) {
  const [showCheckout, setShowCheckout] = useState(false);

  const startedAt = new Date(session.startedAt);
  const itemsTotal = session.order?.items.reduce((s, i) => s + i.amount, 0) ?? 0;
  const timeAmount = calcCurrentAmount(startedAt, session.venue.hourlyRate);
  const estimatedTotal = timeAmount + itemsTotal;

  return (
    <div className="flex h-screen">
      {/* Left: Bill */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Back header */}
        <div className="p-4 border-b flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="font-bold text-lg">{session.venue.name}</h2>
            <p className="text-xs text-gray-500">
              {session.venue.type === "BILLIARD" ? "Bida" : "Sân thể thao"}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="p-6 bg-gray-50 border-b text-center">
          <TimerDisplay
            startedAt={session.startedAt}
            hourlyRate={session.venue.hourlyRate}
            showAmount
          />
          <p className="text-xs text-gray-400 mt-1">
            {formatVND(session.venue.hourlyRate)}/giờ
          </p>
        </div>

        {/* Order items */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Đã gọi thêm</p>
          <OrderItemsList
            items={session.order?.items ?? []}
            orderId={session.order?.id ?? ""}
          />
        </div>

        {/* Bill footer */}
        <div className="p-4 border-t space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tiền giờ (tạm tính)</span>
              <span>{formatVND(timeAmount)}</span>
            </div>
            {itemsTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Đồ thêm</span>
                <span>{formatVND(itemsTotal)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1 border-t">
              <span>Tạm tính</span>
              <span className="text-green-600">{formatVND(estimatedTotal)}</span>
            </div>
          </div>

          <Button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <CreditCard size={16} className="mr-2" />
            Thanh toán
          </Button>
        </div>
      </div>

      {/* Right: Add products/equipment */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="products">
          <TabsList className="mb-4">
            <TabsTrigger value="products">
              <ShoppingBag size={14} className="mr-1.5" />
              Đồ ăn & Nước uống
            </TabsTrigger>
            <TabsTrigger value="equipment">
              <Wrench size={14} className="mr-1.5" />
              Dụng cụ thuê
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {session.order && (
              <AddProductPanel orderId={session.order.id} products={products} />
            )}
          </TabsContent>

          <TabsContent value="equipment">
            {session.order && (
              <AddEquipmentPanel
                orderId={session.order.id}
                sessionId={session.id}
                equipment={equipment}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Checkout modal */}
      {showCheckout && session.order && (
        <CheckoutModal
          session={session}
          open={showCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
