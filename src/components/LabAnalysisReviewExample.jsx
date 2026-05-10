import LabAnalysisReview from "./LabAnalysisReview";

const SAMPLE_MARKERS = [
  { id: "hemoglobin", name: "Гемоглобин", value: "118", unit: "г/л", normMin: 110, normMax: 140, normLabel: "Норма: 110–140 г/л", aiConfidence: 0.97 },
  { id: "rbc", name: "Эритроциты", value: "4.12", unit: "×10¹²", normMin: 3.7, normMax: 4.7, normLabel: "Норма: 3.7–4.7", aiConfidence: 0.95 },
  { id: "wbc", name: "Лейкоциты", value: "11.2", unit: "×10⁹", normMin: 4.0, normMax: 9.0, normLabel: "Норма: 4.0–9.0", aiConfidence: 0.62 },
  { id: "platelets", name: "Тромбоциты", value: "245", unit: "×10⁹", normMin: 150, normMax: 400, normLabel: "Норма: 150–400", aiConfidence: 0.94 },
  { id: "esr", name: "СОЭ", value: "22", unit: "мм/ч", normMin: 0, normMax: 45, normLabel: "Норма при беременности: до 45", aiConfidence: 0.91 },
  { id: "neutrophils", name: "Нейтрофилы", value: "68", unit: "%", normMin: 47, normMax: 72, normLabel: "Норма: 47–72%", aiConfidence: 0.88 },
  { id: "lymphocytes", name: "Лимфоциты", value: "24", unit: "%", normMin: 19, normMax: 37, normLabel: "Норма: 19–37%", aiConfidence: 0.9 },
  { id: "monocytes", name: "Моноциты", value: "5", unit: "%", normMin: 3, normMax: 11, normLabel: "Норма: 3–11%", aiConfidence: 0.85 },
];

export default function LabAnalysisReviewExample() {
  return (
    <LabAnalysisReview
      pregnancyWeek={28}
      fileName="Анализ_Инвитро.pdf"
      analysisType="Общий анализ крови"
      analysisDate="03.05.2026"
      initialMarkers={SAMPLE_MARKERS}
      onSave={(markers) => {
        console.log("Сохраняем:", markers);
        alert(`Сохранено ${markers.length} показателей`);
      }}
      onCancel={() => console.log("Отмена")}
      onReplaceFile={() => console.log("Заменить файл")}
    />
  );
}
