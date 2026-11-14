import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase, isSupabaseConfigured, DEMO_USER } from "./lib/supabase";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import MenuPage from "./pages/MenuPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [isDemo, setIsDemo] = useState(true); // Default to live demo mode so app is instantly ready
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check for Supabase session if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setIsDemo(false);
        }
        setInitializing(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUser(session.user);
            setIsDemo(false);
          } else {
            setUser(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Local fallback without Supabase credentials: default to Demo user
      setUser(DEMO_USER);
      setIsDemo(true);
      setInitializing(false);
    }
  }, []);

  const handleLoginSuccess = (authUser) => {
    setUser(authUser);
    setIsDemo(false);
  };

  const handleEnterDemo = () => {
    setUser(DEMO_USER);
    setIsDemo(true);
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    // Revert to Demo Guest workspace
    setUser(DEMO_USER);
    setIsDemo(true);
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
          <p className="text-xs font-semibold tracking-wider uppercase text-orange-400">
            Initializing RasoiPulse...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <Navbar
          user={user}
          isDemo={isDemo}
          onSignOut={handleSignOut}
        />

        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  onEnterDemo={handleEnterDemo}
                />
              }
            />
            <Route
              path="/auth"
              element={
                <AuthPage
                  onLoginSuccess={handleLoginSuccess}
                  onEnterDemo={handleEnterDemo}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  user={user}
                  isDemo={isDemo}
                />
              }
            />
            <Route
              path="/menu"
              element={
                <MenuPage
                  user={user}
                  isDemo={isDemo}
                />
              }
            />
            <Route
              path="/history"
              element={
                <HistoryPage
                  user={user}
                  isDemo={isDemo}
                />
              }
            />
            {/* Catch-all redirect to /dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
