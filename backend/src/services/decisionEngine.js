/**
 * Multi-Factor Explainable Decision Engine
 * Deterministic mathematical scoring engine combining 7 real-world operational variables.
 */
export function simulateDemandAndPrep(menuItems, scenarioInputs) {
  const {
    weather_mode = "Normal Weather",
    event_mode = "Regular Day",
    day_cycle = "Regular Weekday",
    traffic_mode = "Normal Traffic",
    neighborhood_signal = "None",
    expiring_ingredients = [],
    time_hour = 10
  } = scenarioInputs;

  const simulatedItems = menuItems.map((item) => {
    let multiplier = 1.0;
    const reason_tags = [];

    // 1. Yesterday's Waste Ratio Check
    if (item.base_prep > 0 && (item.wasted_yesterday / item.base_prep) > 0.20) {
      multiplier -= 0.15;
      reason_tags.push("📉 High Yesterday Waste -15%");
    }

    // 2. Weather Factor
    if (weather_mode === "Heavy Evening Rain") {
      if (item.category === "hot_drink" || item.category === "hot_snack") {
        multiplier += 0.40;
        reason_tags.push("🌧️ Rain +40%");
      } else if (item.category === "cold_drink") {
        multiplier -= 0.45;
        reason_tags.push("🌧️ Rain -45%");
      }
    } else if (weather_mode === "Hot Sunny Afternoon") {
      if (item.category === "cold_drink") {
        multiplier += 0.45;
        reason_tags.push("☀️ Heat +45%");
      } else if (item.category === "hot_drink") {
        multiplier -= 0.25;
        reason_tags.push("☀️ Heat -25%");
      }
    }

    // 3. Major Local Events
    if (event_mode === "IPL / Cricket Match Night") {
      if (item.category === "hot_snack" || item.category === "meal") {
        multiplier += 0.50;
        reason_tags.push("🏏 Match Night +50%");
      }
    } else if (event_mode === "Tech Park Holiday / Slow Day") {
      multiplier -= 0.30;
      reason_tags.push("🏢 Tech Holiday -30%");
    }

    // 4. Day & Salary Cycle
    if (day_cycle === "Friday / Weekend Rush" || day_cycle === "Payday Week (1st-5th)") {
      if (item.category === "meal" || item.category === "hot_snack") {
        multiplier += 0.30;
        reason_tags.push("💸 Payday/Weekend +30%");
      }
    } else if (day_cycle === "Month-End Budget Mode (25th-30th)") {
      if (item.sell_price >= 100) {
        multiplier -= 0.20;
        reason_tags.push("🪙 Month-End -20%");
      } else {
        multiplier += 0.20;
        reason_tags.push("🪙 Budget Snack +20%");
      }
    }

    // 5. Traffic & Delivery Surge
    if (traffic_mode === "Heavy Traffic Gridlock (Delivery Spike)") {
      if (item.category === "meal" || item.category === "hot_snack") {
        multiplier += 0.35;
        reason_tags.push("🚦 Traffic Delivery +35%");
      } else if (item.category === "cold_drink") {
        multiplier -= 0.20;
        reason_tags.push("🚦 Low Walk-In -20%");
      }
    }

    // 6. Neighborhood & Cultural Signal
    if (neighborhood_signal === "Fasting / Veg-Only Day") {
      const isNonVeg = /chicken|egg|mutton|fish/i.test(item.item_name);
      if (isNonVeg) {
        multiplier -= 0.80;
        reason_tags.push("🥗 Fasting -80%");
      } else {
        multiplier += 0.45;
        reason_tags.push("🥗 Veg Surge +45%");
      }
    } else if (neighborhood_signal === "College Exam Week") {
      if (item.category === "hot_drink" || item.category === "cold_drink") {
        multiplier += 0.45;
        reason_tags.push("📚 Exam Caffeine +45%");
      }
    } else if (neighborhood_signal === "Competitor Closed Nearby") {
      multiplier += 0.25;
      reason_tags.push("🏪 Rival Closed +25%");
    }

    // Check expiring raw ingredients priority tag
    const itemNameLower = item.item_name.toLowerCase();
    const hasExpiringMatch = expiring_ingredients.some((ing) => {
      const ingLower = ing.toLowerCase();
      if (ingLower === "milk/curd") {
        return itemNameLower.includes("chai") || itemNameLower.includes("coffee") || itemNameLower.includes("curd") || itemNameLower.includes("lassi") || itemNameLower.includes("milk");
      }
      return itemNameLower.includes(ingLower);
    });

    if (hasExpiringMatch) {
      reason_tags.push("⚠️ Uses Expiring Stock");
    }

    // Prevent multiplier from falling to 0 or negative
    multiplier = Math.max(0.1, multiplier);

    // Final Metric Calculations
    const recommended_prep = Math.max(5, Math.round(item.base_prep * multiplier));
    const delta = recommended_prep - item.base_prep;
    const waste_saved_inr = item.is_perishable
      ? Math.max(0, item.base_prep - recommended_prep) * item.cost_price
      : 0;
    const at_risk_units = (time_hour >= 18 && item.is_perishable)
      ? Math.round(recommended_prep * 0.24)
      : 0;

    return {
      ...item,
      multiplier: Number(multiplier.toFixed(2)),
      recommended_prep,
      delta,
      waste_saved_inr,
      at_risk_units,
      reason_tags
    };
  });

  // Calculate Aggregated KPIs
  const daily_saved_inr = simulatedItems.reduce((acc, curr) => acc + curr.waste_saved_inr, 0);
  const monthly_saved_inr = daily_saved_inr * 30;
  const at_risk_total = simulatedItems.reduce((acc, curr) => acc + curr.at_risk_units, 0);
  
  // Flash sale recovery: at-risk perishable units recovered at 65% discounted selling price
  const flash_sale_recovery_inr = simulatedItems.reduce((acc, curr) => {
    return acc + Math.round(curr.at_risk_units * (curr.sell_price * 0.65));
  }, 0);

  return {
    kpis: {
      daily_saved_inr,
      monthly_saved_inr,
      at_risk_total,
      flash_sale_recovery_inr
    },
    items: simulatedItems
  };
}
