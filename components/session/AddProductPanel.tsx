"use client";

import { useState, useTransition } from "react";
import { addProductToOrder } from "@/lib/actions/orders";
import { formatVND } from "@/lib/utils/format";
import { toast } from "sonner";

type Product = { id: string; name: string; category: string; price: number };

interface Props {
  orderId: string;
  products: Product[];
}

export default function AddProductPanel({ orderId, products }: Props) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const filtered = products.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(product: Product) {
    startTransition(async () => {
      try {
        await addProductToOrder(orderId, product, 1);
        toast.success(`Đã thêm ${product.name}`);
      } catch {
        toast.error("Lỗi khi thêm sản phẩm");
      }
    });
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {categories.map((cat) => {
        const items = filtered.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{cat}</p>
            <div className="grid grid-cols-2 gap-2">
              {items.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAdd(product)}
                  disabled={isPending}
                  className="flex justify-between items-center px-3 py-2 bg-white border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                >
                  <span className="font-medium text-gray-800">{product.name}</span>
                  <span className="text-green-600 font-semibold">{formatVND(product.price)}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-8 text-sm">Không tìm thấy sản phẩm</p>
      )}
    </div>
  );
}
