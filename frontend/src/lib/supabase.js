import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-project-id")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Demo Guest User Profile
export const DEMO_USER = {
  id: "demo-guest-kitchen-001",
  email: "demo@rasoipulse.in",
  user_metadata: {
    kitchen_name: "Chai & Tandoor Express (Koramangala)"
  }
};
