import { supabase } from "./supabase";

/**
 * Сохраняет распознанный анализ в базу.
 * Возвращает созданную запись.
 */
export async function saveAnalysis({
  analysisType,
  analysisDate,
  pregnancyWeek,
  fileName,
  markers,
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Не залогинен");

  // analysisDate приходит как "ДД.ММ.ГГГГ", переводим в формат базы YYYY-MM-DD
  const dbDate = parseRussianDate(analysisDate);

  const { data, error } = await supabase
    .from("analyses")
    .insert({
      user_id: user.id,
      analysis_type: analysisType,
      analysis_date: dbDate,
      pregnancy_week: pregnancyWeek,
      file_name: fileName,
      markers: markers,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Получает все анализы текущего пользователя, новые сверху.
 */
export async function getMyAnalyses() {
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Удаляет анализ по id.
 */
export async function deleteAnalysis(id) {
  const { error } = await supabase.from("analyses").delete().eq("id", id);
  if (error) throw error;
}

function parseRussianDate(str) {
  if (!str || typeof str !== "string") return null;
  // Поддерживаем "03.05.2026" → "2026-05-03"
  const match = str.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  return `${yyyy}-${mm}-${dd}`;
}
