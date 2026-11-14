import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import {
  History,
  ShieldCheck,
  Flame,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertCircle
} from "lucide-react";

export default function HistoryPage({ user, isDemo }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [error, setError] = useState(null);

  const userId = isDemo ? null : user?.id;

  useEffect(() => {
    let isMounted = true;
    async function fetchAuditLogs() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getLogs(userId);
        if (isMounted) {
          setLogs(response.logs || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load simulation logs.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchAuditLogs();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Cumulative metrics
  const totalSavings = logs.reduce((acc, l) => acc + (l.projected_savings_inr || 0), 0);
  const totalRecovery = logs.reduce((acc, l) => acc + (l.flash_sale_recovery_inr || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <History className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              Simulation & Flash-Sale Audit Log
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Persistent audit record of generated AI execution directives and audited bottom-line savings.
          </p>
        </div>

        {/* Aggregated Totals */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-sans">Total Spoilage Saved</span>
            <span className="text-emerald-400 font-bold text-sm">₹{totalSavings.toLocaleString("en-IN")}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-sans">Flash-Sale Recovered</span>
            <span className="text-orange-400 font-bold text-sm">₹{totalRecovery.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Logs List */}
      {loading ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
          Loading past simulation runs...
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-2">
          <History className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">No Simulations Logged Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Head over to the Simulator workspace and click "Generate Live Kitchen & Flash-Sale Plan" to record your first operational plan.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => {
            const isExpanded = expandedId === log.id;
            const scenario = log.scenario_inputs || {};
            const plan = log.action_plan_json || {};
            const dateStr = new Date(log.created_at).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div
                key={log.id}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all"
              >
                {/* Log Header Row */}
                <div
                  onClick={() => toggleExpand(log.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">
                        {scenario.weather_mode || "Normal Weather"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {scenario.event_mode || "Regular Day"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {scenario.day_cycle || "Weekday"}
                      </span>
                      {scenario.time_hour !== undefined && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          {String(scenario.time_hour).padStart(2, "0")}:00
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Recorded {dateStr}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right font-mono text-xs">
                      <span className="text-emerald-400 font-bold block">
                        +₹{Number(log.projected_savings_inr || 0).toLocaleString("en-IN")} Saved
                      </span>
                      <span className="text-orange-400 text-[11px] block">
                        ₹{Number(log.flash_sale_recovery_inr || 0).toLocaleString("en-IN")} Recovery
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Action Plan Details */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4 bg-slate-950/40 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {/* Morning Prep Summary */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-amber-400 font-bold text-[11px]">
                          <span>Morning Prep Rule</span>
                          <button
                            onClick={() => copyText(plan.morning_prep_summary, `${log.id}-prep`)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                          >
                            {copiedKey === `${log.id}-prep` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{plan.morning_prep_summary}</p>
                      </div>

                      {/* Flash Sale Promo */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-orange-400 font-bold text-[11px]">
                          <span>Swiggy / WhatsApp Promo</span>
                          <button
                            onClick={() => copyText(plan.rescue_flash_sale, `${log.id}-flash`)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                          >
                            {copiedKey === `${log.id}-flash` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-mono text-[11px] whitespace-pre-line">{plan.rescue_flash_sale}</p>
                      </div>

                      {/* Supplier WhatsApp Draft */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-sky-400 font-bold text-[11px]">
                          <span>Vendor WhatsApp Adjustment</span>
                          <button
                            onClick={() => copyText(plan.supplier_whatsapp_draft, `${log.id}-sup`)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                          >
                            {copiedKey === `${log.id}-sup` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{plan.supplier_whatsapp_draft}</p>
                      </div>

                      {/* Cook Hinglish Briefing */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-emerald-400 font-bold text-[11px]">
                          <span>Cook Hinglish Briefing</span>
                          <button
                            onClick={() => copyText(plan.cook_hinglish_briefing, `${log.id}-cook`)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                          >
                            {copiedKey === `${log.id}-cook` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-slate-300 leading-relaxed italic">"{plan.cook_hinglish_briefing}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
