import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sunrise,
  Flame,
  MessageSquare,
  ChefHat,
  Send,
  Zap
} from "lucide-react";
import { api } from "../lib/api";

export default function AutonomousActionPanel({
  simulationResults,
  scenarioInputs,
  userId
}) {
  const [loading, setLoading] = useState(false);
  const [actionPlan, setActionPlan] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);

  // Stop speech if component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleGenerate = async () => {
    if (!simulationResults || !simulationResults.items) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.generateActions(
        simulationResults,
        scenarioInputs,
        scenarioInputs.expiring_ingredients || [],
        userId
      );
      setActionPlan(response.action_plan);
    } catch (err) {
      setError(err.message || "Failed to generate autonomous operational plan.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleToggleSpeech = (text) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported by your browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Clear queued utterances
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower, natural cadence
    utterance.pitch = 1.0;

    // Check if Hindi/Indian English voice is available
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(
      v => v.lang.includes("hi-IN") || v.lang.includes("en-IN") || v.name.includes("India")
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass-panel-elevated rounded-2xl p-6 border border-slate-700/80 shadow-2xl space-y-6">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-100">
              Autonomous Kitchen & Revenue Rescue Actions
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            AI-synthesized operational deliverables ready to broadcast to cooks, customers & vendors
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="self-start sm:self-auto py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Synthesizing Multi-Channel Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Live Kitchen & Flash-Sale Plan
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* 4 Structured Action Cards */}
      {actionPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Morning Prep Summary */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-slate-700 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Sunrise className="w-4 h-4" />
                  Morning Batch Prep Targets
                </span>
                <button
                  onClick={() => copyToClipboard(actionPlan.morning_prep_summary, "prep")}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition-colors"
                >
                  {copiedKey === "prep" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {actionPlan.morning_prep_summary}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Audited Waste Avoidance</span>
              <span className="font-mono text-emerald-400 font-semibold">Active Directive</span>
            </div>
          </div>

          {/* Card 2: Evening Flash-Sale Clearance Promo */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-orange-500/30 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                  <Flame className="w-4 h-4" />
                  Swiggy / WhatsApp Flash-Sale Promo
                </span>
                <button
                  onClick={() => copyToClipboard(actionPlan.rescue_flash_sale, "flash")}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition-colors"
                >
                  {copiedKey === "flash" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Promo
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                {actionPlan.rescue_flash_sale}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Clears At-Risk Evening Inventory</span>
              <span className="text-orange-400 font-semibold flex items-center gap-1">
                <Send className="w-3 h-3" /> WhatsApp / Swiggy Ready
              </span>
            </div>
          </div>

          {/* Card 3: Supplier WhatsApp Adjustment Draft */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-slate-700 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                  <MessageSquare className="w-4 h-4" />
                  Vendor WhatsApp Raw Stock Order
                </span>
                <button
                  onClick={() => copyToClipboard(actionPlan.supplier_whatsapp_draft, "supplier")}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition-colors"
                >
                  {copiedKey === "supplier" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Draft
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                {actionPlan.supplier_whatsapp_draft}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Prevents Over-Stock Spoilage</span>
              <span className="text-sky-400 font-semibold">Dairy & Produce Vendor</span>
            </div>
          </div>

          {/* Card 4: Cook Hinglish Verbal Briefing */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-emerald-500/30 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <ChefHat className="w-4 h-4" />
                  Head Cook Hinglish Briefing
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleSpeech(actionPlan.cook_hinglish_briefing)}
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border transition-colors ${
                      isSpeaking
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3 h-3" />
                        Stop Voice
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" />
                        🔊 Speak Briefing
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(actionPlan.cook_hinglish_briefing, "cook")}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition-colors"
                  >
                    {copiedKey === "cook" ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                "{actionPlan.cook_hinglish_briefing}"
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Web Speech API Synthesis</span>
              <span className="text-emerald-400 font-semibold">Kitchen Floor Audio</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center bg-slate-900/30">
          <ChefHat className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-300">
            No active operational plan generated yet
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
            Click "Generate Live Kitchen & Flash-Sale Plan" above to create morning prep guidelines,
            WhatsApp flash-sale promos, and audio Hinglish briefings calibrated to your scenario.
          </p>
        </div>
      )}
    </div>
  );
}
