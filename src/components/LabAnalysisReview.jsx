import { useState } from "react";
import {
  CheckCircle, RotateCcw, ChevronDown, ChevronRight,
  AlertTriangle, Sparkles, X, FlaskConical
} from "lucide-react";

const ANALYSIS_TYPES = [
  "Общий анализ крови",
  "Биохимия крови",
  "Общий анализ мочи",
  "Посев на флору",
  "Гормоны",
  "Коагулограмма",
  "Витамины и микроэлементы",
  "Другое",
];

function getConfidenceLevel(confidence) {
  if (confidence >= 0.9) return "high";
  if (confidence >= 0.7) return "medium";
  return "low";
}

function getConfidenceStyle(level) {
  if (level === "high") return {
    label: "AI уверен", color: "text-emerald-700", bg: "bg-emerald-50",
    border: "border-emerald-200", dot: "bg-emerald-500"
  };
  if (level === "medium") return {
    label: "Проверь", color: "text-amber-700", bg: "bg-amber-50",
    border: "border-amber-200", dot: "bg-amber-500"
  };
  return {
    label: "Низкая уверенность", color: "text-rose-700", bg: "bg-rose-50",
    border: "border-rose-200", dot: "bg-rose-500"
  };
}

function getMarkerStatus(marker) {
  const value = parseFloat(String(marker.value).replace(",", "."));
  if (Number.isNaN(value)) return "normal";
  if (typeof marker.normMin === "number" && value < marker.normMin) return "low";
  if (typeof marker.normMax === "number" && value > marker.normMax) return "high";
  return "normal";
}

