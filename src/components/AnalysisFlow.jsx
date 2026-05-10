import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import LabAnalysisUpload from "./LabAnalysisUpload";
import LabAnalysisReview from "./LabAnalysisReview";
import AnalysesList from "./AnalysesList";
import Dashboard from "./Dashboard";
import ProfileScreen from "./ProfileScreen";
import { saveAnalysis } from "../lib/analysesApi";
import { getMyProfile, calculatePregnancyWeek } from "../lib/profileApi";

function isProfileComplete(profile) {
  if (!profile) return false;
  if (!profile.first_name || !profile.first_name.trim()) return false;
  if (!profile.due_date) return false;
  return true;
}

export default function AnalysisFlow() {
  const [step, setStep] = useState("loading"); // loading | onboarding | dashboard | list | upload | review | profile
  const [recognizedData, setRecognizedData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // При первом рендере проверяем заполнен ли профиль
  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        if (!isProfileComplete(profile)) {
          setStep("onboarding");
        } else {
          setStep("dashboard");
        }
      })
      .catch((err) => {
        console.error(err);
        // Если не смогли загрузить — отправляем на онбординг (возможно профиля нет)
        setStep("onboarding");
      });
  }, []);

  const handleRecognized = (data) => {
    setRecognizedData(data);
    setSaveError(null);
    setStep("review");
  };

  const handleSave = async (markers) => {
    if (!recognizedData) return;
    setSaving(true);
    setSaveError(null);
    try {
      let week = 28;
      try {
        const profile = await getMyProfile();
        if (profile && profile.due_date) {
          const calc = calculatePregnancyWeek(
            profile.due_date,
            new Date(parseRussianDateForJs(recognizedData.analysisDate) || new Date())
          );
          if (calc) week = calc.weeks;
        }
      } catch (e) {
        // оставим week = 28 если профиль не достали
      }

      await saveAnalysis({
        analysisType: recognizedData.analysisType,
        analysisDate: recognizedData.analysisDate,
        pregnancyWeek: week,
        fileName: recognizedData.fileName,
        markers,
      });
      setRecognizedData(null);
      setRefreshKey((k) => k + 1);
      setStep("dashboard");
    } catch (err) {
      console.error(err);
      setSaveError(err.message || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setRecognizedData(null);
    setSaveError(null);
    setStep("dashboard");
  };

  // Загрузка профиля при первом входе
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-purple-400" />
      </div>
    );
  }

  // Онбординг — обязательное заполнение профиля
  if (step === "onboarding") {
    return (
      <ProfileScreen
        isOnboarding={true}
        onBack={() => setStep("dashboard")}
      />
    );
  }

  if (step === "review" && recognizedData) {
    return (
      <div>
        {saving && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl px-6 py-4 flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-purple-600" />
              <span className="text-sm">Сохраняем...</span>
            </div>
          </div>
        )}
        {saveError && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-[12px] text-red-700 text-center">
            {saveError}
          </div>
        )}
        <LabAnalysisReview
          pregnancyWeek={28}
          fileName={recognizedData.fileName}
          analysisType={recognizedData.analysisType}
          analysisDate={recognizedData.analysisDate}
          initialMarkers={recognizedData.markers}
          onSave={handleSave}
          onCancel={handleCancel}
          onReplaceFile={() => setStep("upload")}
        />
      </div>
    );
  }

  if (step === "upload") {
    return <LabAnalysisUpload onRecognized={handleRecognized} onCancel={() => setStep("dashboard")} />;
  }

  if (step === "list") {
    return (
      <AnalysesListWithNav
        key={refreshKey}
        onAddNew={() => setStep("upload")}
        onOpenDashboard={() => setStep("dashboard")}
        onOpenProfile={() => setStep("profile")}
      />
    );
  }

  if (step === "profile") {
    return <ProfileScreen onBack={() => setStep("dashboard")} />;
  }

  return (
    <Dashboard
      key={refreshKey}
      onAddNew={() => setStep("upload")}
      onOpenList={() => setStep("list")}
      onOpenProfile={() => setStep("profile")}
    />
  );
}

function AnalysesListWithNav({ onAddNew, onOpenDashboard, onOpenProfile }) {
  return (
    <div className="pb-20">
      <AnalysesList onAddNew={onAddNew} />
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200">
        <div className="max-w-md mx-auto flex">
          <NavBtn label="Дашборд" onClick={onOpenDashboard} />
          <NavBtn label="Анализы" active />
          <NavBtn label="Добавить" onClick={onAddNew} highlight />
          <NavBtn label="Профиль" onClick={onOpenProfile} />
        </div>
      </div>
    </div>
  );
}

function NavBtn({ label, onClick, active, highlight }) {
  const base = "flex-1 py-3 text-[11px] ";
  const cls = active ? "text-purple-600 font-medium" : "text-gray-500";
  const hl = highlight ? "font-medium" : "";
  return (
    <button onClick={onClick} className={base + cls + " " + hl}>
      {label}
    </button>
  );
}

function parseRussianDateForJs(str) {
  if (!str) return null;
  const m = String(str).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  return m[3] + "-" + m[2] + "-" + m[1];
}
