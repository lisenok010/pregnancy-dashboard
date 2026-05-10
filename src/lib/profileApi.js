import { supabase } from "./supabase";

export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Не залогинен");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertProfile(fields) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Не залогинен");

  const payload = {
    id: user.id,
    updated_at: new Date().toISOString(),
  };

  // Передаём только те поля, что переданы — undefined не записываем
  if (fields.dueDate !== undefined) payload.due_date = fields.dueDate || null;
  if (fields.firstName !== undefined) payload.first_name = fields.firstName || null;
  if (fields.birthDate !== undefined) payload.birth_date = fields.birthDate || null;
  if (fields.bloodGroup !== undefined) payload.blood_group = fields.bloodGroup || null;
  if (fields.rhFactor !== undefined) payload.rh_factor = fields.rhFactor || null;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Считает срок беременности на заданную дату.
 * dueDate в формате YYYY-MM-DD.
 * Возвращает { weeks, days, totalDays } или null.
 */
export function calculatePregnancyWeek(dueDate, onDate = new Date()) {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const target = onDate instanceof Date ? onDate : new Date(onDate);
  if (isNaN(due.getTime()) || isNaN(target.getTime())) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilDue = Math.round((due - target) / msPerDay);
  const totalDays = 280 - daysUntilDue;

  if (totalDays < 0 || totalDays > 320) return null;

  return {
    weeks: Math.floor(totalDays / 7),
    days: totalDays % 7,
    totalDays,
  };
}

/**
 * Считает возраст по дате рождения.
 */
export function calculateAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}

/**
 * Форматирует группу крови + резус для шапки.
 * Например: "I (0) Rh+", "II (A) Rh-"
 */
export function formatBloodInfo(bloodGroup, rhFactor) {
  if (!bloodGroup && !rhFactor) return null;
  const parts = [];
  if (bloodGroup) parts.push(bloodGroup);
  if (rhFactor) parts.push("Rh" + rhFactor);
  return parts.join(" ");
}

export function pluralYears(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "год";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "года";
  return "лет";
}

export const BLOOD_GROUPS = [
  { value: "I (0)", label: "I (0)" },
  { value: "II (A)", label: "II (A)" },
  { value: "III (B)", label: "III (B)" },
  { value: "IV (AB)", label: "IV (AB)" },
];

export const RH_FACTORS = [
  { value: "+", label: "Rh+" },
  { value: "-", label: "Rh−" },
];
