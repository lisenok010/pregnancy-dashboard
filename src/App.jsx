import { AuthProvider, useAuth } from "./lib/AuthContext";
import { Loader2, LogOut } from "lucide-react";
import AnalysisFlow from "./components/AnalysisFlow";
import AuthScreen from "./components/AuthScreen";

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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
