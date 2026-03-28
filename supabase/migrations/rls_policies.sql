-- ─────────────────────────────────────────────────────────────────────────────
-- OBSIDIAN — Supabase Row Level Security policies
-- Run this in: Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Enable RLS on all tables ──────────────────────────────────────────────────
ALTER TABLE vehicles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;


-- ─────────────────────────────────────────────────────────────────────────────
-- VEHICLES
--   • Anyone (including anonymous) can read vehicles
--   • Only admins can insert / update / delete
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "vehicles_read_public"   ON vehicles;
DROP POLICY IF EXISTS "vehicles_write_admin"   ON vehicles;

CREATE POLICY "vehicles_read_public"
  ON vehicles FOR SELECT
  USING (true);

CREATE POLICY "vehicles_write_admin"
  ON vehicles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id   = auth.uid()
        AND profiles.role = 'admin'
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- RESERVATIONS
--   • A user can only read their own reservations
--   • A user can only insert reservations for themselves
--   • A user can update their own reservations (e.g. cancel)
--   • Admins can do everything
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "reservations_read_own"     ON reservations;
DROP POLICY IF EXISTS "reservations_insert_own"   ON reservations;
DROP POLICY IF EXISTS "reservations_update_own"   ON reservations;
DROP POLICY IF EXISTS "reservations_all_admin"    ON reservations;

CREATE POLICY "reservations_read_own"
  ON reservations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "reservations_insert_own"
  ON reservations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reservations_update_own"
  ON reservations FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "reservations_all_admin"
  ON reservations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id   = auth.uid()
        AND profiles.role = 'admin'
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- PROFILES
--   • A user can only read and update their own profile
--   • Admins can read all profiles (needed for reservation client display)
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_read_own"      ON profiles;
DROP POLICY IF EXISTS "profiles_update_own"    ON profiles;
DROP POLICY IF EXISTS "profiles_read_admin"    ON profiles;

CREATE POLICY "profiles_read_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles_read_admin"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS me
      WHERE me.id   = auth.uid()
        AND me.role = 'admin'
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- SERVICE ROLE (webhook)
-- The stripe-webhook.js uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS
-- automatically — no extra policy needed for it.
-- ─────────────────────────────────────────────────────────────────────────────
