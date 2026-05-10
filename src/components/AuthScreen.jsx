import { useState } from "react";
import { Loader2, Heart } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (password.length < 6) {
          throw new Error("Пароль должен быть от 6 символов");
        }
        await signUp(email, password);
        setSuccess(
          "На почту отправлено письмо для подтверждения. Перейди по ссылке, потом возвращайся."
        );
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      console.error(err);
      const msg = err.message || "";
      if (msg.includes("Invalid login credentials")) {
        setError("Неверный email или пароль");
      } else if (msg.includes("already registered")) {
        setError("Этот email уже зарегистрирован. Войди.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Почта не подтверждена. Проверь письмо.");
      } else {
        setError(msg || "Что-то пошло не так");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-3 flex items-center">
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-pink-200 flex items-center justify-center mb-3">
            <Heart size={20} className="text-pink-700" fill="currentColor" />
          </div>
          <h1 className="text-xl font-medium text-gray-900">
            {mode === "signin" ? "Вход" : "Регистрация"}
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">
            Анализы в одном месте · для тебя и врача
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3"
        >
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="ваш@email.com"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="минимум 6 символов"
            />
          </div>

          {error && (
            <div className="text-[12px] text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="text-[12px] text-green-700 bg-green-50 px-3 py-2 rounded-lg">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === "signin" ? "Войти" : "Зарегистрироваться"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setSuccess(null);
            }}
            className="w-full text-[12px] text-gray-500 hover:text-gray-900 py-1"
          >
            {mode === "signin"
              ? "Нет аккаунта? Зарегистрироваться"
              : "Уже есть аккаунт? Войти"}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 text-center mt-4 px-2 leading-relaxed">
          Регистрируясь, ты соглашаешься с обработкой персональных данных. Данные хранятся зашифрованно.
        </p>
      </div>
    </div>
  );
}
