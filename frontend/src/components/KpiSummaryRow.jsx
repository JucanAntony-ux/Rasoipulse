import React from "react";
import { ShieldCheck, TrendingUp, AlertTriangle, IndianRupee, Flame } from "lucide-react";

export default function KpiSummaryRow({ kpis, timeHour }) {
  const formatINR = (val) => {
    return `₹${Math.round(val || 0).toLocaleString("en-IN")}`;
  };

  const isEveningWindow = (timeHour || 10) >= 18;

  const cards = [
    {
      title: "Daily Spoilage Saved",
      value: formatINR(kpis?.daily_saved_inr),
      subtitle: "Prevented over-prep waste today",
      icon: ShieldCheck,
      color: "emerald",
      badge: "Targeted Prep Cuts",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    },
    {
      title: "30-Day Profit Lift",
      value: formatINR(kpis?.monthly_saved_inr),
      subtitle: "Projected monthly bottom-line boost",
      icon: TrendingUp,
      color: "blue",
      badge: "+18.4% Net Margin",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20"
    },
    {
      title: "Perishables at Risk Now",
      value: `${kpis?.at_risk_total || 0} units`,
      subtitle: isEveningWindow
        ? "Unsold perishables facing night spoilage"
        : "Safe (Calculated after 18:00 evening)",
      icon: AlertTriangle,
      color: isEveningWindow && (kpis?.at_risk_total || 0) > 0 ? "rose" : "slate",
      badge: isEveningWindow ? "Urgent Action" : "Morning Window",
      badgeColor: isEveningWindow && (kpis?.at_risk_total || 0) > 0
        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
        : "bg-slate-800 text-slate-400 border-slate-700"
    },
    {
      title: "Flash-Sale Recovery",
      value: formatINR(kpis?.flash_sale_recovery_inr),
      subtitle: "Recoverable cash via Swiggy/WhatsApp promo",
      icon: Flame,
      color: "orange",
      badge: "65% Discount Cash",
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all shadow-lg relative overflow-hidden group"
          >
            {/* Ambient background glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none ${
              card.color === 'emerald' ? 'bg-emerald-500/10' :
              card.color === 'blue' ? 'bg-sky-500/10' :
              card.color === 'rose' ? 'bg-rose-500/10' :
              'bg-orange-500/10'
            }`} />

            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${card.badgeColor}`}>
                {card.badge}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                card.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                card.color === 'blue' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                card.color === 'rose' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                'bg-orange-500/10 text-orange-400 border-orange-500/20'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">{card.title}</p>
              <h4 className="text-2xl font-extrabold tracking-tight text-slate-100 font-mono">
                {card.value}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
