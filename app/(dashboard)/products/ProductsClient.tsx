"use client";

import { useState, useTransition } from "react";
import { createProduct, updateProduct, deleteProduct } from "@/lib/actions/products";
import { formatVND } from "@/lib/utils/format";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Product = { id: string; name: string; category: string; price: number; stock: number | null; active: boolean };

export default function ProductsClient({ products }: { products: Product[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: "", price: 0 });
  const [newForm, setNewForm] = useState({ name: "", category: "Nước uống", price: 0 });
  const [showNew, setShowNew] = useState(false);
  const [isPending, startTransition] = useTransition();

  const categories = Array.from(new Set(products.map((p) => p.category)));

  function startEdit(p: Product) {
    setEditingId(p.id);
    setEditForm({ name: p.name, category: p.category, price: p.price });
  }

  function handleSave(id: string) {
    startTransition(async () => {
      try {
        await updateProduct(id, editForm);
        setEditingId(null);
        toast.success("Đã cập nhật");
      } catch {
        toast.error("Lỗi khi cập nhật");
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Ẩn sản phẩm "${name}"?`)) return;
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success(`Đã ẩn ${name}`);
      } catch {
        toast.error("Lỗi khi xóa");
      }
    });
  }

  function handleCreate() {
    startTransition(async () => {
      try {
        await createProduct(newForm);
        setShowNew(false);
        setNewForm({ name: "", category: "Nước uống", price: 0 });
        toast.success("Đã thêm sản phẩm");
      } catch {
        toast.error("Lỗi khi thêm");
      }
    });
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <Button onClick={() => setShowNew(true)} size="sm" className="gap-1.5">
          <Plus size={16} /> Thêm
        </Button>
      </div>

      {showNew && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-3">
          <p className="font-semibold text-blue-800 text-sm">Sản phẩm mới</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Tên</label>
              <input type="text" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                className="w-full px-2 py-1.5 border rounded text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Danh mục</label>
              <input type="text" value={newForm.category} onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                className="w-full px-2 py-1.5 border rounded text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Giá (VND)</label>
              <input type="number" value={newForm.price} onChange={(e) => setNewForm({ ...newForm, price: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border rounded text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={isPending || !newForm.name}>Lưu</Button>
            <Button size="sm" variant="outline" onClick={() => setShowNew(false)}>Hủy</Button>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-xl divide-y">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 px-4 py-3">
            {editingId === product.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="flex-1 px-2 py-1 border rounded text-sm" />
                <input type="text" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-24 px-2 py-1 border rounded text-sm" />
                <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                  className="w-24 px-2 py-1 border rounded text-sm" />
                <button onClick={() => handleSave(product.id)} disabled={isPending} className="text-green-500 hover:text-green-700">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.category}</p>
                </div>
                <span className="font-semibold text-green-600">{formatVND(product.price)}</span>
                <button onClick={() => startEdit(product)} className="text-gray-400 hover:text-blue-500">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(product.id, product.name)} disabled={isPending} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-center text-gray-400 py-8 text-sm">Chưa có sản phẩm</p>
        )}
      </div>
    </div>
  );
}
