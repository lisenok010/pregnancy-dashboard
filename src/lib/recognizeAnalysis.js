import Anthropic from "@anthropic-ai/sdk";

const RECOGNITION_PROMPT = `Ты помощник для беременной женщины. Распознай показатели из медицинского анализа на фото или PDF.

КРИТИЧНО: верни ТОЛЬКО валидный JSON. Никакого текста до или после. Никаких пояснений. Никаких markdown-обёрток. Только сырой JSON-объект, начинающийся с { и заканчивающийся }.

Формат:

{
  "analysisType": "Общий анализ крови" | "Биохимия крови" | "Общий анализ мочи" | "Посев на флору" | "Гормоны" | "Коагулограмма" | "Витамины и микроэлементы" | "Другое",
  "analysisDate": "ДД.ММ.ГГГГ или пустая строка если не видно",
  "markers": [
    {
      "id": "латинский_id_без_пробелов",
      "name": "Название показателя на русском",
      "value": "значение как строка (число или текст)",
      "unit": "единицы измерения (или пустая строка для текстовых)",
      "normMin": число или null,
      "normMax": число или null,
      "normLabel": "Норма: X–Y единицы",
      "aiConfidence": число от 0 до 1
    }
  ]
}

ВАЖНЫЕ ПРАВИЛА определения типа:
- Если в анализе есть гемоглобин, эритроциты, лейкоциты, тромбоциты → "Общий анализ крови"
- Если есть АЛТ, АСТ, креатинин, мочевина, билирубин, общий белок, холестерин → "Биохимия крови"
- Если показатели мочи (цвет, прозрачность, удельный вес, белок, глюкоза мочи, кетоны) → "Общий анализ мочи"
- Если посев, культуральное исследование, чувствительность к антибиотикам, рост микрофлоры → "Посев на флору"
- Если ТТГ, Т3, Т4, пролактин, ХГЧ, эстрадиол → "Гормоны"
- Если МНО, ПТИ, фибриноген, АЧТВ, Д-димер → "Коагулограмма"
- Если витамин Д, B12, фолиевая кислота, ферритин, цинк, магний → "Витамины и микроэлементы"
- Используй "Другое" только если ничего не подходит

Правила для значений:
- aiConfidence ставь честно: 0.95+ если уверен, 0.6-0.8 если значение нечёткое, ниже 0.6 если очень сомневаешься
- Для беременных СОЭ нормальная до 45 мм/ч
- Если показателя в анализе нет — не выдумывай, пропусти
- value может быть текстом для качественных результатов ("Не обнаружено", "Отрицательно", "Роста микрофлоры не выявлено")
- id делай простой латиницей: hemoglobin, rbc, wbc, platelets, esr, glucose, urine_culture, etc.`;

export async function recognizeAnalysis(file) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("API-ключ не найден. Проверь .env.local");
  }

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const base64Data = await fileToBase64(file);
  const mediaType = file.type || guessMediaType(file.name);
  const isPdf = mediaType === "application/pdf";

  const content = [
    {
      type: isPdf ? "document" : "image",
      source: {
        type: "base64",
        media_type: mediaType,
        data: base64Data,
      },
    },
    { type: "text", text: RECOGNITION_PROMPT },
  ];

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    messages: [{ role: "user", content }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock) throw new Error("AI не вернул текст");

  const rawText = textBlock.text;
  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    console.error("В ответе AI нет JSON:", rawText);
    throw new Error("AI не вернул JSON. Попробуй ещё раз.");
  }

  const jsonText = rawText.slice(firstBrace, lastBrace + 1);

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    console.error("Не удалось распарсить ответ AI. Сырой ответ:", rawText);
    throw new Error("AI вернул некорректный JSON. Попробуй ещё раз.");
  }

  return {
    fileName: file.name,
    analysisType: parsed.analysisType || "Анализ",
    analysisDate: parsed.analysisDate || new Date().toLocaleDateString("ru-RU"),
    markers: parsed.markers || [],
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
