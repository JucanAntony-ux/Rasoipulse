import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flame, Mail, Lock, Building, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured, DEMO_USER } from "../lib/supabase";

export default function AuthPage({ onLoginSuccess, onEnterDemo }) {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kitchenName, setKitchenName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    if (!isSupabaseConfigured) {
      // In demo mode when Supabase credentials are not wired, simulate instant login
      const mockUser = {
        id: "demo-user-" + Date.now(),
        email: email || "chef@rasoipulse.in",
        user_metadata: {
          kitchen_name: kitchenName || "Bengaluru Express Kitchen"
        }
      };
      onLoginSuccess(mockUser);
      navigate("/dashboard");
      return;
    }

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              kitchen_name: kitchenName || "My Cloud Kitchen"
            }
          }
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          onLoginSuccess(data.user);
          navigate("/dashboard");
        } else {
          setInfoMessage("Registration successful! Check your email to confirm your account.");
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;

        if (data.user) {
          onLoginSuccess(data.user);
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchDemo = () => {
    if (onEnterDemo) {
      onEnterDemo();
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
              RasoiPulse
            </span>
          </Link>
          <p className="text-xs text-slate-400">
            {isSignUp ? "Register your restaurant or cloud kitchen" : "Sign in to your kitchen dashboard"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel-elevated rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-5">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(null); setInfoMessage(null); }}
              className={`py-2 rounded-lg transition-colors ${
                !isSignUp ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(null); setInfoMessage(null); }}
              className={`py-2 rounded-lg transition-colors ${
                isSignUp ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              {infoMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-orange-400" />
                  Kitchen / Restaurant Name
                </label>
                <input
                  type="text"
                  required
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  placeholder="e.g. Swad Sagar Cafe"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@kitchen.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  {isSignUp ? "Create Kitchen Account" : "Sign In to RasoiPulse"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest Demo Bypass */}
          <div className="pt-2 border-t border-slate-800 text-center space-y-3">
            <p className="text-[11px] text-slate-500">
              Evaluating or testing without sign-up?
            </p>
            <button
              type="button"
              onClick={handleLaunchDemo}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Live Demo Workspace (Instant Bypass)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
