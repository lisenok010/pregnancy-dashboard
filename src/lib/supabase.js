import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Не найдены ключи Supabase. Проверь .env.local и перезапусти Vite."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
