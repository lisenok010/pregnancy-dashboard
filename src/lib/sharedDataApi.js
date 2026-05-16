/**
 * Получает данные владельца ссылки по токену через Edge Function.
 * Работает БЕЗ авторизации — врач не залогинен.
 */
export async function getSharedData(token) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("Сервер не настроен");
  }

  const url = supabaseUrl + "/functions/v1/get-shared-data";

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch (err) {
    console.error("Network error:", err);
    throw new Error("Не удалось связаться с сервером");
  }

  if (!response.ok) {
    let errorMessage = "Ошибка загрузки";
    try {
      const body = await response.json();
      if (body && body.error) errorMessage = body.error;
    } catch (e) { /* ignore */ }

    // Особые статусы для UI
    if (response.status === 404) {
      const e = new Error(errorMessage);
      e.code = "not_found";
      throw e;
    }
    if (response.status === 410) {
      const e = new Error(errorMessage);
      e.code = "expired";
      throw e;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Извлекает токен из текущего URL hash.
 * Поддерживает: #/share/abc123 → "abc123"
 */
export function getTokenFromHash() {
  const hash = window.location.hash || "";
  const match = hash.match(/^#\/share\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}
