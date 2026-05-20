import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { Loader2, LogOut, ArrowLeft } from "lucide-react";
import AnalysisFlow from "./components/AnalysisFlow";
import AuthScreen from "./components/AuthScreen";
import SharedView from "./components/SharedView";
import Landing from "./components/Landing";

function resolveRoute() {
  const h = window.location.hash || "";
  if (h.startsWith("#/share/")) return "share";
  if (h.startsWith("#/app")) return "app";
  return "landing";
}

function AppContent() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <a
            href="#/"
            className="text-[12px] text-gray-500 hover:text-gray-900 flex items-center gap-1 shrink-0"
            title="На главную"
          >
            <ArrowLeft size={12} />
            На лендинг
          </a>
          <p className="text-[12px] text-gray-600 truncate">{user.email}</p>
        </div>
        <button
          onClick={signOut}
          className="text-[12px] text-gray-500 hover:text-gray-900 flex items-center gap-1 px-2 py-1"
        >
          <LogOut size={12} />
          Выйти
        </button>
      </div>
      <AnalysisFlow />
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(() => resolveRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(resolveRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route === "share") {
    return <SharedView />;
  }

  if (route === "app") {
    return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    );
  }

  // По умолчанию — лендинг
  return <Landing />;
}

export default App;
