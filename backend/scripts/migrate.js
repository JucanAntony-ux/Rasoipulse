import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

async function runMigration() {
  console.log("==================================================================");
  console.log("🍛 RasoiPulse Database Migration: 001_initial_schema.sql");
  console.log("==================================================================\n");

  const schemaPath = path.resolve(__dirname, "../supabase/001_initial_schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Migration file not found at: ${schemaPath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(schemaPath, "utf-8");
  console.log(`📄 Loaded migration file: 001_initial_schema.sql (${sqlContent.length} bytes)`);

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in backend/.env");
    process.exit(1);
  }

  console.log(`🔗 Target Supabase Project: ${SUPABASE_URL}`);

  // 1. Direct PostgreSQL Execution if connection string available
  if (DATABASE_URL) {
    console.log("🔌 Direct DATABASE_URL detected. Executing raw DDL migration via PostgreSQL client...");
    try {
      const { Client } = await import("pg");
      const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      await client.connect();
      console.log("   Connected to PostgreSQL database.");
      await client.query(sqlContent);
      console.log("   ✅ Executed 001_initial_schema.sql successfully.");
      await client.end();
    } catch (pgErr) {
      console.error("   ⚠️ Direct Postgres execution encountered error:", pgErr.message);
    }
  }

  // 2. Verify Schema & Table Integrity via Supabase Service Role Client
  console.log("\n🔍 Verifying Supabase project schema & tables...");
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const tables = [
    { name: "kitchen_profiles", description: "Kitchen profiles linked to Auth users" },
    { name: "menu_items", description: "Master menu items with prep & pricing" },
    { name: "simulation_logs", description: "Audit logs of AI execution plans & savings" }
  ];

  let allTablesValid = true;

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table.name)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error(`   ❌ Table '${table.name}': Missing or inaccessible (${error.message})`);
        allTablesValid = false;
      } else {
        console.log(`   ✅ Table '${table.name}': Online (${table.description})`);
      }
    } catch (err) {
      console.error(`   ❌ Table '${table.name}': ${err.message}`);
      allTablesValid = false;
    }
  }

  // 3. Verify Seed Data in menu_items
  console.log("\n🌱 Checking Seed Data in 'menu_items'...");
  const { data: menuData, error: menuErr } = await supabase
    .from("menu_items")
    .select("item_name, category, base_prep, cost_price, sell_price, is_perishable")
    .is("user_id", null);

  if (menuErr) {
    console.error("   ❌ Failed to query menu_items:", menuErr.message);
    allTablesValid = false;
  } else if (!menuData || menuData.length === 0) {
    console.log("   ⚠️ Demo items not found. Inserting default 6 cloud-kitchen seed items...");
    const defaultItems = [
      { user_id: null, item_name: "Paneer Tikka Roll", category: "hot_snack", base_prep: 60, wasted_yesterday: 14, cost_price: 55, sell_price: 130, is_perishable: true },
      { user_id: null, item_name: "Masala Chai (Flasks)", category: "hot_drink", base_prep: 80, wasted_yesterday: 10, cost_price: 12, sell_price: 35, is_perishable: true },
      { user_id: null, item_name: "Samosa & Pakora Plate", category: "hot_snack", base_prep: 70, wasted_yesterday: 18, cost_price: 18, sell_price: 50, is_perishable: true },
      { user_id: null, item_name: "Cold Coffee", category: "cold_drink", base_prep: 50, wasted_yesterday: 16, cost_price: 35, sell_price: 110, is_perishable: true },
      { user_id: null, item_name: "Fresh Lime Soda", category: "cold_drink", base_prep: 45, wasted_yesterday: 5, cost_price: 15, sell_price: 60, is_perishable: false },
      { user_id: null, item_name: "Chicken Biryani Box", category: "meal", base_prep: 55, wasted_yesterday: 12, cost_price: 85, sell_price: 190, is_perishable: true }
    ];
    const { data: inserted, error: insertErr } = await supabase.from("menu_items").insert(defaultItems).select();
    if (insertErr) {
      console.error("   ❌ Failed to insert seed items:", insertErr.message);
    } else {
      console.log(`   ✅ Successfully seeded ${inserted.length} default cloud-kitchen items.`);
    }
  } else {
    console.log(`   ✅ Seed items present: ${menuData.length} default items loaded.`);
    menuData.forEach(item => {
      console.log(`      - ${item.item_name} [${item.category}] | Prep: ${item.base_prep} | Cost: ₹${item.cost_price} | Sell: ₹${item.sell_price}`);
    });
  }

  console.log("\n==================================================================");
  if (allTablesValid) {
    console.log("🎉 DATABASE MIGRATION & SCHEMA VERIFICATION COMPLETED SUCCESSFULLY!");
    console.log("Your Supabase database is ready for production operation.");
  } else {
    console.log("⚠️ Some tables require schema creation.");
    console.log("Tip: Open your Supabase Dashboard -> SQL Editor and paste:");
    console.log(`     d:\\Editing\\power rangers\\backend\\supabase\\001_initial_schema.sql`);
  }
  console.log("==================================================================");
}

runMigration();
