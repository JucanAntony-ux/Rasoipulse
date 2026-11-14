import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";
import { MenuItemSchema } from "../schemas/validation";

export default function MenuEditorModal({ isOpen, item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    item_name: "",
    category: "hot_snack",
    base_prep: 50,
    wasted_yesterday: 0,
    cost_price: 30,
    sell_price: 100,
    is_perishable: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name || "",
        category: item.category || "hot_snack",
        base_prep: item.base_prep || 50,
        wasted_yesterday: item.wasted_yesterday || 0,
        cost_price: item.cost_price || 30,
        sell_price: item.sell_price || 100,
        is_perishable: item.is_perishable !== undefined ? item.is_perishable : true
      });
    } else {
      setFormData({
        item_name: "",
        category: "hot_snack",
        base_prep: 50,
        wasted_yesterday: 0,
        cost_price: 30,
        sell_price: 100,
        is_perishable: true
      });
    }
    setErrors({});
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = MenuItemSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        const path = err.path[0];
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSave(validation.data, item?.id);
      onClose();
    } catch (err) {
      setErrors({ form: err.message || "Failed to save item" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100">
            {item ? "Edit Menu Master Item" : "Add New Menu Item"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errors.form && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Item Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Item Name</label>
            <input
              type="text"
              value={formData.item_name}
              onChange={(e) => handleChange("item_name", e.target.value)}
              placeholder="e.g. Paneer Kathi Roll"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
            />
            {errors.item_name && <p className="text-rose-400 text-[11px]">{errors.item_name}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Operational Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="hot_snack">Hot Snack (Rain / Match Sensitive)</option>
              <option value="hot_drink">Hot Drink (Chai / Morning & Night)</option>
              <option value="cold_drink">Cold Drink (Afternoon Heat Surge)</option>
              <option value="meal">Meal Box (Lunch / Payday / Delivery)</option>
            </select>
          </div>

          {/* Quantities Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Baseline Prep (Units)</label>
              <input
                type="number"
                min="1"
                max="5000"
                value={formData.base_prep}
                onChange={(e) => handleChange("base_prep", parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-orange-500"
              />
              {errors.base_prep && <p className="text-rose-400 text-[11px]">{errors.base_prep}</p>}
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Yesterday Waste (Units)</label>
              <input
                type="number"
                min="0"
                max="5000"
                value={formData.wasted_yesterday}
                onChange={(e) => handleChange("wasted_yesterday", parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-orange-500"
              />
              {errors.wasted_yesterday && <p className="text-rose-400 text-[11px]">{errors.wasted_yesterday}</p>}
            </div>
          </div>

          {/* Financials Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Cost Price (₹)</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={formData.cost_price}
                onChange={(e) => handleChange("cost_price", parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-orange-500"
              />
              {errors.cost_price && <p className="text-rose-400 text-[11px]">{errors.cost_price}</p>}
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Selling Price (₹)</label>
              <input
                type="number"
                min="1"
                max="20000"
                value={formData.sell_price}
                onChange={(e) => handleChange("sell_price", parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-orange-500"
              />
              {errors.sell_price && <p className="text-rose-400 text-[11px]">{errors.sell_price}</p>}
            </div>
          </div>

          {/* Perishable Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={formData.is_perishable}
                onChange={(e) => handleChange("is_perishable", e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 border-slate-700 focus:ring-orange-500 bg-slate-950"
              />
              <span>Perishable (Subject to evening waste and spoilage scoring)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
