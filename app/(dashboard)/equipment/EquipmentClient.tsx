"use client";

import { useState, useTransition } from "react";
import { createEquipment, updateEquipment, deleteEquipment } from "@/lib/actions/equipment";
import { formatVND } from "@/lib/utils/format";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Equipment = { id: string; name: string; rentalPrice: number; rentalUnit: string; available: number; active: boolean };

export default function EquipmentClient({ equipment }: { equipment: Equipment[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", rentalPrice: 0, available: 1 });
  const [newForm, setNewForm] = useState({ name: "", rentalPrice: 10000, rentalUnit: "PER_USE", available: 1 });
  const [showNew, setShowNew] = useState(false);
  const [isPending, startTransition] = useTransition();

  function startEdit(e: Equipment) {
    setEditingId(e.id);
    setEditForm({ name: e.name, rentalPrice: e.rentalPrice, available: e.available });
  }

  function handleSave(id: string) {
    startTransition(async () => {
      try {
        await updateEquipment(id, editForm);
        setEditingId(null);
        toast.success("Đã cập nhật");
      } catch {
        toast.error("Lỗi khi cập nhật");
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Ẩn dụng cụ "${name}"?`)) return;
    startTransition(async () => {
      try {
        await deleteEquipment(id);
        toast.success(`Đã ẩn ${name}`);
      } catch {
        toast.error("Lỗi khi xóa");
      }
    });
  }

  function handleCreate() {
    startTransition(async () => {
      try {
        await createEquipment(newForm);
        setShowNew(false);
        setNewForm({ name: "", rentalPrice: 10000, rentalUnit: "PER_USE", available: 1 });
        toast.success("Đã thêm dụng cụ");
      } catch {
        toast.error("Lỗi khi thêm");
      }
    });
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý dụng cụ</h1>
        <Button onClick={() => setShowNew(true)} size="sm" className="gap-1.5">
          <Plus size={16} /> Thêm
        </Button>
      </div>

      {showNew && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-3">
          <p className="font-semibold text-blue-800 text-sm">Dụng cụ mới</p>
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-600 mb-1 block">Tên</label>
              <input type="text" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                className="w-full px-2 py-1.5 border rounded text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Giá thuê</label>
              <input type="number" value={newForm.rentalPrice} onChange={(e) => setNewForm({ ...newForm, rentalPrice: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border rounded text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Số lượng</label>
              <input type="number" value={newForm.available} onChange={(e) => setNewForm({ ...newForm, available: Number(e.target.value) })}
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
        {equipment.map((item) => (
          <div key={item.id} className="flex items-center gap-4 px-4 py-3">
            {editingId === item.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="flex-1 px-2 py-1 border rounded text-sm" />
                <input type="number" value={editForm.rentalPrice} onChange={(e) => setEditForm({ ...editForm, rentalPrice: Number(e.target.value) })}
                  className="w-24 px-2 py-1 border rounded text-sm" />
                <input type="number" value={editForm.available} onChange={(e) => setEditForm({ ...editForm, available: Number(e.target.value) })}
                  className="w-16 px-2 py-1 border rounded text-sm" />
                <button onClick={() => handleSave(item.id)} disabled={isPending} className="text-green-500 hover:text-green-700">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">Còn: {item.available}</p>
                </div>
                <span className="font-semibold text-green-600">
                  {formatVND(item.rentalPrice)}/{item.rentalUnit === "PER_USE" ? "lần" : "giờ"}
                </span>
                <button onClick={() => startEdit(item)} className="text-gray-400 hover:text-blue-500">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(item.id, item.name)} disabled={isPending} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        ))}
        {equipment.length === 0 && (
          <p className="text-center text-gray-400 py-8 text-sm">Chưa có dụng cụ</p>
        )}
      </div>
    </div>
  );
}
