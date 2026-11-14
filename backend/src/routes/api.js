import express from "express";
import multer from "multer";
import { fetchBengaluruWeather } from "../services/weatherService.js";
import { simulateDemandAndPrep } from "../services/decisionEngine.js";
import { extractRegisterFromImage, generateKitchenActionPlan } from "../services/geminiService.js";
import { supabase, isSupabaseConfigured } from "../config/supabaseClient.js";
import { defaultMenuItems, getDefaultMenuClone } from "../data/defaultMenu.js";
import {
  MenuItemSchema,
  SimulationInputSchema,
  ActionPlanZodSchema,
  RegisterExtractionZodSchema
} from "../schemas/validation.js";

const router = express.Router();

// Configure Multer for in-memory file uploads with 8MB limit and image MIME restrictions
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024 // 8MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP images are supported."));
    }
  }
});

// In-Memory state fallback when Supabase is not connected
let inMemoryMenu = getDefaultMenuClone();
let inMemoryLogs = [];

/**
 * Helper to get current menu items based on Supabase or in-memory fallback
 */
async function getMenuItemsForUser(userId = null) {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from("menu_items").select("*");
      if (userId) {
        query = query.or(`user_id.is.null,user_id.eq.${userId}`);
      } else {
        query = query.is("user_id", null);
      }
      const { data, error } = await query.order("created_at", { ascending: true, nullsFirst: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn("Error querying Supabase menu_items, using in-memory store:", err.message);
    }
  }

  // Fallback to in-memory menu
  if (userId) {
    const userItems = inMemoryMenu.filter(item => item.user_id === userId || item.user_id === null);
    return userItems.length > 0 ? userItems : getDefaultMenuClone();
  }
  return inMemoryMenu;
}

/**
 * GET /api/health
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "RasoiPulse Decision Engine",
    timestamp: new Date().toISOString(),
    supabaseConnected: isSupabaseConfigured()
  });
});

/**
 * GET /api/weather
 * Bengaluru live weather from Open-Meteo with offline fallback
 */
router.get("/weather", async (req, res) => {
  try {
    const weather = await fetchBengaluruWeather();
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather", details: error.message });
  }
});

/**
 * GET /api/menu
 * Fetch all menu items for the current session/user or shared public demo
 */
router.get("/menu", async (req, res) => {
  const userId = req.headers["x-user-id"] || null;
  try {
    const items = await getMenuItemsForUser(userId);
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/menu
 * Create a new menu item
 */
router.post("/menu", async (req, res) => {
  const userId = req.headers["x-user-id"] || null;
  const parseResult = MenuItemSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ success: false, errors: parseResult.error.flatten() });
  }

  const newItem = {
    ...parseResult.data,
    id: parseResult.data.id || crypto.randomUUID(),
    user_id: userId
  };

  if (isSupabaseConfigured() && userId) {
    try {
      const { data, error } = await supabase.from("menu_items").insert([newItem]).select().single();
      if (!error && data) {
        return res.status(201).json({ success: true, item: data });
      }
    } catch (err) {
      console.warn("Failed to insert into Supabase, saving to in-memory:", err.message);
    }
  }

  inMemoryMenu.push(newItem);
  res.status(201).json({ success: true, item: newItem });
});

/**
 * PUT /api/menu/:id
 * Update an existing menu item
 */
router.put("/menu/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.headers["x-user-id"] || null;
  const parseResult = MenuItemSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ success: false, errors: parseResult.error.flatten() });
  }

  const updatedData = { ...parseResult.data, id };

  if (isSupabaseConfigured() && userId) {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .update(updatedData)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        return res.json({ success: true, item: data });
      }
    } catch (err) {
      console.warn("Failed to update in Supabase, updating in-memory:", err.message);
    }
  }

  const index = inMemoryMenu.findIndex(i => i.id === id);
  if (index !== -1) {
    inMemoryMenu[index] = { ...inMemoryMenu[index], ...updatedData };
    return res.json({ success: true, item: inMemoryMenu[index] });
  }

  // If not found in in-memory, add it
  inMemoryMenu.push(updatedData);
  res.json({ success: true, item: updatedData });
});

/**
 * DELETE /api/menu/:id
 * Delete a menu item
 */
router.delete("/api/menu/:id", async (req, res) => {
  // Handled under router prefix /api
  const { id } = req.params;
  const userId = req.headers["x-user-id"] || null;

  if (isSupabaseConfigured() && userId) {
    try {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (!error) {
        return res.json({ success: true, message: "Item deleted successfully" });
      }
    } catch (err) {
      console.warn("Failed to delete from Supabase, removing from in-memory:", err.message);
    }
  }

  inMemoryMenu = inMemoryMenu.filter(i => i.id !== id);
  res.json({ success: true, message: "Item deleted successfully" });
});

// Also register standard DELETE /menu/:id relative to router
router.delete("/menu/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.headers["x-user-id"] || null;

  if (isSupabaseConfigured() && userId) {
    try {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (!error) {
        return res.json({ success: true, message: "Item deleted successfully" });
      }
    } catch (err) {
      console.warn("Failed to delete from Supabase, removing from in-memory:", err.message);
    }
  }

  inMemoryMenu = inMemoryMenu.filter(i => i.id !== id);
  res.json({ success: true, message: "Item deleted successfully" });
});

/**
 * POST /api/menu/reset
 * Resets menu items to the 6 default seed items
 */
