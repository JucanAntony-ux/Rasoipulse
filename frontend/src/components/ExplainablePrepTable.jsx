import React, { useState } from "react";
import { ArrowUpDown, AlertCircle, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function ExplainablePrepTable({ items = [] }) {
  const [sortField, setSortField] = useState("waste_saved_inr");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const getCategoryBadge = (cat) => {
    const config = {
      hot_snack: { label: "Hot Snack", bg: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
      hot_drink: { label: "Hot Drink", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
      cold_drink: { label: "Cold Drink", bg: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
      meal: { label: "Meal Box", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
    };
    const c = config[cat] || { label: cat, bg: "bg-slate-800 text-slate-300 border-slate-700" };
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${c.bg}`}>
        {c.label}
      </span>
    );
  };

  const getReasonTagStyle = (tag) => {
    if (tag.includes("+")) {
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/25";
    }
    if (tag.includes("-")) {
      return "bg-rose-500/10 text-rose-300 border-rose-500/25";
    }
    if (tag.includes("Alert") || tag.includes("⚠️")) {
      return "bg-amber-500/10 text-amber-300 border-amber-500/25 font-semibold";
    }
    return "bg-slate-800 text-slate-300 border-slate-700";
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Explainable Batch Prep & Margin Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Mathematical rationale tag pills explaining every individual batch shift
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
          <span>Sort by:</span>
          <button
            onClick={() => handleSort("waste_saved_inr")}
            className={`px-2 py-1 rounded text-xs border ${
              sortField === "waste_saved_inr"
                ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            ₹ Savings
          </button>
          <button
            onClick={() => handleSort("delta")}
            className={`px-2 py-1 rounded text-xs border ${
              sortField === "delta"
                ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            Delta
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort("item_name")}>
                <div className="flex items-center gap-1">
                  Item & Category
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort("wasted_yesterday")}>
                <div className="flex items-center gap-1">
                  Yesterday Waste
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort("base_prep")}>
                <div className="flex items-center gap-1">
                  Usual Prep
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort("recommended_prep")}>
                <div className="flex items-center gap-1">
                  AI Prep Target
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort("delta")}>
                <div className="flex items-center gap-1">
                  Shift (Delta)
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-3">Explainable Reason Tags</th>
              <th className="py-3 px-3 text-right cursor-pointer" onClick={() => handleSort("waste_saved_inr")}>
                <div className="flex items-center justify-end gap-1">
                  Spoilage Saved
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850 text-xs">
            {sortedItems.map((item) => {
              const delta = item.recommended_prep - item.base_prep;
              const wastePct = item.base_prep > 0
                ? Math.round((item.wasted_yesterday / item.base_prep) * 100)
                : 0;

              return (
                <tr
                  key={item.id || item.item_name}
                  className="hover:bg-slate-900/50 transition-colors group"
                >
                  {/* Item & Category */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200 group-hover:text-orange-300 transition-colors">
                      {item.item_name}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {getCategoryBadge(item.category)}
                      {item.is_perishable ? (
                        <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          Perishable
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          Non-perishable
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Yesterday Waste */}
                  <td className="py-3 px-3 font-mono">
                    <span className={wastePct > 20 ? "text-rose-400 font-bold" : "text-slate-300"}>
                      {item.wasted_yesterday} units
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1.5">
                      ({wastePct}%)
                    </span>
                  </td>

                  {/* Usual Prep */}
                  <td className="py-3 px-3 font-mono font-medium text-slate-400">
                    {item.base_prep} units
                  </td>

                  {/* AI Prep Target */}
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-sm">
                    {item.recommended_prep} units
                  </td>

                  {/* Delta Badge */}
                  <td className="py-3 px-3 font-mono">
                    {delta > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                        <TrendingUp className="w-3 h-3" />
                        +{delta}
                      </span>
                    ) : delta < 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                        <TrendingDown className="w-3 h-3" />
                        {delta}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px]">
                        <Minus className="w-3 h-3" />
                        0
                      </span>
                    )}
                  </td>

                  {/* Reason Tags */}
                  <td className="py-3 px-3 max-w-[280px]">
                    <div className="flex flex-wrap gap-1">
                      {item.reason_tags && item.reason_tags.length > 0 ? (
                        item.reason_tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className={`text-[10px] px-2 py-0.5 rounded-md border tracking-tight ${getReasonTagStyle(tag)}`}
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Baseline Demand</span>
                      )}
                    </div>
                  </td>

                  {/* Spoilage Saved */}
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    {item.waste_saved_inr > 0 ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        ₹{item.waste_saved_inr.toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
