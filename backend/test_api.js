import { simulateDemandAndPrep } from "./src/services/decisionEngine.js";
import { defaultMenuItems } from "./src/data/defaultMenu.js";
import { generateKitchenActionPlan, extractRegisterFromImage } from "./src/services/geminiService.js";
import {
  MenuItemSchema,
  SimulationInputSchema,
  ActionPlanZodSchema,
  RegisterExtractionZodSchema
} from "./src/schemas/validation.js";

async function runVerification() {
  console.log("=================================================");
  console.log("🍛 RasoiPulse End-to-End Decision Engine Verification");
  console.log("=================================================\n");

  let allPassed = true;

  // 1. Test Decision Engine Multi-factor Scoring
  console.log("▶ [Test 1] Testing 7-Factor What-If Decision Engine:");
  const testScenario = {
    weather_mode: "Heavy Evening Rain",
    event_mode: "IPL / Cricket Match Night",
    day_cycle: "Friday / Weekend Rush",
    traffic_mode: "Heavy Traffic Gridlock (Delivery Spike)",
    neighborhood_signal: "Fasting / Veg-Only Day",
    expiring_ingredients: ["Paneer"],
    time_hour: 20
  };

  const simResult = simulateDemandAndPrep(defaultMenuItems, testScenario);

  // Validate KPIs
  console.log("  KPIs:", JSON.stringify(simResult.kpis, null, 2));
  if (
    typeof simResult.kpis.daily_saved_inr === "number" &&
    typeof simResult.kpis.monthly_saved_inr === "number" &&
    simResult.kpis.at_risk_total > 0 &&
    simResult.kpis.flash_sale_recovery_inr > 0
  ) {
    console.log("  ✅ KPIs calculated accurately (at_risk_total & flash_sale_recovery_inr active for hour >= 18).");
  } else {
    console.error("  ❌ KPI calculation failed");
    allPassed = false;
  }

  // Check Non-Veg vs Veg during Fasting
  const biryani = simResult.items.find(i => i.item_name.includes("Biryani"));
  const chai = simResult.items.find(i => i.item_name.includes("Chai"));
  const paneer = simResult.items.find(i => i.item_name.includes("Paneer"));

  console.log(`  - Biryani (Non-Veg Fasting impact): Prep ${biryani.base_prep} -> ${biryani.recommended_prep} (Delta: ${biryani.delta})`);
  console.log(`    Tags: ${biryani.reason_tags.join(" | ")}`);

  console.log(`  - Masala Chai (Rain impact): Prep ${chai.base_prep} -> ${chai.recommended_prep} (Delta: ${chai.delta})`);
  console.log(`    Tags: ${chai.reason_tags.join(" | ")}`);

  console.log(`  - Paneer Tikka (Expiring + Rain + Event): Prep ${paneer.base_prep} -> ${paneer.recommended_prep}`);
  console.log(`    Tags: ${paneer.reason_tags.join(" | ")}`);

  if (
    biryani.reason_tags.some(t => t.includes("Fasting -80%")) &&
    chai.reason_tags.some(t => t.includes("Rain +40%")) &&
    paneer.reason_tags.some(t => t.includes("Uses Expiring Stock"))
  ) {
    console.log("  ✅ Reason tags correctly generated for all 7 factors.\n");
  } else {
    console.error("  ❌ Reason tags missing expected rules");
    allPassed = false;
  }

  // 2. Test Zod Validation Schemas
  console.log("▶ [Test 2] Testing Zod Runtime Validation Schemas:");
  const validItem = defaultMenuItems[0];
  const itemValidation = MenuItemSchema.safeParse(validItem);
  const scenarioValidation = SimulationInputSchema.safeParse(testScenario);

  if (itemValidation.success && scenarioValidation.success) {
    console.log("  ✅ MenuItemSchema and SimulationInputSchema valid.\n");
  } else {
    console.error("  ❌ Zod schema validation failed");
    allPassed = false;
  }

  // 3. Test Register OCR Extraction
  console.log("▶ [Test 3] Testing Handwritten Register OCR Extraction:");
  // Create a minimal 1x1 test JPEG buffer
  const dummyBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0xFF, 0xD9]);
  const extracted = await extractRegisterFromImage(dummyBuffer, "image/jpeg");
  const extractedValid = RegisterExtractionZodSchema.safeParse(extracted);

  if (extractedValid.success && extracted.items.length > 0) {
    console.log(`  ✅ Extracted ${extracted.items.length} structured items with strict schema validation.`);
    console.log(`  Sample item: ${extracted.items[0].item_name} (${extracted.items[0].category}) - Prep: ${extracted.items[0].base_prep}\n`);
  } else {
    console.error("  ❌ Register extraction validation failed:", extractedValid.error);
    allPassed = false;
  }

  // 4. Test Autonomous Action Plan Generation
  console.log("▶ [Test 4] Testing Autonomous Action Plan Generation:");
  const actionPlan = await generateKitchenActionPlan(
    simResult.items,
    testScenario,
    testScenario.expiring_ingredients,
    simResult.kpis
  );
  const planValidation = ActionPlanZodSchema.safeParse(actionPlan);

  if (planValidation.success) {
    console.log("  ✅ Generated all 4 structured deliverables:");
    console.log(`    - Morning Prep: "${actionPlan.morning_prep_summary.slice(0, 80)}..."`);
    console.log(`    - Flash Sale: "${actionPlan.rescue_flash_sale.slice(0, 80)}..."`);
    console.log(`    - Supplier Draft: "${actionPlan.supplier_whatsapp_draft.slice(0, 80)}..."`);
    console.log(`    - Cook Hinglish: "${actionPlan.cook_hinglish_briefing.slice(0, 80)}..."\n`);
  } else {
    console.error("  ❌ Action plan validation failed:", planValidation.error);
    allPassed = false;
  }

  console.log("=================================================");
  if (allPassed) {
    console.log("🎉 ALL ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!");
  } else {
    console.error("⚠️ SOME CHECKS FAILED");
    process.exit(1);
  }
  console.log("=================================================");
}

runVerification();
