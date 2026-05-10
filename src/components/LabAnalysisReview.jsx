import { useState, useMemo } from "react";
import { ArrowLeft, FileText, AlertTriangle, Check, Plus } from "lucide-react";

function getMarkerStatus(marker) {
  if (typeof marker.aiConfidence === "number" && marker.aiConfidence < 0.8) {
    return "uncertain";
  }
  const num = parseFloat(String(marker.value).replace(",", "."));
  if (Number.isNaN(num)) return "uncertain";
  if (typeof marker.normMin === "number" && num < marker.normMin) return "low";
  if (typeof marker.normMax === "number" && num > marker.normMax) return "high";
  return "ok";
}

function MarkerRow({ marker, onChange }) {
  const status = getMarkerStatus(marker);
  const isUncertain = status === "uncertain";

  const containerCls = isUncertain
    ? "bg-amber-50 border border-amber-300"
    : "bg-gray-50 border border-transparent";

  const dotCls = {
    ok: "bg-green-500",
    low: "bg-blue-500",
    high: "bg-red-500",
    uncertain: "bg-amber-500",
  }[status];

  const inputCls = isUncertain
    ? "border-amber-400 text-amber-900"
    : "border-gray-200 text-gray-900";

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg ${containerCls}`}>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-900 flex items-center gap-1.5">
          <span className="truncate">{marker.name}</span>
          {isUncertain && (
            <span className="text-[11px] font-normal text-amber-800 inline-flex items-center gap-1 shrink-0">
              <AlertTriangle size={11} strokeWidth={2.5} />
              AI не уверен
            </span>
          )}
        </p>
        <p className={`text-[11px] ${isUncertain ? "text-amber-800" : "text-gray-500"}`}>
          {marker.normLabel}
        </p>
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={marker.value}
        onChange={(e) => onChange({ ...marker, value: e.target.value })}
        className={`w-16 text-right px-2 py-1.5 text-sm font-medium rounded-md bg-white border outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${inputCls}`}
      />
      <span className="text-[11px] text-gray-500 min-w-[22px] shrink-0">{marker.unit}</span>
      <div className={`w-2 h-2 rounded-full shrink-0 ${dotCls}`} />
    </div>
  );
}

export default function LabAnalysisReview({
  pregnancyWeek = 28,
  fileName = "Анализ.pdf",
  analysisType = "Общий анализ крови",
  analysisDate = "",
  initialMarkers = [],
  initialVisibleCount = 5,
  onSave,
  onCancel,
  onReplaceFile,
}) {
  const [markers, setMarkers] = useState(initialMarkers);
  const [showAll, setShowAll] = useState(false);

  const visibleMarkers = showAll ? markers : markers.slice(0, initialVisibleCount);
  const hiddenCount = Math.max(0, markers.length - initialVisibleCount);

  const uncertainCount = useMemo(
    () => markers.filter((m) => getMarkerStatus(m) === "uncertain").length,
    [markers]
  );

  const handleMarkerChange = (updated) => {
    setMarkers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-3">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <button onClick={onCancel} className="p-1 -ml-1 text-gray-500 hover:text-gray-900">
                <ArrowLeft size={20} />
              </button>
              <div>
                <p className="text-[15px] font-medium text-gray-900 leading-tight">Новый анализ</p>
                <p className="text-[12px] text-gray-500 leading-tight mt-0.5">Шаг 2 из 3 · Проверка данных</p>
              </div>
            </div>
            <div className="bg-purple-100 text-purple-800 text-[11px] font-medium px-2.5 py-1 rounded-full">
              {pregnancyWeek} нед
            </div>
          </div>

          <div className="flex gap-2.5 items-start px-4 py-3 bg-pink-50 border-b border-gray-200">
            <div className="w-7 h-7 rounded-full bg-pink-300 flex items-center justify-center shrink-0">
              <Check size={14} strokeWidth={3} className="text-pink-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-pink-900 leading-tight">
                Распознали {markers.length} показателей
                {uncertainCount > 0 && (
                  <span className="font-normal"> · {uncertainCount} требует проверки</span>
                )}
              </p>
              <p className="text-[12px] text-pink-800 leading-snug mt-0.5">
                Проверь значения — особенно те, где AI не уверен. Можно исправить вручную.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText size={16} className="text-gray-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{fileName}</p>
                <p className="text-[11px] text-gray-500">
                  {analysisType}{analysisDate && ` · ${analysisDate}`}
                </p>
              </div>
            </div>
            {onReplaceFile && (
              <button
                onClick={onReplaceFile}
                className="text-[12px] text-gray-600 hover:text-gray-900 px-2.5 py-1 rounded-md border border-gray-200 hover:border-gray-300 shrink-0 ml-2"
              >
                Заменить
              </button>
            )}
          </div>

          <div className="px-4 py-3 space-y-2">
            {visibleMarkers.map((marker) => (
              <MarkerRow key={marker.id} marker={marker} onChange={handleMarkerChange} />
            ))}
            {!showAll && hiddenCount > 0 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-1 text-[12px] text-gray-500 hover:text-gray-900 border border-dashed border-gray-300 hover:border-gray-400 rounded-lg"
              >
                <Plus size={12} />
                Показать ещё {hiddenCount}
              </button>
            )}
          </div>

          <div className="flex gap-2 px-4 py-3 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="flex-1 py-3 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg"
            >
              Отмена
            </button>
            <button
              onClick={() => onSave?.(markers)}
              className="flex-[2] py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              Сохранить в дашборд
            </button>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-3 px-2 leading-relaxed">
          Данные хранятся зашифрованно. Только ты решаешь, кому показать.
        </p>
      </div>
    </div>
  );
}
