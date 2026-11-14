import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import MenuEditorModal from "../components/MenuEditorModal";
import {
  BookOpen,
  Plus,
  RotateCcw,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Sparkles
} from "lucide-react";

export default function MenuPage({ user, isDemo }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [resetting, setResetting] = useState(false);

  const userId = isDemo ? null : user?.id;

  const loadMenu = async () => {
    setLoading(true);
    try {
      const response = await api.getMenu(userId);
      setItems(response.items || []);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load menu items." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [userId]);

  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (formData, itemId) => {
    if (itemId) {
      await api.updateMenuItem(itemId, formData, userId);
      setMessage({ type: "success", text: `Updated "${formData.item_name}" successfully.` });
    } else {
      await api.createMenuItem(formData, userId);
      setMessage({ type: "success", text: `Created "${formData.item_name}" successfully.` });
    }
    await loadMenu();
  };

  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from your menu?`)) {
      try {
        await api.deleteMenuItem(id, userId);
        setMessage({ type: "success", text: `Deleted "${name}".` });
        await loadMenu();
      } catch (err) {
        setMessage({ type: "error", text: "Failed to delete item." });
      }
    }
  };

  const handleResetMenu = async () => {
    if (window.confirm("Reset menu to the 6 default cloud kitchen items? Any custom items will be cleared.")) {
      setResetting(true);
      try {
        const res = await api.resetMenu(userId);
        setItems(res.items || []);
        setMessage({ type: "success", text: "Restored 6 default cloud-kitchen items." });
      } catch (err) {
        setMessage({ type: "error", text: "Failed to reset menu." });
      } finally {
        setResetting(false);
      }
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              Kitchen Menu & Cost Master
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Maintain item costs, selling prices, baseline prep batches, and perishability rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetMenu}
            disabled={resetting}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            Reset to Default 6
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Item Details</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Baseline Prep</th>
                <th className="py-3 px-3">Yesterday Waste</th>
                <th className="py-3 px-3">Cost Price</th>
                <th className="py-3 px-3">Selling Price</th>
                <th className="py-3 px-3">Gross Margin</th>
                <th className="py-3 px-3">Perishable</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-xs">
              {items.map((item) => {
                const marginPct = Math.round(
                  ((item.sell_price - item.cost_price) / item.sell_price) * 100
                );

                return (
                  <tr key={item.id} className="hover:bg-slate-900/50 transition-colors group">
                    <td className="py-3.5 px-3 font-semibold text-slate-200">
                      {item.item_name}
                    </td>
                    <td className="py-3.5 px-3">
                      {getCategoryBadge(item.category)}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {item.base_prep} units
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <span className={item.wasted_yesterday > 10 ? "text-rose-400 font-bold" : "text-slate-400"}>
                        {item.wasted_yesterday} units
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      ₹{item.cost_price}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-slate-200">
                      ₹{item.sell_price}
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        marginPct >= 50
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {marginPct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {item.is_perishable ? (
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-medium">
                          Yes
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          No
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Item"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.item_name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      <MenuEditorModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
}
