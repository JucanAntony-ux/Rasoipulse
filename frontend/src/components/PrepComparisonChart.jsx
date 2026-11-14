import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { BarChart3 } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const delta = data.recommended_prep - data.base_prep;
    const isSaved = data.waste_saved_inr > 0;

    return (
      <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[200px]">
        <p className="font-bold text-slate-100 border-b border-slate-800 pb-1">{label}</p>
        <div className="flex justify-between items-center text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-500 inline-block"></span>
            Usual Prep:
          </span>
          <span className="font-mono font-semibold">{data.base_prep} units</span>
        </div>
        <div className="flex justify-between items-center text-emerald-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
            AI Prep Target:
          </span>
          <span className="font-mono font-semibold">{data.recommended_prep} units</span>
        </div>
        <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-800">
          <span>Target Shift:</span>
          <span className={`font-mono font-bold ${delta >= 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {delta > 0 ? `+${delta}` : delta} units
          </span>
        </div>
        {isSaved && (
          <div className="flex justify-between items-center text-emerald-300 pt-0.5">
            <span>Spoilage Prevented:</span>
            <span className="font-mono font-bold">₹{data.waste_saved_inr.toLocaleString("en-IN")}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function PrepComparisonChart({ items = [] }) {
  const chartData = items.map((item) => ({
    name: item.item_name.length > 14 ? item.item_name.slice(0, 12) + "…" : item.item_name,
    fullName: item.item_name,
    base_prep: item.base_prep,
    recommended_prep: item.recommended_prep,
    waste_saved_inr: item.waste_saved_inr || 0
  }));

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Usual Prep vs. AI Optimized Target
            </h3>
            <p className="text-xs text-slate-400">
              Batch preparation targets calibrated to weather, events & demand elasticity
            </p>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            barGap={6}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.03)" }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
              formatter={(value) => (
                <span className="text-slate-300 font-medium">
                  {value === "base_prep" ? "Usual Prep (Blind)" : "AI Prep Target"}
                </span>
              )}
            />
            <Bar
              dataKey="base_prep"
              name="base_prep"
              fill="#64748b"
              radius={[4, 4, 0, 0]}
              maxBarSize={38}
            />
            <Bar
              dataKey="recommended_prep"
              name="recommended_prep"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={38}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
