import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Heart } from "lucide-react";
import { getMyProfile, upsertProfile, calculatePregnancyWeek } from "../lib/profileApi";

export default function ProfileScreen({ onBack }) {
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        if (profile?.due_date) setDueDate(profile.due_date);
      })
      .catch((err) => {
        console.error(err);
        setError("Не удалось загрузить профиль");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      await upsertProfile({ dueDate });
      setSuccess(true);
      setTimeout(() => onBack?.(), 800);
    } catch (err) {
      console.error(err);
      setError(err.message || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  const week = calculatePregnancyWeek(dueDate);

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-3">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-4 py-3.5 border-b border-gray-200 flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-1 -ml-1 text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
            </button>
            <p className="text-[15px] font-medium text-gray-900">Профиль</p>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="text-center bg-pink-50 rounded-xl py-4 px-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-pink-200 flex items-center justify-center mb-2">
                  <Heart size={18} className="text-pink-700" fill="currentColor" />
                </div>
                {week ? (
                  <>
                    <p className="text-2xl font-medium text-pink-900">
                      {week.weeks} нед {week.days > 0 && `${week.days} дн`}
                    </p>
                    <p className="text-[12px] text-pink-700 mt-0.5">
                      твой срок сегодня
                    </p>
                  </>
                ) : (
                  <p className="text-[13px] text-pink-800">
                    Введи ПДР — посчитаем срок
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Предполагаемая дата родов
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Если не знаешь точно — посмотри в обменной карте, или спроси у врача.
                </p>
              </div>

              {error && (
                <div className="text-[12px] text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-[12px] text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                  Сохранено
                </div>
              )}

              <button
                type="submit"
                disabled={saving || !dueDate}
                className="w-full py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Сохранить
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
