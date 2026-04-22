"use client";

import { useState, useTransition } from "react";
import { createVenue, updateVenue, deleteVenue } from "@/lib/actions/venues";
import { formatVND } from "@/lib/utils/format";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Venue = { id: string; name: string; type: string; hourlyRate: number; status: string };

interface Props {
  venues: Venue[];
}

export default function SettingsClient({ venues }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", hourlyRate: 0 });
  const [newForm, setNewForm] = useState({ name: "", type: "BILLIARD", hourlyRate: 50000 });
  const [showNew, setShowNew] = useState(false);
  const [isPending, startTransition] = useTransition();

  function startEdit(v: Venue) {
    setEditingId(v.id);
    setEditForm({ name: v.name, hourlyRate: v.hourlyRate });
  }

  function handleSaveEdit(id: string) {
    startTransition(async () => {
      try {
        await updateVenue(id, { name: editForm.name, hourlyRate: editForm.hourlyRate });
        setEditingId(null);
        toast.success("Đã cập nhật");
      } catch {
        toast.error("Lỗi khi cập nhật");
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Xóa ${name}?`)) return;
    startTransition(async () => {
      try {
        await deleteVenue(id);
        toast.success(`Đã xóa ${name}`);
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Lỗi khi xóa");
      }
    });
  }

  function handleCreate() {
    startTransition(async () => {
      try {
        await createVenue(newForm);
        setShowNew(false);
        setNewForm({ name: "", type: "BILLIARD", hourlyRate: 50000 });
        toast.success("Đã thêm bàn/sân");
      } catch {
        toast.error("Lỗi khi thêm");
      }
    });
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt bàn & sân</h1>
        <Button onClick={() => setShowNew(true)} size="sm" className="gap-1.5">
          <Plus size={16} /> Thêm bàn/sân
        </Button>
      </div>

      {/* New venue form */}
      {showNew && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-3">
          <p className="font-semibold text-blue-800 text-sm">Thêm bàn/sân mới</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Tên</label>
              <input
                type="text"
                value={newForm.name}
                onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                placeholder="VD: Bàn 6"
                className="w-full px-2 py-1.5 border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Loại</label>
              <select
                value={newForm.type}
                onChange={(e) => setNewForm({ ...newForm, type: e.target.value })}
                className="w-full px-2 py-1.5 border rounded text-sm bg-white"
              >
                <option value="BILLIARD">Bida</option>
                <option value="COURT">Sân thể thao</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Giá/giờ (VND)</label>
              <input
                type="number"
                value={newForm.hourlyRate}
                onChange={(e) => setNewForm({ ...newForm, hourlyRate: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border rounded text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={isPending || !newForm.name}>
              Lưu
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowNew(false)}>
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Venue list */}
      <div className="bg-white border rounded-xl divide-y">
        {venues.map((venue) => (
          <div key={venue.id} className="flex items-center gap-4 px-4 py-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
              {venue.type === "BILLIARD" ? "🎱" : "⚽"}
            </div>

            {editingId === venue.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
                <input
                  type="number"
                  value={editForm.hourlyRate}
                  onChange={(e) => setEditForm({ ...editForm, hourlyRate: Number(e.target.value) })}
                  className="w-28 px-2 py-1 border rounded text-sm"
                />
                <button onClick={() => handleSaveEdit(venue.id)} disabled={isPending} className="text-green-500 hover:text-green-700">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{venue.name}</p>
                  <p className="text-xs text-gray-400">{formatVND(venue.hourlyRate)}/giờ</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  venue.status === "OCCUPIED" ? "bg-red-100 text-red-600" :
                  venue.status === "MAINTENANCE" ? "bg-gray-100 text-gray-600" :
                  "bg-green-100 text-green-600"
                }`}>
                  {venue.status === "OCCUPIED" ? "Đang dùng" : venue.status === "MAINTENANCE" ? "Bảo trì" : "Trống"}
                </span>
                <button onClick={() => startEdit(venue)} className="text-gray-400 hover:text-blue-500">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(venue.id, venue.name)} disabled={isPending} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        ))}
        {venues.length === 0 && (
          <p className="text-center text-gray-400 py-8 text-sm">Chưa có bàn/sân nào</p>
        )}
      </div>
    </div>
  );
}
