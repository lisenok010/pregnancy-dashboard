import { supabase } from "./supabase";

/**
 * Распознаёт показатели из медицинского анализа через Edge Function.
 * Файл (PDF или изображение) кодируется в base64 и отправляется на сервер,
 * который делает запрос к Anthropic своим ключом и возвращает результат.
 */
export async function recognizeAnalysis(file) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL не настроен");
  }

  const base64Data = await fileToBase64(file);
  const mediaType = file.type || guessMediaType(file.name);

  // Получаем сессию пользователя для авторизации запроса
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Не залогинен");

  const url = supabaseUrl + "/functions/v1/recognize-analysis";

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + session.access_token,
      },
      body: JSON.stringify({
        base64Data,
        mediaType,
        fileName: file.name,
      }),
    });
  } catch (err) {
    console.error("Network error calling edge function:", err);
    throw new Error("Не удалось связаться с сервером. Проверь интернет.");
  }

  if (!response.ok) {
    let errorMessage = "Ошибка распознавания (" + response.status + ")";
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.error) errorMessage = errorBody.error;
    } catch (e) {
      // ignore
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  return {
    fileName: data.fileName || file.name,
    analysisType: data.analysisType || "Анализ",
    analysisDate: data.analysisDate || new Date().toLocaleDateString("ru-RU"),
    markers: data.markers || [],
  };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function guessMediaType(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  const map = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    heic: "image/heic",
  };
  return map[ext] || "application/octet-stream";
}
