import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";
import {
  Loader2, Heart, AlertCircle, TrendingUp, TrendingDown,
  Sparkles, FlaskConical, FileText, Eye, ShieldCheck, AlertTriangle
} from "lucide-react";
import { getSharedData, getTokenFromHash } from "../lib/sharedDataApi";
import SharedSupplementsCard from "./SharedSupplementsCard";
import { calculatePregnancyWeek, calculateAge, formatBloodInfo, pluralYears } from "../lib/profileApi";
import { categorizeAnalysis, getCategoryLabel } from "../lib/analysisTypes";

const TYPE_FILTERS = [
  { id: "all", label: "Все" },
  { id: "blood", label: "Кровь" },
  { id: "biochem", label: "Биохимия" },
  { id: "hormones", label: "Гормоны" },
  { id: "urine", label: "Моча" },
  { id: "coag", label: "Коагулограмма" },
];

function getDisplayTitle(analysis) {
  const type = (analysis.analysis_type || "").trim();
  const isVague = !type || type.toLowerCase() === "другое" || type.toLowerCase() === "анализ";
  if (!isVague) return type;
  const first = (analysis.markers || [])[0];
  if (first && first.name) return first.name;
  return getCategoryLabel(analysis._category) || "Анализ";
}

function dedupAnalyses(analyses) {
  const groups = new Map();
  for (const a of analyses) {
    const markersKey = (a.markers || [])
      .map(function (m) { return m.id + "=" + m.value; })
      .sort()
      .join("|");
    const key = (a.analysis_date || a.created_at) + "__" + markersKey;
    if (!groups.has(key)) {
      groups.set(key, Object.assign({}, a, { _duplicates: [] }));
    } else {
      groups.get(key)._duplicates.push(a);
    }
  }
  return Array.from(groups.values());
}

function pluralAnalyses(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "анализ";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "анализа";
  return "анализов";
}

function pluralMarkers(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "показатель";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "показателя";
  return "показателей";
}

function pluralDeviations(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "отклонение";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "отклонения";
  return "отклонений";
}

function formatShort(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

function formatRusDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function SharedView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const token = getTokenFromHash();
    if (!token) {
      setErrorCode("invalid");
      setErrorMessage("Токен не найден в ссылке");
      setLoading(false);
      return;
    }

    getSharedData(token)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorCode(err.code || "error");
        setErrorMessage(err.message || "Не удалось загрузить данные");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-purple-400" />
      </div>
    );
  }

  if (errorCode) {
    return <ErrorScreen code={errorCode} message={errorMessage} />;
  }

  const profile = data.profile;
  const rawAnalyses = data.analyses || [];

  const analysesWithCategory = rawAnalyses.map((a) =>
    Object.assign({}, a, { _category: categorizeAnalysis(a) })
  );
  const dedupedAnalyses = dedupAnalyses(analysesWithCategory);

  return (
    <SharedDashboard
      profile={profile}
      analyses={dedupedAnalyses}
supplements={data.supplements || []}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
    />
  );
}

function ErrorScreen({ code, message }) {
  let title = "Ссылка недоступна";
  let hint = "Попроси пациентку создать новую ссылку.";
  let Icon = AlertCircle;
  let color = "rose";

  if (code === "expired") {
    title = "Ссылка истекла";
    hint = "Срок действия ссылки закончился. Попроси создать новую.";
    Icon = AlertTriangle;
    color = "amber";
  } else if (code === "not_found") {
    title = "Ссылка не найдена";
    hint = "Возможно, ссылка введена с ошибкой или была удалена.";
  } else if (code === "invalid") {
    title = "Некорректная ссылка";
    hint = "В адресе нет токена доступа.";
  }

  const colorClasses = {
    rose: { bg: "bg-rose-100", text: "text-rose-700", icon: "text-rose-600" },
    amber: { bg: "bg-amber-100", text: "text-amber-700", icon: "text-amber-600" },
  }[color];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <div className={"w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3 " + colorClasses.bg}>
          <Icon size={24} className={colorClasses.icon} />
        </div>
        <p className="text-[16px] font-medium text-gray-900 mb-2">{title}</p>
        <p className="text-[13px] text-gray-600 leading-relaxed">{hint}</p>
        {message && (
          <p className="text-[11px] text-gray-400 mt-3 italic">{message}</p>
        )}
      </div>
    </div>
  );
}

