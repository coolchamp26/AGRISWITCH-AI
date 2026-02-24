-- ============================================
-- AgriSwitch AI — Supabase Database Schema
-- ============================================
-- Run this in the Supabase SQL editor to create all required tables.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Farm Profiles
CREATE TABLE IF NOT EXISTS public.farm_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  land_size_acres NUMERIC NOT NULL,
  state TEXT NOT NULL,
  crop_type TEXT NOT NULL DEFAULT 'Paddy',
  machinery_access BOOLEAN DEFAULT FALSE,
  labor_cost_per_acre NUMERIC NOT NULL DEFAULT 500,
  diesel_price NUMERIC NOT NULL DEFAULT 95,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simulation Results
CREATE TABLE IF NOT EXISTS public.simulation_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  burn_cost NUMERIC NOT NULL,
  sustainable_cost NUMERIC NOT NULL,
  subsidy_amount NUMERIC NOT NULL,
  co2_burned NUMERIC NOT NULL,
  co2_saved NUMERIC NOT NULL,
  net_difference NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_results ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see/modify their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.farm_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own profiles" ON public.farm_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results" ON public.simulation_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own results" ON public.simulation_results
  FOR SELECT USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_farm_profiles_user_id ON public.farm_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_results_user_id ON public.simulation_results(user_id);
