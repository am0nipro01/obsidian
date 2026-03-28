-- ─────────────────────────────────────────────────────────────────────────────
-- OBSIDIAN — Vehicle availability sync trigger
-- Run this in: Supabase Dashboard → SQL Editor
--
-- Replaces the client-side syncVehicleAvailability() logic.
-- The DB handles it automatically on every reservation change.
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Helper function ───────────────────────────────────────────────────────────
-- Checks if a vehicle has any paid reservation and updates its availability.

CREATE OR REPLACE FUNCTION sync_vehicle_availability(p_vehicle_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE vehicles
  SET available = NOT EXISTS (
    SELECT 1 FROM reservations
    WHERE vehicle_id = p_vehicle_id
      AND status = 'paid'
  )
  WHERE id = p_vehicle_id;
END;
$$;


-- ── Trigger function ──────────────────────────────────────────────────────────
-- Fires after INSERT, UPDATE, or DELETE on reservations.

CREATE OR REPLACE FUNCTION trigger_sync_vehicle_availability()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM sync_vehicle_availability(OLD.vehicle_id);
  ELSE
    PERFORM sync_vehicle_availability(NEW.vehicle_id);
    -- If vehicle_id changed (edge case), also sync the old one
    IF TG_OP = 'UPDATE' AND OLD.vehicle_id IS DISTINCT FROM NEW.vehicle_id THEN
      PERFORM sync_vehicle_availability(OLD.vehicle_id);
    END IF;
  END IF;
  RETURN NULL;
END;
$$;


-- ── Attach trigger ────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_sync_vehicle_availability ON reservations;

CREATE TRIGGER trg_sync_vehicle_availability
  AFTER INSERT OR UPDATE OF status, vehicle_id OR DELETE
  ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_sync_vehicle_availability();
