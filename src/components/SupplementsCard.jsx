import { useEffect, useState } from "react";
import { Pill, Plus, Loader2, Trash2, Check, X, Edit2 } from "lucide-react";
import {
  getMySupplements, createSupplement, updateSupplement,
  deleteSupplement, toggleSupplementStatus
} from "../lib/supplementsApi";

export default function SupplementsCard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const reload = () => {
    setLoading(true);
    getMySupplements()
      .then(setItems)
      .catch((err) => {
        console.error(err);
        setError("Не удалось загрузить");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const taking = items.filter((s) => s.status === "taking");
  const finished = items.filter((s) => s.status === "finished");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <Pill size={16} className="text-purple-600" />
        <p className="text-[14px] font-medium text-gray-900 flex-1">Витамины и препараты</p>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-[12px] font-medium text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          >
            <Plus size={12} />
            Добавить
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-[12px] text-red-700">
            {error}
          </div>
        )}

        {adding && (
          <AddForm
            onCancel={() => setAdding(false)}
            onSave={async (payload) => {
              try {
                await createSupplement(payload);
                setAdding(false);
                reload();
              } catch (err) {
                console.error(err);
                alert(err.message || "Не удалось сохранить");
              }
            }}
          />
        )}

        {loading ? (
          <div className="py-6 flex justify-center">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : items.length === 0 && !adding ? (
          <div className="text-center py-4">
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Добавь что принимаешь — фолиевую кислоту, витамин D, железо.<br/>
              Врач увидит назначения когда откроет ссылку.
            </p>
          </div>
        ) : (
          <>
            {taking.length > 0 && (
              <div className="space-y-1.5">
                {taking.map((s) => (
                  <SupplementRow
                    key={s.id}
                    item={s}
                    editing={editingId === s.id}
                    busy={busyId === s.id}
                    onStartEdit={() => setEditingId(s.id)}
                    onCancelEdit={() => setEditingId(null)}
                    onSaveEdit={async (patch) => {
                      setBusyId(s.id);
                      try {
                        await updateSupplement(s.id, patch);
                        setEditingId(null);
                        reload();
                      } catch (err) {
                        console.error(err);
                        alert(err.message || "Не удалось обновить");
                      } finally {
                        setBusyId(null);
                      }
                    }}
                    onToggle={async () => {
                      setBusyId(s.id);
                      try {
                        await toggleSupplementStatus(s.id, s.status);
                        reload();
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setBusyId(null);
                      }
                    }}
                    onDelete={async () => {
                      if (!confirm("Удалить запись?")) return;
                      setBusyId(s.id);
                      try {
                        await deleteSupplement(s.id);
                        reload();
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setBusyId(null);
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {finished.length > 0 && (
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Закончила</p>
                {finished.map((s) => (
                  <SupplementRow
                    key={s.id}
                    item={s}
                    editing={editingId === s.id}
                    busy={busyId === s.id}
                    onStartEdit={() => setEditingId(s.id)}
                    onCancelEdit={() => setEditingId(null)}
                    onSaveEdit={async (patch) => {
                      setBusyId(s.id);
                      try {
                        await updateSupplement(s.id, patch);
                        setEditingId(null);
                        reload();
                      } catch (err) {
                        console.error(err);
                        alert(err.message || "Не удалось обновить");
                      } finally {
                        setBusyId(null);
                      }
                    }}
                    onToggle={async () => {
                      setBusyId(s.id);
                      try {
                        await toggleSupplementStatus(s.id, s.status);
                        reload();
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setBusyId(null);
                      }
                    }}
                    onDelete={async () => {
                      if (!confirm("Удалить запись?")) return;
                      setBusyId(s.id);
                      try {
                        await deleteSupplement(s.id);
                        reload();
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setBusyId(null);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AddForm({ onCancel, onSave }) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [status, setStatus] = useState("taking");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave({ name, dose, status });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-purple-50 border border-purple-200 rounded-xl p-3 space-y-2">
      <div>
        <label className="block text-[11px] font-medium text-gray-600 mb-1">Название</label>
        <input
          type="text"
          required
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Фолиевая кислота"
          className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
        />
      </div>
      <div>
        <label className="block text-[11px] font-medium text-gray-600 mb-1">Дозировка</label>
        <input
          type="text"
          value={dose}
          onChange={(e) => setDose(e.target.value)}
          placeholder="400 мкг · 1 раз в день"
          className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
        />
      </div>
      <div>
        <label className="block text-[11px] font-medium text-gray-600 mb-1">Статус</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
        >
          <option value="taking">Принимаю</option>
          <option value="finished">Закончила</option>
        </select>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="flex-1 py-2 text-[12px] font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {saving && <Loader2 size={12} className="animate-spin" />}
          Сохранить
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-[12px] font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

function SupplementRow({ item, editing, busy, onStartEdit, onCancelEdit, onSaveEdit, onToggle, onDelete }) {
  const [editName, setEditName] = useState(item.name);
  const [editDose, setEditDose] = useState(item.dose || "");
  const [editStatus, setEditStatus] = useState(item.status);

  useEffect(() => {
    if (editing) {
      setEditName(item.name);
      setEditDose(item.dose || "");
      setEditStatus(item.status);
    }
  }, [editing, item]);

  if (editing) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 space-y-2">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-full px-2.5 py-1.5 text-[13px] border border-gray-200 rounded-lg outline-none focus:border-purple-500 bg-white"
        />
        <input
          type="text"
          value={editDose}
          onChange={(e) => setEditDose(e.target.value)}
          placeholder="Дозировка"
          className="w-full px-2.5 py-1.5 text-[12px] border border-gray-200 rounded-lg outline-none focus:border-purple-500 bg-white"
        />
        <select
          value={editStatus}
          onChange={(e) => setEditStatus(e.target.value)}
          className="w-full px-2.5 py-1.5 text-[12px] border border-gray-200 rounded-lg bg-white"
        >
          <option value="taking">Принимаю</option>
          <option value="finished">Закончила</option>
        </select>
        <div className="flex gap-1.5">
          <button
            onClick={() => onSaveEdit({ name: editName, dose: editDose, status: editStatus })}
            disabled={busy || !editName.trim()}
            className="flex-1 py-1.5 text-[11px] font-medium text-white bg-purple-600 rounded-lg disabled:opacity-50"
          >
            Сохранить
          </button>
          <button
            onClick={onCancelEdit}
            className="px-3 py-1.5 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg"
          >
            Отмена
          </button>
        </div>
      </div>
    );
  }

  const isTaking = item.status === "taking";
  return (
    <div className={"rounded-xl px-3 py-2 flex items-center gap-2 " + (isTaking ? "bg-purple-50/50 border border-purple-100" : "bg-gray-50")}>
      <button
        onClick={onToggle}
        disabled={busy}
        title={isTaking ? "Отметить как закончилась" : "Снова принимаю"}
        className={"w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition " + (isTaking ? "bg-emerald-500 hover:bg-emerald-600" : "bg-gray-300 hover:bg-gray-400")}
      >
        {busy ? <Loader2 size={10} className="animate-spin text-white" /> : isTaking ? <Check size={11} className="text-white" strokeWidth={3} /> : null}
      </button>
      <div className="flex-1 min-w-0">
        <p className={"text-[13px] font-medium truncate " + (isTaking ? "text-gray-900" : "text-gray-500 line-through")}>
          {item.name}
        </p>
        {item.dose && (
          <p className="text-[11px] text-gray-500 truncate">{item.dose}</p>
        )}
      </div>
      <button
        onClick={onStartEdit}
        className="text-gray-400 hover:text-purple-600 p-1"
        title="Изменить"
      >
        <Edit2 size={12} />
      </button>
      <button
        onClick={onDelete}
        disabled={busy}
        className="text-gray-400 hover:text-rose-600 p-1"
        title="Удалить"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
