-- ==============================================================================
-- 001_initial_schema.sql
-- RasoiPulse Supabase Database Schema & RLS Policies
-- Kitchen Digital Twin & Decision Intelligence Platform
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Kitchen Profiles (Optional metadata linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.kitchen_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    kitchen_name TEXT NOT NULL DEFAULT 'Bengaluru Cloud Kitchen',
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Menu Items & Baseline Prep Master
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('hot_snack', 'hot_drink', 'cold_drink', 'meal')),
    base_prep INTEGER NOT NULL CHECK (base_prep >= 1),
    wasted_yesterday INTEGER NOT NULL DEFAULT 0 CHECK (wasted_yesterday >= 0),
    cost_price INTEGER NOT NULL CHECK (cost_price >= 1),
    sell_price INTEGER NOT NULL CHECK (sell_price >= 1),
    is_perishable BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Simulation & AI Action Execution Logs
CREATE TABLE IF NOT EXISTS public.simulation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scenario_inputs JSONB NOT NULL,
    projected_savings_inr INTEGER NOT NULL DEFAULT 0,
    flash_sale_recovery_inr INTEGER NOT NULL DEFAULT 0,
    action_plan_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_menu_items_user_id ON public.menu_items(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_logs_user_id ON public.simulation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_logs_created_at ON public.simulation_logs(created_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER trg_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed Public Demo Menu Items (user_id IS NULL represents shared demo workspace items)
INSERT INTO public.menu_items (user_id, item_name, category, base_prep, wasted_yesterday, cost_price, sell_price, is_perishable)
VALUES
    (NULL, 'Paneer Tikka Roll', 'hot_snack', 60, 14, 55, 130, TRUE),
    (NULL, 'Masala Chai (Flasks)', 'hot_drink', 80, 10, 12, 35, TRUE),
    (NULL, 'Samosa & Pakora Plate', 'hot_snack', 70, 18, 18, 50, TRUE),
    (NULL, 'Cold Coffee', 'cold_drink', 50, 16, 35, 110, TRUE),
    (NULL, 'Fresh Lime Soda', 'cold_drink', 45, 5, 15, 60, FALSE),
    (NULL, 'Chicken Biryani Box', 'meal', 55, 12, 85, 190, TRUE)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- Row Level Security (RLS) / Data Isolation Rules
-- ==============================================================================
ALTER TABLE public.kitchen_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_logs ENABLE ROW LEVEL SECURITY;

-- Kitchen Profiles: Users manage only their own profile
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'kitchen_profiles' AND policyname = 'Users manage own kitchen profile'
    ) THEN
        CREATE POLICY "Users manage own kitchen profile"
        ON public.kitchen_profiles FOR ALL
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Menu Items: Users read public demo items (user_id IS NULL) OR their own items; users write only their own items
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'menu_items' AND policyname = 'Read demo or own menu items'
    ) THEN
        CREATE POLICY "Read demo or own menu items"
        ON public.menu_items FOR SELECT
        USING (user_id IS NULL OR auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'menu_items' AND policyname = 'Insert own menu items'
    ) THEN
        CREATE POLICY "Insert own menu items"
        ON public.menu_items FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'menu_items' AND policyname = 'Update own menu items'
    ) THEN
        CREATE POLICY "Update own menu items"
        ON public.menu_items FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'menu_items' AND policyname = 'Delete own menu items'
    ) THEN
        CREATE POLICY "Delete own menu items"
        ON public.menu_items FOR DELETE
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Simulation Logs: Read demo or own logs; insert own logs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'simulation_logs' AND policyname = 'Read demo or own simulation logs'
    ) THEN
        CREATE POLICY "Read demo or own simulation logs"
        ON public.simulation_logs FOR SELECT
        USING (user_id IS NULL OR auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'simulation_logs' AND policyname = 'Insert own simulation logs'
    ) THEN
        CREATE POLICY "Insert own simulation logs"
        ON public.simulation_logs FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
