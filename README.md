# 🍛 RasoiPulse — Kitchen Digital Twin & Decision Intelligence Copilot

> Real-time Kitchen Digital Twin & Decision Intelligence Copilot for small Indian restaurants, street-food vendors, cafes, and cloud kitchens.

[![Node.js](https://img.shields.io/badge/Node.js-20+-68a063.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth-3ecf8e.svg)](https://supabase.com)
[![Google Gen AI](https://img.shields.io/badge/Google%20Gen%20AI-gemini--2.5--flash-4285f4.svg)](https://ai.google.dev)

---

## 📌 Executive Summary & Problem Solved
Small food businesses operate on razor-thin **15–20% net operating margins** and lose **20–30% of their daily profit** to blind batch preparation:
- Over-prepping perishables on rainy days, month-end budget pinches, or fasting days leads to massive spoilage write-offs.
- Under-prepping high-margin items during cricket matches or delivery traffic spikes leads to lost revenue.
- Daily kitchen logs remain trapped in messy paper notebooks.

**RasoiPulse** solves this with an explainable, multi-factor "What-If" Demand & Prep Simulation Engine, Multimodal Vision AI register digitization, and autonomous execution plans (morning prep, evening Swiggy/WhatsApp flash sales, supplier drafts, and cook Hinglish briefings).

---

## 🚀 Key Features

1. **Supabase Auth & Demo Guest Bypass**: Secure email/password login plus one-click "Launch Live Demo Workspace" mode for zero-friction access.
2. **Multimodal Handwritten Register Scanner (`/api/scan-register`)**: Vision OCR powered by `@google/genai` (`gemini-2.5-flash`) with structured schema extracting items, prep, waste, and pricing directly into database records.
3. **Live Hyper-Local Weather Integration (`/api/weather`)**: Real-time temperature and precipitation from Open-Meteo API for Bengaluru with offline fallback.
4. **Multi-Factor Explainable Decision Engine (`/api/simulate`)**: Deterministic scoring across 7 real-world factors:
   - Yesterday's waste ratio (`>20% -> -15%`)
   - Hyper-local weather (Rain, Heat)
   - Major local events (IPL Cricket matches, Tech park holidays)
   - Day & salary cycle (Payday rush vs. Month-end budget)
   - Traffic gridlock (Swiggy/Zomato delivery surges)
   - Neighborhood & cultural signals (Fasting/Veg days, College exam caffeine surge, Competitor closed)
   - Kitchen clock hour (Evening 18:00+ perishable at-risk calculation)
5. **Interactive Dashboard**: Real-time KPI summary cards, Recharts comparative visualization, sortable table with visual Reason Tags.
6. **Autonomous Kitchen & Revenue Rescue Generator (`/api/generate-actions`)**: Synthesizes 4 actionable outputs with one-click clipboard copy and Web Speech API voice synthesis.
7. **Simulation History & Audit Log (`/history`)**: Chronological audit log of past runs and cumulative ₹ spoilage prevented.

---

## 🛠️ Tech Stack Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, Zod, `@supabase/supabase-js`.
- **Backend**: Node.js 20+, Express.js 4, `@google/genai` (official SDK), `@supabase/supabase-js`, Zod, Multer (in-memory 8MB max), Helmet, CORS, Dotenv.
- **Database**: Supabase PostgreSQL 15+ with UUIDs, JSONB columns, RLS policies, and automated timestamp triggers.
- **External Services**: Open-Meteo Weather API (zero API key required), Google Gemini 2.5 Flash.

---

## ⚙️ Project Structure

```
rasoipulse/
├── .gitignore
├── README.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── supabase/
│   │   └── schema.sql
│   └── src/
│       ├── index.js
│       ├── config/
│       │   └── supabaseClient.js
│       ├── data/
│       │   └── defaultMenu.js
│       ├── schemas/
│       │   └── validation.js
│       ├── services/
│       │   ├── weatherService.js
│       │   ├── decisionEngine.js
│       │   └── geminiService.js
│       └── routes/
│           └── api.js
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── lib/
        │   ├── api.js
        │   └── supabase.js
        ├── schemas/
        │   └── validation.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── RegisterScannerCard.jsx
        │   ├── ScenarioSimulatorSidebar.jsx
        │   ├── KpiSummaryRow.jsx
        │   ├── PrepComparisonChart.jsx
        │   ├── ExplainablePrepTable.jsx
        │   ├── AutonomousActionPanel.jsx
        │   └── MenuEditorModal.jsx
        └── pages/
            ├── LandingPage.jsx
            ├── AuthPage.jsx
            ├── DashboardPage.jsx
            ├── MenuPage.jsx
            └── HistoryPage.jsx
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js v20+ and npm installed.

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in GEMINI_API_KEY (optional, fallback provided), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
node src/index.js
```
The server will start at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Fill in VITE_API_URL=http://localhost:8000, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm run dev
```
The client will start at `http://localhost:5173`.

---

## 🌐 Production Deployment Guide

### Deploying Backend to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your repository.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
4. Set Environment Variables on Render:
   - `PORT`: `8000`
   - `GEMINI_API_KEY`: `<Your Google AI Studio Gemini API Key>`
   - `SUPABASE_URL`: `https://<your-project>.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<Your Supabase Service Role Secret>`
   - `ALLOWED_ORIGINS`: `https://<your-vercel-app>.vercel.app,http://localhost:5173`

### Deploying Frontend to Vercel
1. Import the repository on [Vercel](https://vercel.com).
2. Select **Vite** framework preset.
3. Set **Root Directory** to `frontend`.
4. Configure Build and Output Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Set Environment Variables on Vercel:
   - `VITE_API_URL`: `https://<your-render-backend-url>.onrender.com`
   - `VITE_SUPABASE_URL`: `https://<your-project>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<Your Supabase Anon Public Key>`

---

## 🔒 Security & Data Hygiene
- **Zero Client-Side Secret Leakage**: `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` reside exclusively in the backend runtime.
- **Strict Upload Limits**: Multer in-memory storage enforced at 8MB max for `image/jpeg`, `image/png`, and `image/webp`. Untrusted files are never written to disk.
- **Strict Schema Enforcement**: All incoming payloads and AI generation outputs are validated with runtime Zod schemas.
- **Row Level Security (RLS)**: PostgreSQL RLS prevents tenant data bleed between different kitchens.
