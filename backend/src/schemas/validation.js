import { z } from "zod";

export const CategoryEnum = z.enum(["hot_snack", "hot_drink", "cold_drink", "meal"]);

export const MenuItemSchema = z.object({
  id: z.string().uuid().optional(),
  item_name: z.string().min(1, "Item name is required").max(80),
  category: CategoryEnum,
  base_prep: z.coerce.number().int().min(1).max(5000),
  wasted_yesterday: z.coerce.number().int().min(0).max(5000),
  cost_price: z.coerce.number().int().min(1).max(10000),
  sell_price: z.coerce.number().int().min(1).max(20000),
  is_perishable: z.boolean().default(true)
});

export const RegisterExtractionZodSchema = z.object({
  items: z.array(MenuItemSchema).min(1, "At least one item must be extracted")
});

export const SimulationInputSchema = z.object({
  weather_mode: z.enum(["Normal Weather", "Heavy Evening Rain", "Hot Sunny Afternoon"]),
  event_mode: z.enum(["Regular Day", "IPL / Cricket Match Night", "Tech Park Holiday / Slow Day"]),
  day_cycle: z.enum([
    "Regular Weekday",
    "Friday / Weekend Rush",
    "Payday Week (1st-5th)",
    "Month-End Budget Mode (25th-30th)"
  ]),
  traffic_mode: z.enum(["Normal Traffic", "Heavy Traffic Gridlock (Delivery Spike)"]),
  neighborhood_signal: z.enum([
    "None",
    "Fasting / Veg-Only Day",
    "College Exam Week",
    "Competitor Closed Nearby"
  ]),
  expiring_ingredients: z.array(z.enum(["Paneer", "Chicken", "Milk/Curd"])).default([]),
  time_hour: z.coerce.number().int().min(8).max(22)
});

export const ActionPlanZodSchema = z.object({
  morning_prep_summary: z.string().min(10),
  rescue_flash_sale: z.string().min(10),
  supplier_whatsapp_draft: z.string().min(10),
  cook_hinglish_briefing: z.string().min(10)
});
