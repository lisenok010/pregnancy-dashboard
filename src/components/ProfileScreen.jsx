import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Heart } from "lucide-react";
import {
  getMyProfile, upsertProfile, calculatePregnancyWeek,
  calculateAge, BLOOD_GROUPS, RH_FACTORS, pluralYears
} from "../lib/profileApi";

export default function ProfileScreen({ onBack, isOnboarding = false }) {
  const [firstName, setFirstName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [rhFactor, setRhFactor] = useState("");
  const [loading, setLoading] = useState(!isOnboarding);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOnboarding) {
      setLoading(false);
      return;
    }
    getMyProfile()
      .then((profile) => {
        if (profile) {
          if (profile.first_name) setFirstName(profile.first_name);
          if (profile.due_date) setDueDate(profile.due_date);
          if (profile.birth_date) setBirthDate(profile.birth_date);
          if (profile.blood_group) setBloodGroup(profile.blood_group);
          if (profile.rh_factor) setRhFactor(profile.rh_factor);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Не удалось загрузить профиль");
      })
      .finally(() => setLoading(false));
  }, [isOnboarding]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!firstName.trim()) {
      setError("Имя обязательно");
      return;
    }
    if (!dueDate) {
      setError("Укажи ПДР — без неё нельзя посчитать срок");
      return;
    }

    setSaving(true);
    try {
      await upsertProfile({
        firstName: firstName.trim(),
        dueDate,
        birthDate: birthDate || null,
        bloodGroup: bloodGroup || null,
        rhFactor: rhFactor || null,
      });
      setSuccess(true);
      setTimeout(() => { if (onBack) onBack(); }, 600);
    } catch (err) {
      console.error(err);
      setError(err.message || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  const week = calculatePregnancyWeek(dueDate);
  const age = calculateAge(birthDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-4 px-3">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
            {!isOnboarding && (
              <button onClick={onBack} className="p-1 -ml-1 text-gray-500 hover:text-gray-900">
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <p className="text-[15px] font-medium text-gray-900">
                {isOnboarding ? "Расскажи о себе" : "Профиль"}
              </p>
              {isOnboarding && (
                <p className="text-[12px] text-gray-500 leading-tight mt-0.5">
                  Несколько полей — и продолжим
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 space-y-4">

              {week && (
                <div className="text-center bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100 rounded-2xl py-4 px-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-white/80 flex items-center justify-center mb-2">
                    <Heart size={18} className="text-pink-700" fill="currentColor" />
                  </div>
                  <p className="text-2xl font-serif font-medium text-gray-900">
                    {week.weeks} нед {week.days > 0 && week.days + " дн"}
                  </p>
                  <p className="text-[12px] text-pink-700 mt-0.5">твой срок сегодня</p>
                </div>
              )}

              {/* Имя — обязательно */}
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Имя <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Анна"
                />
              </div>

              {/* ПДР — обязательно */}
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  Предполагаемая дата родов <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Из обменной карты или от врача.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-3">
                  Опционально
                </p>

                {/* Дата рождения */}
                <div className="mb-3">
                  <label className="block text-[12px] font-medium text-gray-700 mb-1">
                    Дата рождения
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  {age !== null && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      {age} {pluralYears(age)}
                    </p>
                  )}
                </div>

                {/* Группа крови + резус — рядом */}
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1">
                      Группа крови
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
                    >
                      <option value="">—</option>
                      {BLOOD_GROUPS.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 mb-1">
                      Резус
                    </label>
                    <select
                      value={rhFactor}
                      onChange={(e) => setRhFactor(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white"
                    >
                      <option value="">—</option>
                      {RH_FACTORS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
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
                disabled={saving}
                className="w-full py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {isOnboarding ? "Продолжить" : "Сохранить"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
