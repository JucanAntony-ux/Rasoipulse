import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flame,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CloudRain,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Smartphone,
  Cpu,
  Clock,
  Layers
} from "lucide-react";

export default function LandingPage({ onEnterDemo }) {
  const navigate = useNavigate();

  const handleLaunchDemo = () => {
    if (onEnterDemo) {
      onEnterDemo();
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Banner / Nav */}
      <nav className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-md shadow-orange-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
              RasoiPulse
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={handleLaunchDemo}
              className="text-xs font-bold px-4 py-2 rounded-xl text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              Launch Live Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Kitchen Digital Twin & Decision Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl text-slate-100 leading-[1.15]">
          Stop losing <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">30% daily profit</span> to blind batch prep.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Small Indian restaurants, cafes, and cloud kitchens operate on razor-thin 15% margins.
          RasoiPulse turns handwritten logs, live weather, payday cycles, and expiring perishables into exact batch targets and instant cash-recovery flash sales.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button
            onClick={handleLaunchDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Launch Live Demo Workspace
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            to="/auth"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-center"
          >
            Create Kitchen Account
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl pt-12">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-left">
            <p className="text-xs text-slate-400">Net Operating Margin</p>
            <h4 className="text-2xl font-bold font-mono text-slate-100 mt-1">15%–20%</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Industry standard</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-left">
            <p className="text-xs text-slate-400">Lost to Spoilage & Guesswork</p>
            <h4 className="text-2xl font-bold font-mono text-rose-400 mt-1">20%–30%</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Over-prepping blindly</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-left">
            <p className="text-xs text-slate-400">Monthly Profit Lift</p>
            <h4 className="text-2xl font-bold font-mono text-emerald-400 mt-1">+₹45,000</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Prevented batch waste</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-left">
            <p className="text-xs text-slate-400">AI Model Backing</p>
            <h4 className="text-2xl font-bold font-mono text-amber-400 mt-1">Gemini 2.5</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Multimodal Vision + Actions</p>
          </div>
        </div>

        {/* 4 Pillars Section */}
        <div className="w-full max-w-5xl pt-16 space-y-6 text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 text-center">
            How RasoiPulse Empowers Independent Kitchens
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pillar 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                1. Digitize Handwritten Registers
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take a quick smartphone photo of your messy pen-and-paper daily waste notebook.
                Gemini 2.5 Flash Vision extracts dish names, quantities, and cost prices directly into structured database records in under 2 seconds.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                2. Explainable 7-Factor Simulator
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mathematical demand calibration factoring in hyper-local Bengaluru rain forecasts, IPL match nights, tech park holidays, Friday paydays, fasting restrictions, and road gridlock. Every batch target comes with an explicit reason tag badge.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                3. Evening Swiggy & WhatsApp Flash Sales
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                At 6 PM, detect expiring paneer, chicken, or gravies. RasoiPulse synthesizes high-converting, localized flash-sale promo copy with exact ₹ discounts to clear at-risk units before midnight.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                4. Hinglish Audio Briefing for Kitchen Staff
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Head cooks don't read English spreadsheets. One tap plays a synthesized Hinglish voice briefing via the Web Speech API so line cooks immediately know what batch cuts to apply and which opened packs to finish first.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RasoiPulse Decision Intelligence. Built for Indian Cloud Kitchens & Restaurants.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Powered by Gemini 2.5 Flash & Supabase</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
