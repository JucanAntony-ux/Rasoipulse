import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseServiceRoleKey && !supabaseUrl.includes("your-project-id")) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log("✅ Supabase Service Role client initialized successfully");
  } catch (error) {
    console.warn("⚠️ Failed to initialize Supabase client:", error.message);
    supabase = null;
  }
} else {
  console.log("ℹ️ Supabase environment variables not configured. Running with in-memory persistence fallback.");
}

export const isSupabaseConfigured = () => supabase !== null;

export { supabase };
