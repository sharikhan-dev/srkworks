-- =====================================================================
-- ADMIN PUSH NOTIFICATIONS MIGRATION
-- Run this in Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to run multiple times (idempotent)
-- =====================================================================

-- 1. Track notification dispatch status on contact_messages to avoid duplicate pushes
ALTER TABLE contact_messages 
  ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMP WITH TIME ZONE;

-- 2. Create admin_push_subscriptions table
CREATE TABLE IF NOT EXISTS admin_push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by user and endpoint
CREATE INDEX IF NOT EXISTS idx_admin_push_user_id ON admin_push_subscriptions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_push_endpoint ON admin_push_subscriptions(endpoint);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE admin_push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Clean slate for policies
DROP POLICY IF EXISTS "Admin manage own push subscriptions" ON admin_push_subscriptions;
DROP POLICY IF EXISTS "Public full access admin_push_subscriptions" ON admin_push_subscriptions;
DROP POLICY IF EXISTS "Service role full access push subscriptions" ON admin_push_subscriptions;

-- Policy: Only authenticated admin users can select, insert, update, or delete their OWN push subscriptions
CREATE POLICY "Admin manage own push subscriptions"
  ON admin_push_subscriptions
  FOR ALL
  TO authenticated
  USING (auth.uid() = admin_user_id)
  WITH CHECK (auth.uid() = admin_user_id);

-- Ensure anon / public has ZERO access to admin_push_subscriptions
REVOKE ALL ON admin_push_subscriptions FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_push_subscriptions TO authenticated;
GRANT ALL ON admin_push_subscriptions TO service_role;

-- 4. Secure RPC function: Save / upsert admin push subscription
CREATE OR REPLACE FUNCTION save_admin_push_subscription(
  p_endpoint TEXT,
  p_p256dh TEXT,
  p_auth TEXT,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_sub_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Only authenticated admins can register push subscriptions';
  END IF;

  INSERT INTO admin_push_subscriptions (
    admin_user_id,
    endpoint,
    p256dh,
    auth,
    user_agent,
    updated_at
  )
  VALUES (
    v_user_id,
    p_endpoint,
    p_p256dh,
    p_auth,
    p_user_agent,
    timezone('utc'::text, now())
  )
  ON CONFLICT (endpoint)
  DO UPDATE SET
    admin_user_id = EXCLUDED.admin_user_id,
    p256dh = EXCLUDED.p256dh,
    auth = EXCLUDED.auth,
    user_agent = EXCLUDED.user_agent,
    updated_at = timezone('utc'::text, now())
  RETURNING id INTO v_sub_id;

  RETURN jsonb_build_object('success', true, 'id', v_sub_id);
END;
$$;

-- Protect the RPC function
REVOKE EXECUTE ON FUNCTION save_admin_push_subscription FROM public, anon;
GRANT EXECUTE ON FUNCTION save_admin_push_subscription TO authenticated;

-- 5. Secure RPC function: Delete push subscription (e.g., when disabling notifications)
CREATE OR REPLACE FUNCTION delete_admin_push_subscription(p_endpoint TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  DELETE FROM admin_push_subscriptions
  WHERE endpoint = p_endpoint AND admin_user_id = v_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Protect delete RPC function
REVOKE EXECUTE ON FUNCTION delete_admin_push_subscription FROM public, anon;
GRANT EXECUTE ON FUNCTION delete_admin_push_subscription TO authenticated;
