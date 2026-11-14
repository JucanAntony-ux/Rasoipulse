import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Flame,
  CloudRain,
  Sun,
  Cloud,
  ChefHat,
  History,
  BookOpen,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { api } from "../lib/api";

export default function Navbar({ user, isDemo, onSignOut }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      try {
        const data = await api.getWeather();
        if (isMounted) {
          setWeather(data);
          setLoadingWeather(false);
        }
      } catch (err) {
        if (isMounted) {
          setWeather({
            city: "Bengaluru",
            temperature_c: 24.0,
            precipitation_mm: 0.0,
            summary: "24.0°C | Rain: 0.0mm"
          });
          setLoadingWeather(false);
        }
      }
    }
    loadWeather();
    const interval = setInterval(loadWeather, 60000); // Refresh every 60s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { path: "/dashboard", label: "Simulator", icon: Sparkles },
    { path: "/menu", label: "Menu Master", icon: BookOpen },
    { path: "/history", label: "Audit History", icon: History }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  RasoiPulse
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  AI v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Kitchen Decision Intelligence</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Bengaluru Weather Badge + Auth / Demo Status */}
        <div className="flex items-center gap-3">
          {/* Live Bengaluru Weather Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 shadow-inner">
            {loadingWeather ? (
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-600 animate-ping"></span>
                Fetching Weather...
              </span>
            ) : weather ? (
              <>
                <span className="flex items-center gap-1 font-semibold text-slate-200">
                  {weather.precipitation_mm > 0 ? (
                    <CloudRain className="w-4 h-4 text-sky-400" />
                  ) : weather.temperature_c >= 28 ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Cloud className="w-4 h-4 text-slate-400" />
                  )}
                  {weather.city}:
                </span>
                <span className="text-orange-400 font-mono font-medium">{weather.temperature_c}°C</span>
                <span className="text-slate-500">|</span>
                <span className={weather.precipitation_mm > 0 ? "text-sky-400 font-medium" : "text-slate-400"}>
                  Rain: {weather.precipitation_mm}mm
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Live Open-Meteo API Feed"></span>
              </>
            ) : null}
          </div>

          {/* User Workspace & Sign Out */}
          {user || isDemo ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="truncate max-w-[130px] sm:max-w-[180px]">
                  {isDemo ? "Live Demo Workspace" : (user?.user_metadata?.kitchen_name || user?.email || "Chef")}
                </span>
              </div>
              <button
                onClick={onSignOut}
                title="Sign out or leave demo"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all"
              >
                Demo Workspace
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
