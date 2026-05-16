import { Pill, Check } from "lucide-react";

/**
 * Read-only карточка витаминов для врача (SharedView).
 * Принимает items напрямую — не делает запросов в Supabase.
 */
export default function SharedSupplementsCard({ items }) {
  if (!items || items.length === 0) return null;

  const taking = items.filter((s) => s.status === "taking");
  const finished = items.filter((s) => s.status === "finished");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <Pill size={16} className="text-purple-600" />
        <p className="text-[14px] font-medium text-gray-900 flex-1">Витамины и препараты</p>
        <span className="text-[11px] text-gray-400">{taking.length} из {items.length}</span>
      </div>

      <div className="p-4 space-y-3">
        {taking.length > 0 && (
          <div className="space-y-1.5">
            {taking.map((s) => (
              <div key={s.id} className="bg-purple-50/50 border border-purple-100 rounded-xl px-3 py-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">{s.name}</p>
                  {s.dose && <p className="text-[11px] text-gray-500 truncate">{s.dose}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {finished.length > 0 && (
          <div className="border-t border-gray-100 pt-3 space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Закончила</p>
            {finished.map((s) => (
              <div key={s.id} className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-500 line-through truncate">{s.name}</p>
                  {s.dose && <p className="text-[11px] text-gray-400 truncate">{s.dose}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
