import { supabase } from "./supabase";

/**
 * Генерирует криптографически случайный токен.
 * 16 байт = 22 символа base64url ~ 132 бита энтропии.
 */
function generateToken() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // base64 → base64url (без +, /, =)
  let b64 = btoa(String.fromCharCode.apply(null, Array.from(bytes)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Создаёт новую share-ссылку для текущего пользователя.
 * @param {number} daysValid — сколько дней живёт ссылка (по умолчанию 30)
 * @returns {Promise<{token: string, expires_at: string, id: string}>}
 */
export async function createShareLink(daysValid = 30) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Не залогинен");

  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + daysValid);

  const { data, error } = await supabase
    .from("share_links")
    .insert({
      token,
      user_id: user.id,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Возвращает все ссылки текущего пользователя (включая отозванные и истёкшие).
 */
export async function getMyShareLinks() {
  const { data, error } = await supabase
    .from("share_links")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Отзывает ссылку — ставит revoked_at, после чего get-shared-data вернёт 410.
 */
export async function revokeShareLink(linkId) {
  const { error } = await supabase
    .from("share_links")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", linkId);

  if (error) throw error;
}

/**
 * Удаляет ссылку из базы навсегда.
 */
export async function deleteShareLink(linkId) {
  const { error } = await supabase
    .from("share_links")
    .delete()
    .eq("id", linkId);

  if (error) throw error;
}

/**
 * Возвращает статус ссылки: active / revoked / expired.
 */
export function getLinkStatus(link) {
  if (link.revoked_at) return "revoked";
  if (new Date(link.expires_at) < new Date()) return "expired";
  return "active";
}

/**
 * Возвращает полный URL для отправки врачу.
 * Подстраивается под dev/prod: префикс берётся из base из vite.config.
 */
export function buildShareUrl(token) {
  const base = window.location.origin + window.location.pathname;
  // На GitHub Pages pathname обычно /pregnancy-dashboard/
  // На localhost — /pregnancy-dashboard/ тоже (мы так настроили Vite)
  return base.replace(/\/$/, "") + "/#/share/" + token;
}

/**
 * Форматирует дату для отображения: "истекает 14.06.2026"
 */
export function formatExpiresDate(isoDate) {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * Сколько дней до истечения. Может быть отрицательным.
 */
export function daysUntilExpiry(isoDate) {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return 0;
  const ms = d.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
