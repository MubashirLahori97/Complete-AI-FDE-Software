-- ============================================================
-- FDE Academy — Supabase database setup
-- ============================================================
-- What this file does, in plain words:
--   It creates two tables in your Supabase database:
--     1. profiles        — one row per learner (their name)
--     2. mentor_progress — one row per learner (their XP, steps,
--                          finished days, badges, active dates)
--   It turns on Row Level Security (a lock that keeps learners
--   from seeing or changing each other's rows), adds the rules
--   ("policies") for that lock, and adds a trigger that
--   automatically creates the two rows whenever a new learner
--   signs up.
--
-- How to use this file: copy everything and paste it into the
-- Supabase dashboard SQL Editor, then press Run. It is safe to
-- run it more than once.
-- ============================================================


-- ------------------------------------------------------------
-- Table 1: profiles
-- One row per learner. Holds the name shown on the site.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  -- Matches the sign-up account in Supabase Auth. When the
  -- account is deleted, this row is deleted too (on delete cascade).
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- The name the learner typed on the site.
  display_name text,
  -- When the row was created. Defaults to the current time.
  created_at timestamptz DEFAULT now()
);


-- ------------------------------------------------------------
-- Table 2: mentor_progress
-- One row per learner. Holds their whole progress snapshot,
-- matching what the site used to keep in the browser only.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mentor_progress (
  -- Matches the sign-up account in Supabase Auth. When the
  -- account is deleted, this row is deleted too (on delete cascade).
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Total experience points earned.
  xp int DEFAULT 0,
  -- Current login streak (days in a row with activity).
  streak int DEFAULT 0,
  -- Level name earned from XP (Newcomer, Starter, Builder,
  -- Regular, Ustaad's Star). The app decides the level from XP;
  -- this column stores the last one shown.
  level text DEFAULT 'Newcomer',
  -- Badge ids the learner has earned, e.g. '{"first-step","day-1-done"}'.
  badges text[] DEFAULT '{}',
  -- Maps day "1".."30" to the highest step index finished on
  -- that day, e.g. '{"1": 11, "2": 7}'. Empty until they start.
  days jsonb DEFAULT '{}',
  -- Fully finished day numbers, e.g. '{1,2,3}'.
  days_complete int[] DEFAULT '{}',
  -- Dates (YYYY-MM-DD) with activity, drives the streak count.
  active_dates text[] DEFAULT '{}',
  -- When this row was last updated.
  updated_at timestamptz DEFAULT now()
);


-- ------------------------------------------------------------
-- Row Level Security (the lock on the tables)
-- ------------------------------------------------------------
-- Turning this on means: by default nobody can read or change
-- any row. The rules below then open exactly one door per
-- learner — they can read, add, and update ONLY their own row.
-- (Each rule is dropped first if it exists, so re-running this
-- file never errors out.)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_progress ENABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------
-- Rule: a signed-in learner can read their own profile row.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Learners can read their own profile" ON public.profiles;
CREATE POLICY "Learners can read their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- ------------------------------------------------------------
-- Rule: a signed-in learner can add their own profile row.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Learners can add their own profile" ON public.profiles;
CREATE POLICY "Learners can add their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- ------------------------------------------------------------
-- Rule: a signed-in learner can update their own profile row.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Learners can update their own profile" ON public.profiles;
CREATE POLICY "Learners can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ------------------------------------------------------------
-- Rule: a signed-in learner can read their own progress row.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Learners can read their own progress" ON public.mentor_progress;
CREATE POLICY "Learners can read their own progress"
  ON public.mentor_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ------------------------------------------------------------
-- Rule: a signed-in learner can add their own progress row.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Learners can add their own progress" ON public.mentor_progress;
CREATE POLICY "Learners can add their own progress"
  ON public.mentor_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ------------------------------------------------------------
-- Rule: a signed-in learner can update their own progress row.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Learners can update their own progress" ON public.mentor_progress;
CREATE POLICY "Learners can update their own progress"
  ON public.mentor_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- NOTE on deleting rows: there is deliberately no DELETE rule
-- here. Progress rows are never deleted by the app. If a learner
-- ever needs to be fully removed, delete their account in the
-- Supabase dashboard under Authentication -> Users — the rows in
-- both tables are deleted automatically because of the
-- "on delete cascade" set above. A service-level key (service_role)
-- can also do this, but that key must never be put in the website.


-- ------------------------------------------------------------
-- Automatic setup for new sign-ups
-- ------------------------------------------------------------
-- This small function runs right after a new learner signs up.
-- It creates their row in profiles and their row in
-- mentor_progress, so the app never has to check "does the row
-- exist yet?" — it always does.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create the profile row (uses their email name if no name given).
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  -- Create the empty progress row.
  INSERT INTO public.mentor_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop the trigger first if it already exists (makes re-running safe),
-- then attach it to sign-ups.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
