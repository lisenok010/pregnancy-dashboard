import { supabase } from "./supabase";

/**
 * Список добавок текущего пользователя.
 * Сортировка: сначала "принимаю" (taking), потом "закончила" (finished),
 * внутри каждой группы — сверху новые.
 */
export async function getMySupplements() {
  const { data, error } = await supabase
    .from("supplements")
    .select("*")
    .order("status", { ascending: true }) // 'finished' > 'taking' алфавитно, поэтому taking сверху
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Создаёт запись.
 * @param {{ name: string, dose?: string, status?: 'taking' | 'finished' }} payload
 */
export async function createSupplement({ name, dose, status = "taking" }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Не залогинен");

  const cleanName = (name || "").trim();
  if (!cleanName) throw new Error("Название обязательно");

  const { data, error } = await supabase
    .from("supplements")
    .insert({
      user_id: user.id,
      name: cleanName,
      dose: (dose || "").trim() || null,
      status,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Обновляет существующую запись.
 */
export async function updateSupplement(id, patch) {
  const update = { updated_at: new Date().toISOString() };
  if (typeof patch.name === "string") update.name = patch.name.trim();
  if (typeof patch.dose !== "undefined") update.dose = patch.dose ? patch.dose.trim() : null;
  if (patch.status) update.status = patch.status;

  const { data, error } = await supabase
    .from("supplements")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Удаляет запись.
 */
export async function deleteSupplement(id) {
  const { error } = await supabase
    .from("supplements")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Переключает статус taking <-> finished
 */
export async function toggleSupplementStatus(id, currentStatus) {
  const newStatus = currentStatus === "taking" ? "finished" : "taking";
  return await updateSupplement(id, { status: newStatus });
}
