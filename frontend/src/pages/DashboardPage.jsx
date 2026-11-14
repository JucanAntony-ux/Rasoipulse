import React, { useState, useEffect, useRef } from "react";
import { api } from "../lib/api";
import KpiSummaryRow from "../components/KpiSummaryRow";
import PrepComparisonChart from "../components/PrepComparisonChart";
import ExplainablePrepTable from "../components/ExplainablePrepTable";
import AutonomousActionPanel from "../components/AutonomousActionPanel";
import ScenarioSimulatorSidebar from "../components/ScenarioSimulatorSidebar";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";

export default function DashboardPage({ user, isDemo }) {
  const [menuItems, setMenuItems] = useState([]);
  const [simulationResults, setSimulationResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);

  // 7-Factor Decision Inputs
  const [scenarioInputs, setScenarioInputs] = useState({
    weather_mode: "Normal Weather",
    event_mode: "Regular Day",
    day_cycle: "Regular Weekday",
    traffic_mode: "Normal Traffic",
    neighborhood_signal: "None",
    expiring_ingredients: [],
    time_hour: 10
  });

  const userId = isDemo ? null : user?.id;

  // 1. Initial Load of Menu Items
  useEffect(() => {
    let isMounted = true;
    async function loadMenu() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getMenu(userId);
        if (isMounted) {
          const items = response.items || [];
          setMenuItems(items);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load kitchen menu items.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadMenu();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // 2. Debounced Simulation trigger on Scenario Inputs or Menu Items Change
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (menuItems.length === 0) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setSimulating(true);
      try {
        const result = await api.simulate(scenarioInputs, menuItems, userId);
        setSimulationResults(result);
      } catch (err) {
        console.error("Simulation error:", err);
      } finally {
        setSimulating(false);
      }
    }, 150); // Fast 150ms debounce for buttery responsiveness

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [scenarioInputs, menuItems, userId]);

  // Callback when scanner or reset updates menu items
  const handleItemsUpdated = (newItems) => {
    setMenuItems(newItems);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workspace Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              Kitchen Digital Twin & Simulator
            </h1>
            {simulating && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> Recalculating...
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate real-world weather, traffic, events, and raw expiring stock to prevent batch waste.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium">
            Active Master Items: <span className="font-mono font-bold text-orange-400">{menuItems.length}</span>
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Left Controls Sidebar (1 col on lg) vs Right Analytical Canvas (3 cols on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Scanner + 7-Factor Controls */}
        <div className="lg:col-span-4 space-y-6">
          <ScenarioSimulatorSidebar
            scenarioInputs={scenarioInputs}
            onChange={setScenarioInputs}
            onItemsUpdated={handleItemsUpdated}
            userId={userId}
          />
        </div>

        {/* Right Canvas: KPIs, Charts, Table, Autonomous Action Plan */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. 4 KPI Summary Cards */}
          <KpiSummaryRow
            kpis={simulationResults?.kpis}
            timeHour={scenarioInputs.time_hour}
          />

          {/* 2. Grouped Comparison Bar Chart */}
          <PrepComparisonChart
            items={simulationResults?.items || menuItems}
          />

          {/* 3. Explainable Prep Table with Reason Tags */}
          <ExplainablePrepTable
            items={simulationResults?.items || menuItems}
          />

          {/* 4. Autonomous Action Deliverables Generator */}
          <AutonomousActionPanel
            simulationResults={simulationResults}
            scenarioInputs={scenarioInputs}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}
