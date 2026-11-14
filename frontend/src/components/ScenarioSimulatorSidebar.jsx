import React from "react";
import {
  SlidersHorizontal,
  CloudRain,
  Trophy,
  Calendar,
  Navigation,
  Compass,
  AlertTriangle,
  Clock,
  Sparkles,
  Zap
} from "lucide-react";
import RegisterScannerCard from "./RegisterScannerCard";

export default function ScenarioSimulatorSidebar({
  scenarioInputs,
  onChange,
  onItemsUpdated,
  userId
}) {
  const updateField = (field, value) => {
    onChange({
      ...scenarioInputs,
      [field]: value
    });
  };

  const toggleExpiringIngredient = (ingredient) => {
    const current = scenarioInputs.expiring_ingredients || [];
    const updated = current.includes(ingredient)
      ? current.filter(i => i !== ingredient)
      : [...current, ingredient];
    updateField("expiring_ingredients", updated);
  };

  // Quick Preset Scenarios for instant testing
  const presets = [
    {
      label: "⛈️ Monsoon Rush",
      scenario: {
        weather_mode: "Heavy Evening Rain",
        event_mode: "Regular Day",
        day_cycle: "Regular Weekday",
        traffic_mode: "Heavy Traffic Gridlock (Delivery Spike)",
        neighborhood_signal: "None",
        expiring_ingredients: ["Milk/Curd"],
        time_hour: 19
      }
    },
    {
      label: "🏏 IPL Match Night",
      scenario: {
        weather_mode: "Normal Weather",
        event_mode: "IPL / Cricket Match Night",
        day_cycle: "Friday / Weekend Rush",
        traffic_mode: "Heavy Traffic Gridlock (Delivery Spike)",
        neighborhood_signal: "None",
        expiring_ingredients: ["Chicken"],
        time_hour: 20
      }
    },
    {
      label: "🥗 Fasting / Veg Day",
      scenario: {
        weather_mode: "Normal Weather",
        event_mode: "Regular Day",
        day_cycle: "Regular Weekday",
        traffic_mode: "Normal Traffic",
        neighborhood_signal: "Fasting / Veg-Only Day",
        expiring_ingredients: ["Paneer"],
        time_hour: 12
      }
    },
    {
      label: "🪙 Month-End Budget",
      scenario: {
        weather_mode: "Normal Weather",
        event_mode: "Tech Park Holiday / Slow Day",
        day_cycle: "Month-End Budget Mode (25th-30th)",
        traffic_mode: "Normal Traffic",
        neighborhood_signal: "None",
        expiring_ingredients: ["Milk/Curd"],
        time_hour: 18
      }
    }
  ];

  const formatHour = (hour) => {
    const h = String(hour).padStart(2, "0");
    return `${h}:00`;
  };

  return (
    <div className="space-y-5">
      {/* 1. Register Scanner Card */}
      <RegisterScannerCard onItemsUpdated={onItemsUpdated} userId={userId} />

      {/* 2. Simulator Controls Card */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-slate-100">
              7-Factor "What-If" Controls
            </h3>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Real-Time
          </span>
        </div>

        {/* Quick Scenario Presets */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
            <Zap className="w-3 h-3 text-amber-400" />
            Quick Scenario Presets
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.scenario)}
                className="text-left text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-orange-500/10 border border-slate-800 hover:border-orange-500/30 text-slate-300 hover:text-orange-300 transition-all truncate"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Control 1: Weather Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            Hyper-Local Weather Forecast
          </label>
          <select
            value={scenarioInputs.weather_mode}
            onChange={(e) => updateField("weather_mode", e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="Normal Weather">Normal Weather (Baseline)</option>
            <option value="Heavy Evening Rain">Heavy Evening Rain (Chai/Snack Surge)</option>
            <option value="Hot Sunny Afternoon">Hot Sunny Afternoon (Beverage Surge)</option>
          </select>
        </div>

        {/* Control 2: Event Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Major Local Events
          </label>
          <select
            value={scenarioInputs.event_mode}
            onChange={(e) => updateField("event_mode", e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="Regular Day">Regular Day</option>
            <option value="IPL / Cricket Match Night">IPL / Cricket Match Night</option>
            <option value="Tech Park Holiday / Slow Day">Tech Park Holiday / Slow Day</option>
          </select>
        </div>

        {/* Control 3: Day & Salary Cycle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Day & Payday Cycle
          </label>
          <select
            value={scenarioInputs.day_cycle}
            onChange={(e) => updateField("day_cycle", e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="Regular Weekday">Regular Weekday</option>
            <option value="Friday / Weekend Rush">Friday / Weekend Rush</option>
            <option value="Payday Week (1st-5th)">Payday Week (1st-5th)</option>
            <option value="Month-End Budget Mode (25th-30th)">Month-End Budget Mode (25th-30th)</option>
          </select>
        </div>

        {/* Control 4: Traffic Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-rose-400" />
            Traffic & Delivery Gridlock
          </label>
          <select
            value={scenarioInputs.traffic_mode}
            onChange={(e) => updateField("traffic_mode", e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="Normal Traffic">Normal Traffic</option>
            <option value="Heavy Traffic Gridlock (Delivery Spike)">Heavy Traffic Gridlock (Delivery Spike)</option>
          </select>
        </div>

        {/* Control 5: Neighborhood Signal */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            Neighborhood & Cultural Signals
          </label>
          <select
            value={scenarioInputs.neighborhood_signal}
            onChange={(e) => updateField("neighborhood_signal", e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="None">None (Standard Demand)</option>
            <option value="Fasting / Veg-Only Day">Fasting / Veg-Only Day (Shravan/Ekadashi)</option>
            <option value="College Exam Week">College Exam Week (Late Caffeine Surge)</option>
            <option value="Competitor Closed Nearby">Competitor Closed Nearby (+25% Footfall)</option>
          </select>
        </div>

        {/* Control 6: Expiring Raw Ingredients */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Expiring Raw Ingredients Tonight
          </label>
          <div className="flex flex-wrap gap-2">
            {["Paneer", "Chicken", "Milk/Curd"].map((ing) => {
              const isChecked = (scenarioInputs.expiring_ingredients || []).includes(ing);
              return (
                <button
                  key={ing}
                  type="button"
                  onClick={() => toggleExpiringIngredient(ing)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                    isChecked
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20 font-bold"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isChecked ? "bg-amber-400 animate-pulse" : "bg-slate-600"}`}></span>
                  {ing}
                </button>
              );
            })}
          </div>
        </div>

        {/* Control 7: Kitchen Clock Hour Slider */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              Kitchen Clock Hour
            </label>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {formatHour(scenarioInputs.time_hour)}
              </span>
              {scenarioInputs.time_hour >= 18 && (
                <span className="text-[10px] font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 animate-pulse">
                  Flash-Sale Window
                </span>
              )}
            </div>
          </div>
          <input
            type="range"
            min="8"
            max="22"
            step="1"
            value={scenarioInputs.time_hour}
            onChange={(e) => updateField("time_hour", parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>08:00 (Morning)</span>
            <span>15:00 (Afternoon)</span>
            <span>22:00 (Closing)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