router.post("/menu/reset", async (req, res) => {
  const userId = req.headers["x-user-id"] || null;

  if (isSupabaseConfigured() && userId) {
    try {
      // Delete custom items for this user
      await supabase.from("menu_items").delete().eq("user_id", userId);
    } catch (err) {
      console.warn("Failed to reset Supabase items:", err.message);
    }
  }

  inMemoryMenu = getDefaultMenuClone();
  res.json({ success: true, message: "Menu reset to default 6 items", items: inMemoryMenu });
});

/**
 * POST /api/scan-register
 * Multimodal Handwritten Register OCR Scanner using Gemini 2.5 Flash
 */
router.post("/scan-register", upload.single("register_image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "register_image file is required." });
    }

    const userId = req.headers["x-user-id"] || null;
    const extractedData = await extractRegisterFromImage(req.file.buffer, req.file.mimetype);

    // Validate extracted items with Zod
    const validated = RegisterExtractionZodSchema.safeParse(extractedData);
    if (!validated.success) {
      return res.status(422).json({
        success: false,
        error: "Extracted items failed schema validation",
        details: validated.error.flatten()
      });
    }

    const itemsToUpsert = validated.data.items.map(item => ({
      ...item,
      id: crypto.randomUUID(),
      user_id: userId
    }));

    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase.from("menu_items").insert(itemsToUpsert).select();
        if (!error && data) {
          return res.json({
            success: true,
            extracted_count: data.length,
            items: data
          });
        }
      } catch (err) {
        console.warn("Supabase upsert failed, returning in-memory:", err.message);
      }
    }

    // Append/replace in memory
    inMemoryMenu = [...itemsToUpsert];

    res.json({
      success: true,
      extracted_count: itemsToUpsert.length,
      items: itemsToUpsert
    });
  } catch (error) {
    console.error("Error in /api/scan-register:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/simulate
 * Multi-Factor Explainable Decision Engine
 */
router.post("/simulate", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || null;

    // Validate scenario inputs
    const scenarioInputs = req.body.scenario_inputs || req.body;
    const parsedScenario = SimulationInputSchema.safeParse(scenarioInputs);

    if (!parsedScenario.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid simulation inputs",
        details: parsedScenario.error.flatten()
      });
    }

    // Use items provided in request body or fetch current menu
    let itemsToSimulate = req.body.items;
    if (!itemsToSimulate || !Array.isArray(itemsToSimulate) || itemsToSimulate.length === 0) {
      itemsToSimulate = await getMenuItemsForUser(userId);
    }

    const simulationResult = simulateDemandAndPrep(itemsToSimulate, parsedScenario.data);

    res.json({
      success: true,
      scenario: parsedScenario.data,
      kpis: simulationResult.kpis,
      items: simulationResult.items
    });
  } catch (error) {
    console.error("Error in /api/simulate:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/generate-actions
 * Synthesize autonomous action plan with Gemini 2.5 Flash
 */
router.post("/generate-actions", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || null;
    const { simulation_results, scenario_inputs, expiring_ingredients = [] } = req.body;

    if (!simulation_results || !simulation_results.items) {
      return res.status(400).json({
        success: false,
        error: "simulation_results with items array is required."
      });
    }

    const parsedScenario = SimulationInputSchema.safeParse(scenario_inputs);
    const validScenario = parsedScenario.success ? parsedScenario.data : scenario_inputs;

    const actionPlan = await generateKitchenActionPlan(
      simulation_results.items,
      validScenario,
      expiring_ingredients,
      simulation_results.kpis || {}
    );

    // Validate generated action plan with Zod
    const validatedPlan = ActionPlanZodSchema.safeParse(actionPlan);
    const finalPlan = validatedPlan.success ? validatedPlan.data : actionPlan;

    // Persist to Supabase simulation_logs if configured
    const logRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      scenario_inputs: validScenario,
      projected_savings_inr: simulation_results.kpis?.daily_saved_inr || 0,
      flash_sale_recovery_inr: simulation_results.kpis?.flash_sale_recovery_inr || 0,
      action_plan_json: finalPlan,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("simulation_logs").insert([logRecord]);
      } catch (err) {
        console.warn("Failed to persist simulation log to Supabase:", err.message);
      }
    }

    // Store in-memory audit log
    inMemoryLogs.unshift(logRecord);
    if (inMemoryLogs.length > 50) {
      inMemoryLogs.pop();
    }

    res.json({
      success: true,
      log_id: logRecord.id,
      action_plan: finalPlan,
      kpis: simulation_results.kpis
    });
  } catch (error) {
    console.error("Error in /api/generate-actions:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/logs
 * Chronological audit log of past simulation runs
 */
router.get("/logs", async (req, res) => {
  const userId = req.headers["x-user-id"] || null;

  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from("simulation_logs").select("*");
      if (userId) {
        query = query.or(`user_id.is.null,user_id.eq.${userId}`);
      }
      const { data, error } = await query.order("created_at", { ascending: false }).limit(20);
      if (!error && data) {
        return res.json({ success: true, count: data.length, logs: data });
      }
    } catch (err) {
      console.warn("Failed to fetch logs from Supabase:", err.message);
    }
  }

  // Fallback to in-memory logs
  const filtered = userId
    ? inMemoryLogs.filter(l => l.user_id === userId || l.user_id === null)
    : inMemoryLogs;

  res.json({
    success: true,
    count: filtered.length,
    logs: filtered.slice(0, 20)
  });
});

export default router;
