import { useEffect, useState } from "react";
import { Plus, FileText, Loader2, Trash2, AlertCircle } from "lucide-react";
import { getMyAnalyses, deleteAnalysis } from "../lib/analysesApi";

export default function AnalysesList({ onAddNew }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyAnalyses();
      setAnalyses(data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить анализы");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Удалить анализ? Это нельзя отменить.")) return;
    setDeletingId(id);
    try {
      await deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-3">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

          <div className="px-4 py-3.5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-gray-900 leading-tight">Мои анализы</p>
              <p className="text-[12px] text-gray-500 leading-tight mt-0.5">
                {analyses.length === 0
                  ? "Ещё нет анализов"
                  : `Сохранено: ${analyses.length}`}
              </p>
            </div>
            <button
              onClick={onAddNew}
              className="bg-purple-600 hover:bg-purple-700 text-white text-[13px] font-medium px-3 py-2 rounded-lg flex items-center gap-1.5"
            >
              <Plus size={14} />
              Добавить
            </button>
          </div>

          {loading && (
            <div className="py-12 flex justify-center">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          )}

          {error && (
            <div className="m-4 px-3 py-3 bg-red-50 text-red-700 text-[13px] rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                {error}
                <button
                  onClick={load}
                  className="block mt-1 text-[12px] underline"
                >
                  Попробовать ещё раз
                </button>
              </div>
            </div>
          )}

          {!loading && !error && analyses.length === 0 && (
            <div className="py-12 px-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <FileText size={20} className="text-purple-600" />
              </div>
              <p className="text-sm text-gray-900 font-medium mb-1">
                Загрузи первый анализ
              </p>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                AI распознает показатели и соберёт всё в одном месте.
              </p>
            </div>
          )}

          {!loading && analyses.length > 0 && (
            <div className="divide-y divide-gray-100">
              {analyses.map((a) => (
                <AnalysisRow
                  key={a.id}
                  analysis={a}
                  onDelete={() => handleDelete(a.id)}
                  isDeleting={deletingId === a.id}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-3 px-2">
          Данные хранятся зашифрованно. Только ты решаешь, кому показать.
        </p>
      </div>
    </div>
  );
}

function AnalysisRow({ analysis, onDelete, isDeleting }) {
  const markersCount = Array.isArray(analysis.markers) ? analysis.markers.length : 0;
  const dateStr = formatDate(analysis.analysis_date) || formatDate(analysis.created_at);

  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
        <FileText size={16} className="text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-900 truncate">
          {analysis.analysis_type}
        </p>
        <p className="text-[11px] text-gray-500">
          {dateStr} · {markersCount} показателей
        </p>
      </div>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
        aria-label="Удалить"
      >
        {isDeleting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
