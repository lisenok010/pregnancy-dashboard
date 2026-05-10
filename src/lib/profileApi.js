import { supabase } from "./supabase";

export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Не залогинен");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle(); // maybeSingle вернёт null если профиля нет, без ошибки

  if (error) throw error;
  return data;
}

export async function upsertProfile({ dueDate }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Не залогинен");

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      due_date: dueDate,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Считает срок беременности на заданную дату.
 * dueDate в формате YYYY-MM-DD.
 * Возвращает { weeks, days } или null если данные некорректные.
 *
 * Беременность = 280 дней от первого дня последней менструации.
 * ПДР = ПМ + 280 дней. Значит срок на дату X = 280 - (ПДР - X) дней.
 */
export function calculatePregnancyWeek(dueDate, onDate = new Date()) {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const target = onDate instanceof Date ? onDate : new Date(onDate);
  if (isNaN(due.getTime()) || isNaN(target.getTime())) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilDue = Math.round((due - target) / msPerDay);
  const totalDays = 280 - daysUntilDue;

  if (totalDays < 0 || totalDays > 320) return null; // sanity check

  return {
    weeks: Math.floor(totalDays / 7),
    days: totalDays % 7,
    totalDays,
  };
}
