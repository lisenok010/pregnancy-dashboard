// Определяет тип анализа по типу и набору показателей

const URINE_KEYWORDS = [
  // ОАМ
  "удельныйвес", "ph", "белок", "глюкозамочи", "кетоны", "лейкоцитыоса",
  "эритроцитымочи", "плоскийэпителий", "слизь", "бактерии", "соли", "цилиндры",
  // Бакпосев и микробиология
  "urine", "посевнафлору", "посевмочи", "микрофлора", "патогенная",
];

const URINE_TYPE_HINTS = ["моч", "urine", "оам", "посев", "бакпосев", "микробиология"];

const HORMONE_MARKERS = [
  "ттг", "т4", "т3", "пролактин", "хгч", "прогестерон", "эстрадиол",
  "fsh", "lh", "тестостерон", "кортизол", "инсулин", "паратгормон",
];
const HORMONE_TYPE_HINTS = ["гормон"];

const BIOCHEM_MARKERS = [
  "алт", "аст", "креатинин", "мочевина", "билирубин", "холестерин", "глюкоза",
  "общийбелок", "альбумин", "ггт", "щелочнаяфосфатаза", "цинк", "железо",
  "магний", "кальций", "калий", "натрий", "хлор", "ферритин", "трансферрин",
  "лдг", "амилаза", "липаза",
];
const BIOCHEM_TYPE_HINTS = ["биохим"];

const COAG_MARKERS = ["мно", "пти", "фибриноген", "ачтв", "ddimer", "ддимер"];
const COAG_TYPE_HINTS = ["коагул", "гемостаз"];

const BLOOD_MARKERS = [
  "гемоглобин", "hb", "эритроциты", "rbc", "лейкоциты", "wbc", "тромбоциты",
  "platelets", "соэ", "esr", "гематокрит", "лимфоциты", "моноциты",
  "нейтрофилы", "базофилы", "эозинофилы", "mcv", "mch", "mchc", "rdw",
];
const BLOOD_TYPE_HINTS = ["общийанализкрови", "оак", "клиническийанализкрови"];

function normalize(s) {
  return String(s || "").toLowerCase().replace(/[\s\-_–—()]/g, "");
}

function hasAnyKeyword(text, list) {
  const n = normalize(text);
  return list.some((kw) => n.includes(kw));
}

function hasAnyMarker(markers, list) {
  if (!Array.isArray(markers)) return false;
  return markers.some((m) => {
    const id = normalize(m.id);
    const name = normalize(m.name);
    return list.some((kw) => id.includes(kw) || name.includes(kw));
  });
}

/**
 * Возвращает категорию анализа: blood / biochem / hormones / urine / coag / other
 */
export function categorizeAnalysis(analysis) {
  const type = analysis.analysis_type || "";
  const markers = analysis.markers || [];

  // 1. Сначала по типу — самые точные совпадения
  if (hasAnyKeyword(type, URINE_TYPE_HINTS)) return "urine";
  if (hasAnyKeyword(type, COAG_TYPE_HINTS)) return "coag";
  if (hasAnyKeyword(type, HORMONE_TYPE_HINTS)) return "hormones";
  if (hasAnyKeyword(type, BIOCHEM_TYPE_HINTS)) return "biochem";
  if (hasAnyKeyword(type, BLOOD_TYPE_HINTS)) return "blood";

  // 2. Если тип "Другое" или непонятный — определяем по показателям
  if (hasAnyMarker(markers, URINE_KEYWORDS)) return "urine";
  if (hasAnyMarker(markers, COAG_MARKERS)) return "coag";
  if (hasAnyMarker(markers, HORMONE_MARKERS)) return "hormones";
  if (hasAnyMarker(markers, BIOCHEM_MARKERS)) return "biochem";
  if (hasAnyMarker(markers, BLOOD_MARKERS)) return "blood";

  return "other";
}

export function getCategoryLabel(category) {
  const map = {
    blood: "Кровь",
    biochem: "Биохимия",
    hormones: "Гормоны",
    urine: "Моча",
    coag: "Коагулограмма",
    other: "Другое",
  };
  return map[category] || "Анализ";
}