export default function LabAnalysisReview({
  pregnancyWeek = 28,
  fileName = "",
  analysisType = "Анализ",
  analysisDate = "",
  initialMarkers = [],
  onSave,
  onCancel,
  onReplaceFile,
}) {
  const [markers, setMarkers] = useState(initialMarkers);
  const [type, setType] = useState(analysisType || "Другое");
  const [editingId, setEditingId] = useState(null);
  const [showLowConfidence, setShowLowConfidence] = useState(false);

  const total = markers.length;
  const lowConfidenceCount = markers.filter(
    (m) => getConfidenceLevel(m.aiConfidence == null ? 1 : m.aiConfidence) !== "high"
  ).length;
  const abnormalCount = markers.filter((m) => getMarkerStatus(m) !== "normal").length;

  const handleValueChange = (id, newValue) => {
    setMarkers((prev) => prev.map((m) =>
      m.id === id ? Object.assign({}, m, { value: newValue, aiConfidence: 1 }) : m
    ));
  };

  const handleSave = () => {
    if (onSave) onSave(markers, type);
  };

  const lowConfidenceMarkers = markers.filter(
    (m) => getConfidenceLevel(m.aiConfidence == null ? 1 : m.aiConfidence) !== "high"
  );
  const highConfidenceMarkers = markers.filter(
    (m) => getConfidenceLevel(m.aiConfidence == null ? 1 : m.aiConfidence) === "high"
  );

  const aiSaidOther = (analysisType || "").toLowerCase() === "другое";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-4 px-3">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

          {/* Шапка с дропдауном типа */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical size={16} className="text-purple-600 shrink-0" />
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                Тип анализа
              </p>
            </div>

            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-[14px] font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                {ANALYSIS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
              {analysisDate && (
                <span>{analysisDate}</span>
              )}
              <span>{pregnancyWeek} нед</span>
              {fileName && (
                <span className="truncate flex-1" title={fileName}>· {fileName}</span>
              )}
            </div>

            {aiSaidOther && (
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                <p className="text-[11px] text-amber-800 leading-snug">
                  💡 AI не смог определить тип точно — поправь сверху, если знаешь
                </p>
              </div>
            )}
          </div>

          {/* Сводка */}
          <div className="px-4 py-3 bg-gradient-to-br from-pink-50 to-purple-50 border-b border-gray-100">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-serif font-medium text-gray-900 leading-none">{total}</p>
                <p className="text-[10px] text-gray-500 mt-1">показателей</p>
              </div>
              <div>
                <p className={"text-2xl font-serif font-medium leading-none " + (abnormalCount > 0 ? "text-rose-600" : "text-emerald-600")}>
                  {abnormalCount}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">вне нормы</p>
              </div>
              <div>
                <p className={"text-2xl font-serif font-medium leading-none " + (lowConfidenceCount > 0 ? "text-amber-600" : "text-emerald-600")}>
                  {lowConfidenceCount}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">проверить</p>
              </div>
            </div>
          </div>

          {/* Низкая уверенность - наверху */}
          {lowConfidenceMarkers.length > 0 && (
            <div className="border-b border-gray-100">
              <button
                onClick={() => setShowLowConfidence(!showLowConfidence)}
                className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-amber-50 transition text-left"
              >
                <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                <p className="text-[12px] font-medium text-gray-900 flex-1">
                  Требуют проверки <span className="text-gray-400 font-normal">· {lowConfidenceMarkers.length}</span>
                </p>
                {showLowConfidence ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
              </button>
              {showLowConfidence && (
                <div className="px-4 pb-3 space-y-2">
                  {lowConfidenceMarkers.map((m) => (
                    <MarkerRow key={m.id} marker={m} editing={editingId === m.id}
                      onEdit={() => setEditingId(m.id)}
                      onCommit={(v) => { handleValueChange(m.id, v); setEditingId(null); }}
                      onCancel={() => setEditingId(null)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Все распознанные хорошо */}
          {highConfidenceMarkers.length > 0 && (
            <div>
              <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
                <Sparkles size={14} className="text-emerald-600 shrink-0" />
                <p className="text-[12px] font-medium text-gray-900">
                  AI распознал <span className="text-gray-400 font-normal">· {highConfidenceMarkers.length}</span>
                </p>
              </div>
              <div className="px-4 py-3 space-y-2">
                {highConfidenceMarkers.map((m) => (
                  <MarkerRow key={m.id} marker={m} editing={editingId === m.id}
                    onEdit={() => setEditingId(m.id)}
                    onCommit={(v) => { handleValueChange(m.id, v); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
            <button onClick={onCancel}
              className="px-3 py-2.5 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg flex items-center gap-1.5"
            >
              <X size={14} />
              Отмена
            </button>
            {onReplaceFile && (
              <button onClick={onReplaceFile}
                className="px-3 py-2.5 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                Заменить файл
              </button>
            )}
            <button onClick={handleSave}
              className="flex-1 py-2.5 text-[13px] font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center gap-1.5"
            >
              <CheckCircle size={14} />
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarkerRow({ marker, editing, onEdit, onCommit, onCancel }) {
  const [draft, setDraft] = useState(marker.value);
  const level = getConfidenceLevel(marker.aiConfidence == null ? 1 : marker.aiConfidence);
  const conf = getConfidenceStyle(level);
  const status = getMarkerStatus(marker);

  return (
    <div className="flex items-baseline gap-2 py-1.5">
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-gray-900 truncate">{marker.name}</p>
        {marker.normLabel && (
          <p className="text-[10px] text-gray-400">{marker.normLabel}</p>
        )}
      </div>
      {editing ? (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onCommit(draft);
              if (e.key === "Escape") onCancel();
            }}
            className="w-20 px-2 py-0.5 text-[12px] border border-purple-500 rounded outline-none"
          />
          <button onClick={() => onCommit(draft)} className="text-emerald-600 hover:text-emerald-800">
            <CheckCircle size={14} />
          </button>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-700">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button onClick={onEdit} className="flex items-center gap-1 group">
          <span className={"text-[12px] font-medium " + (
            status === "high" ? "text-rose-600" : status === "low" ? "text-blue-600" : "text-gray-900"
          )}>
            {marker.value} <span className="text-[10px] text-gray-400 font-normal">{marker.unit}</span>
          </span>
          {level !== "high" && (
            <span className={"w-1.5 h-1.5 rounded-full " + conf.dot} title={conf.label} />
          )}
        </button>
      )}
    </div>
  );
}