function SharedDashboard({ profile, analyses, supplements, activeFilter, setActiveFilter }) {
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const a of analyses) {
      counts[a._category] = (counts[a._category] || 0) + 1;
    }
    return counts;
  }, [analyses]);

  const filteredAnalyses = useMemo(
    () => activeFilter === "all" ? analyses : analyses.filter((a) => a._category === activeFilter),
    [analyses, activeFilter]
  );

  const markersHistory = useMemo(() => {
    const map = new Map();
    for (const analysis of filteredAnalyses) {
      const aDate = analysis.analysis_date || analysis.created_at;
      const week = profile && profile.due_date
        ? calculatePregnancyWeek(profile.due_date, aDate)
        : null;
      for (const m of analysis.markers || []) {
        if (!m.id || !m.value) continue;
        const numericValue = parseFloat(String(m.value).replace(",", "."));
        if (Number.isNaN(numericValue)) continue;
        if (!map.has(m.id)) {
          map.set(m.id, {
            id: m.id, name: m.name, unit: m.unit,
            normMin: m.normMin, normMax: m.normMax, normLabel: m.normLabel,
            points: []
          });
        }
        map.get(m.id).points.push({
          date: aDate,
          week: week ? week.weeks : null,
          value: numericValue,
          analysisId: analysis.id
        });
      }
    }
    for (const entry of map.values()) {
      entry.points.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return Array.from(map.values());
  }, [filteredAnalyses, profile]);

  const currentWeek = profile && profile.due_date ? calculatePregnancyWeek(profile.due_date) : null;

  const abnormalMarkers = useMemo(() => {
    const result = [];
    for (const m of markersHistory) {
      const last = m.points[m.points.length - 1];
      if (!last) continue;
      const isLow = typeof m.normMin === "number" && last.value < m.normMin;
      const isHigh = typeof m.normMax === "number" && last.value > m.normMax;
      if (isLow || isHigh) {
        result.push(Object.assign({}, m, {
          lastValue: last.value,
          lastDate: last.date,
          lastWeek: last.week,
          status: isHigh ? "high" : "low"
        }));
      }
    }
    return result;
  }, [markersHistory]);

  const healthIndex = useMemo(() => {
    const total = markersHistory.length;
    if (total === 0) return null;
    return Math.round(((total - abnormalMarkers.length) / total) * 100);
  }, [markersHistory, abnormalMarkers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-4 px-3 pb-8">
      <div className="max-w-md mx-auto space-y-3">

        {/* Бейдж "просмотр доктора" */}
        <div className="bg-purple-100 border border-purple-200 rounded-xl px-3 py-2 flex items-center gap-2">
          <ShieldCheck size={14} className="text-purple-600 shrink-0" />
          <p className="text-[11px] text-purple-800 leading-tight">
            Режим просмотра для врача — только чтение
          </p>
        </div>

        {profile && profile.first_name && (
          <PatientHeader profile={profile} />
        )}

        <PregnancyCard week={currentWeek} />
<SharedSupplementsCard items={supplements} />

        <div className="grid grid-cols-2 gap-2">
          <HealthIndexCard value={healthIndex} abnormalCount={abnormalMarkers.length} />
          <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col justify-between shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Загружено</p>
            <div>
              <p className="text-3xl font-serif text-gray-900">{analyses.length}</p>
              <p className="text-[11px] text-gray-500">{pluralAnalyses(analyses.length)}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-3 px-3">
          <div className="flex gap-1.5 min-w-max">
            {TYPE_FILTERS.map((f) => {
              const count = f.id === "all" ? analyses.length : (categoryCounts[f.id] || 0);
              const isActive = activeFilter === f.id;
              const isEmpty = count === 0 && f.id !== "all";
              const cls = isActive
                ? "bg-gray-900 text-white"
                : isEmpty
                  ? "bg-white text-gray-300 border border-gray-100 cursor-not-allowed"
                  : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200";
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  disabled={isEmpty}
                  className={"text-[12px] px-3 py-1.5 rounded-full transition whitespace-nowrap flex items-center gap-1.5 " + cls}
                >
                  <span>{f.label}</span>
                  {count > 0 && (
                    <span className={"text-[10px] " + (isActive ? "text-white/80" : "text-gray-400")}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {filteredAnalyses.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-12 px-6 text-center shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <FileText size={20} className="text-purple-600" />
            </div>
            <p className="text-sm text-gray-900 font-medium mb-1">Анализов пока нет</p>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Пациентка ещё не загрузила анализы.
            </p>
          </div>
        )}

        {abnormalMarkers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 pt-1">
              <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wider">На что обратить внимание</p>
              <p className="text-[11px] text-gray-400">{abnormalMarkers.length} {pluralDeviations(abnormalMarkers.length)}</p>
            </div>
            {abnormalMarkers.map((m) => (<AbnormalCard key={m.id} marker={m} />))}
          </div>
        )}

        {filteredAnalyses.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 px-1">
              <FlaskConical size={14} className="text-gray-400" />
              <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wider">
                {activeFilter === "all" ? "Все анализы" : getCategoryLabel(activeFilter)}
              </p>
            </div>
            {filteredAnalyses.map((a) => (
              <AnalysisCard key={a.id} analysis={a} profile={profile} />
            ))}
          </div>
        )}

        {markersHistory.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 px-1">
              <TrendingUp size={14} className="text-gray-400" />
              <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wider">Динамика</p>
            </div>
            {markersHistory.map((m) => (<MarkerChart key={m.id} marker={m} />))}
          </div>
        )}

        <div className="pt-4 pb-2 text-center">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Данные загружены через защищённую ссылку.<br />
            Это режим просмотра — изменения недоступны.
          </p>
        </div>
      </div>
    </div>
  );
}

function PatientHeader({ profile }) {
  const age = calculateAge(profile.birth_date);
  const bloodInfo = formatBloodInfo(profile.blood_group, profile.rh_factor);
  const subParts = [];
  if (age !== null) subParts.push(age + " " + pluralYears(age));
  if (bloodInfo) subParts.push(bloodInfo);

  return (
    <div className="bg-white/60 backdrop-blur rounded-2xl border border-white/40 px-4 py-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center shrink-0">
        <Heart size={16} className="text-pink-700" fill="currentColor" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Пациентка</p>
        <p className="text-[15px] font-medium text-gray-900 leading-tight">
          {profile.first_name}
          {subParts.length > 0 && (
            <span className="text-[12px] font-normal text-gray-500 ml-1.5">
              · {subParts.join(" · ")}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function AnalysisCard({ analysis, profile }) {
  const [expanded, setExpanded] = useState(false);
  const markers = analysis.markers || [];
  const dateStr = formatRusDate(analysis.analysis_date || analysis.created_at);
  const week = profile && profile.due_date
    ? calculatePregnancyWeek(profile.due_date, analysis.analysis_date || analysis.created_at)
    : null;
  const title = getDisplayTitle(analysis);

  const abnormalCount = markers.reduce((acc, m) => {
    const v = parseFloat(String(m.value).replace(",", "."));
    if (Number.isNaN(v)) return acc;
    const isLow = typeof m.normMin === "number" && v < m.normMin;
    const isHigh = typeof m.normMax === "number" && v > m.normMax;
    return isLow || isHigh ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <FlaskConical size={16} className="text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-gray-900 truncate">{title}</p>
          <p className="text-[11px] text-gray-500">
            {dateStr}
            {week ? " · " + week.weeks + " нед" : ""}
            {markers.length > 0 ? " · " + markers.length + " " + pluralMarkers(markers.length) : ""}
          </p>
        </div>
        {abnormalCount > 0 && (
          <div className="shrink-0 bg-rose-50 text-rose-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
            {abnormalCount} вне нормы
          </div>
        )}
      </button>
      {expanded && markers.length > 0 && (
        <div className="border-t border-gray-100 px-3 py-2 space-y-1">
          {markers.map((m, i) => {
            const v = parseFloat(String(m.value).replace(",", "."));
            const isNum = !Number.isNaN(v);
            const isLow = isNum && typeof m.normMin === "number" && v < m.normMin;
            const isHigh = isNum && typeof m.normMax === "number" && v > m.normMax;
            const out = isLow || isHigh;
            return (
              <div key={i} className="flex items-baseline justify-between gap-2 py-1">
                <p className="text-[12px] text-gray-700 truncate flex-1">{m.name}</p>
                <p className={"text-[12px] font-medium shrink-0 " + (out ? "text-rose-600" : "text-gray-900")}>
                  {m.value} <span className="text-[10px] text-gray-400 font-normal">{m.unit}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PregnancyCard({ week }) {
  if (!week) {
    return (
      <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100 rounded-3xl p-5 border border-pink-200/50 shadow-sm">
        <p className="text-[14px] font-medium text-gray-900">Срок не указан</p>
      </div>
    );
  }
  const totalDays = week.totalDays;
  const progressPercent = Math.min(100, Math.max(0, (totalDays / 280) * 100));
  const trimester = totalDays < 91 ? "I триместр" : totalDays < 189 ? "II триместр" : "III триместр";
  const daysUntilDue = 280 - totalDays;
  return (
    <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100 rounded-3xl p-5 border border-pink-200/50 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] uppercase tracking-wider text-pink-700 font-medium">Срок беременности</p>
        <span className="bg-white/70 text-purple-800 text-[10px] px-2.5 py-1 rounded-full font-medium backdrop-blur">{trimester}</span>
      </div>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-5xl font-serif font-medium text-gray-900 leading-none">{week.weeks}</span>
        <span className="font-serif text-gray-600 text-base italic">нед</span>
        {week.days > 0 && (
          <>
            <span className="text-3xl font-serif text-gray-900 ml-1">{week.days}</span>
            <span className="font-serif text-gray-600 text-sm italic">дн</span>
          </>
        )}
      </div>
      <p className="text-[12px] text-gray-600 mb-3">
        {daysUntilDue > 0 ? (<>До родов <span className="font-medium text-gray-800">{daysUntilDue} дн.</span></>) : "Скоро роды!"}
      </p>
      <div className="space-y-1.5">
        <div className="h-2 bg-white/60 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-300 via-purple-300 to-amber-200 rounded-full transition-all" style={{ width: progressPercent + "%" }} />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 font-medium uppercase tracking-wider">
          <span>1 нед</span><span>13</span><span>27</span><span>40 нед</span>
        </div>
      </div>
    </div>
  );
}

function HealthIndexCard({ value, abnormalCount }) {
  if (value === null) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col justify-between shadow-sm">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Индекс здоровья</p>
        <div className="flex items-center gap-2 mt-1">
          <Sparkles size={14} className="text-gray-300" />
          <p className="text-[11px] text-gray-400">Нет числовых данных</p>
        </div>
      </div>
    );
  }
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const label = value >= 90 ? "Отлично" : value >= 75 ? "Хорошо" : value >= 60 ? "Внимание" : "Проверь";
  const color = value >= 75 ? "#a78bfa" : value >= 60 ? "#fbbf24" : "#f87171";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2">Индекс здоровья</p>
      <div className="flex items-center gap-2.5">
        <div className="relative w-14 h-14 shrink-0">
          <svg viewBox="0 0 60 60" className="-rotate-90 w-14 h-14">
            <circle cx="30" cy="30" r={radius} stroke="#f3f4f6" strokeWidth="5" fill="none" />
            <circle cx="30" cy="30" r={radius} stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.6s" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-serif font-medium text-gray-900">{value}</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-gray-900">{label}</p>
          <p className="text-[10px] text-gray-500 leading-tight">
            {abnormalCount === 0 ? "всё в норме" : abnormalCount + " " + pluralDeviations(abnormalCount)}
          </p>
        </div>
      </div>
    </div>
  );
}

function AbnormalCard({ marker }) {
  const isHigh = marker.status === "high";
  const Icon = isHigh ? TrendingUp : TrendingDown;
  const color = isHigh ? "text-rose-600 bg-rose-50" : "text-blue-600 bg-blue-50";
  const labelText = isHigh ? "Повышен" : "Понижен";
  const dateStr = formatRusDate(marker.lastDate);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex items-center gap-3">
      <div className={"w-10 h-10 rounded-xl flex items-center justify-center shrink-0 " + color}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={"text-[10px] font-medium uppercase tracking-wider " + (isHigh ? "text-rose-600" : "text-blue-600")}>{labelText}</p>
        <p className="text-[14px] font-medium text-gray-900 truncate">{marker.name}</p>
        <p className="text-[11px] text-gray-500">
          <span className="font-medium text-gray-700">{marker.lastValue} {marker.unit}</span>
          {" · "}{marker.normLabel ? marker.normLabel.replace("Норма: ", "норма ") : ""}
        </p>
        {(dateStr || marker.lastWeek !== null) && (
          <p className="text-[10px] text-gray-400 mt-0.5">
            {dateStr}
            {marker.lastWeek !== null ? (dateStr ? " · " : "") + marker.lastWeek + " нед" : ""}
          </p>
        )}
      </div>
    </div>
  );
}

function MarkerChart({ marker }) {
  const { name, unit, normMin, normMax, points } = marker;
  const last = points[points.length - 1];
  const prev = points.length > 1 ? points[points.length - 2] : null;
  const trend = prev ? last.value - prev.value : 0;
  const allValues = points.map(p => p.value);
  const minValue = Math.min.apply(null, allValues.concat([normMin == null ? Infinity : normMin]));
  const maxValue = Math.max.apply(null, allValues.concat([normMax == null ? -Infinity : normMax]));
  const padding = (maxValue - minValue) * 0.15 || 1;
  const yMin = Math.floor(minValue - padding);
  const yMax = Math.ceil(maxValue + padding);
  const lastIsOutOfRange = (typeof normMin === "number" && last.value < normMin) || (typeof normMax === "number" && last.value > normMax);
  const hasChart = points.length >= 2;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-gray-900">{name}</p>
          <p className="text-[11px] text-gray-500">{marker.normLabel}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={"text-lg font-serif " + (lastIsOutOfRange ? "text-rose-600" : "text-gray-900")}>
            {last.value}<span className="text-[10px] text-gray-500 font-sans font-normal ml-1">{unit}</span>
          </p>
          {prev && (
            <p className={"text-[11px] " + (trend > 0 ? "text-orange-600" : trend < 0 ? "text-blue-600" : "text-gray-400")}>
              {trend > 0 ? "↑" : trend < 0 ? "↓" : "—"} {Math.abs(trend).toFixed(2)}
            </p>
          )}
        </div>
      </div>
      {hasChart ? (
        <div className="h-28 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey={(p) => (p.week !== null ? p.week + " нед" : formatShort(p.date))} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[yMin, yMax]} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={40} />
              {typeof normMin === "number" && typeof normMax === "number" && (
                <ReferenceArea y1={normMin} y2={normMax} fill="#86efac" fillOpacity={0.12} />
              )}
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }} formatter={(v) => [v + " " + unit, name]} />
              <Line type="monotone" dataKey="value" stroke="#9333ea" strokeWidth={2} dot={{ r: 3, fill: "#9333ea" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-[11px] text-gray-400 text-center py-3">Одно измерение — динамики пока нет</p>
      )}
    </div>
  );
}
