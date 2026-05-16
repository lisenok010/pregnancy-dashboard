import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { Loader2, LogOut } from "lucide-react";
import AnalysisFlow from "./components/AnalysisFlow";
import AuthScreen from "./components/AuthScreen";
import SharedView from "./components/SharedView";

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
        <p className="text-[12px] text-gray-600 truncate">{user.email}</p>
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
  // Hash routing: если URL вида #/share/abc123 → публичный режим без авторизации
  const [route, setRoute] = useState(() => {
    return window.location.hash.startsWith("#/share/") ? "share" : "app";
  });

  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash.startsWith("#/share/") ? "share" : "app");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route === "share") {
    return <SharedView />;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
