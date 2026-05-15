-- Production readiness migration for SA AI Agent Marketplace
-- Run this in the Supabase SQL Editor before going live

-- ============================================================
-- 1. stripe_events — idempotent webhook processing
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stripe_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'processing'
    CHECK (processing_status IN ('processing', 'completed', 'failed')),
  error_message TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stripe_events_service_only" ON public.stripe_events
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 2. subscriptions — canonical billing state
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'trialing', 'unpaid')),
  plan TEXT NOT NULL DEFAULT 'starter',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
  ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON public.subscriptions(status);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "subscriptions_self_select" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Service role can do everything
CREATE POLICY "subscriptions_service_all" ON public.subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 3. agent_runs — usage metering
-- ============================================================
CREATE TABLE IF NOT EXISTS public.agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  agent_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'running', 'succeeded', 'failed')),
  tokens_used INTEGER DEFAULT 0,
  latency_ms INTEGER,
  mode TEXT DEFAULT 'demo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_user_month
  ON public.agent_runs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent
  ON public.agent_runs(agent_id);

ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;

-- Users can read their own runs
CREATE POLICY "agent_runs_self_select" ON public.agent_runs
  FOR SELECT USING (user_id = auth.uid());

-- Service role can do everything
CREATE POLICY "agent_runs_service_all" ON public.agent_runs
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 4. Ensure profiles has required columns
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'plan') THEN
    ALTER TABLE public.profiles ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
    ALTER TABLE public.profiles ADD COLUMN stripe_customer_id TEXT;
  END IF;
END $$;

-- ============================================================
-- 5. Ensure waitlist table exists
-- ============================================================
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  branch TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waitlist_service_only" ON public.waitlist
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 6. Monthly usage helper function
-- ============================================================
CREATE OR REPLACE FUNCTION public.monthly_agent_usage(p_user_id UUID)
RETURNS TABLE(request_count BIGINT, tokens_used BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*) AS request_count,
    COALESCE(SUM(ar.tokens_used), 0) AS tokens_used
  FROM public.agent_runs ar
  WHERE ar.user_id = p_user_id
    AND ar.created_at >= date_trunc('month', NOW())
    AND ar.status IN ('queued', 'running', 'succeeded');
$$;
