import { useState, useRef } from "react";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { recognizeAnalysis } from "../lib/recognizeAnalysis";

export default function LabAnalysisUpload({ onRecognized, onCancel }) {
  const [file, setFile] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("Файл слишком большой. Максимум 10 МБ.");
      return;
    }
    setFile(selectedFile);
  };

  const handleRecognize = async () => {
    if (!file) return;
    setIsRecognizing(true);
    setError(null);
    try {
      const result = await recognizeAnalysis(file);
      if (!result.markers || result.markers.length === 0) {
        setError("AI не нашёл показателей. Проверь, что на файле виден медицинский анализ.");
        return;
      }
      onRecognized?.(result);
    } catch (err) {
      console.error(err);
      setError(err.message || "Не удалось распознать. Попробуй ещё раз.");
    } finally {
      setIsRecognizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-3">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-4 py-3.5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-gray-900 leading-tight">Загрузить анализ</p>
              <p className="text-[12px] text-gray-500 leading-tight mt-0.5">Шаг 1 из 3 · Выбор файла</p>
            </div>
            <button onClick={onCancel} className="p-1 text-gray-500 hover:text-gray-900">
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            {!file ? (
              <button
                onClick={() => inputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-xl py-10 px-4 flex flex-col items-center gap-3 transition"
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Upload size={20} className="text-purple-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">Выбери файл</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">PDF или фото · до 10 МБ</p>
                </div>
              </button>
            ) : (
              <div className="bg-gray-50 rounded-lg px-3 py-3 flex items-center gap-3">
                <FileText size={20} className="text-gray-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-[11px] text-gray-500">{(file.size / 1024).toFixed(0)} КБ</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                  disabled={isRecognizing}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,image/jpeg,image/png,.heic"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              className="hidden"
            />
            {error && (
              <p className="mt-3 text-[12px] text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <p className="mt-4 text-[11px] text-gray-500 leading-relaxed">
              Загружая файл, ты соглашаешься с обработкой данных. Файл удалится после распознавания.
            </p>
          </div>
          <div className="flex gap-2 px-4 py-3 border-t border-gray-200">
            <button
              onClick={onCancel}
              disabled={isRecognizing}
              className="flex-1 py-3 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              onClick={handleRecognize}
              disabled={!file || isRecognizing}
              className="flex-[2] py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isRecognizing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Распознаём...
                </>
              ) : (
                "Распознать"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
