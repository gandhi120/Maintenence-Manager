-- Fix infinite recursion in RLS policies.
--
-- The "projects" policy queries team_members, whose policy queries projects
-- again, causing an infinite loop.  A SECURITY DEFINER function breaks the
-- cycle because RLS is not enforced inside it.

-- 1. Helper: return every project_id the current user may access.
CREATE OR REPLACE FUNCTION public.get_user_project_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.projects WHERE owner_id = auth.uid()
  UNION
  SELECT project_id FROM public.team_members WHERE user_id = auth.uid()
$$;

-- 2. Drop all affected policies (from 001 and 002).
DROP POLICY IF EXISTS "Project access"             ON public.projects;
DROP POLICY IF EXISTS "Machine access"             ON public.machines;
DROP POLICY IF EXISTS "Issue access"               ON public.issues;
DROP POLICY IF EXISTS "Maintenance log access"     ON public.maintenance_log;
DROP POLICY IF EXISTS "Team member access"         ON public.team_members;
DROP POLICY IF EXISTS "Activity log access"        ON public.activity_log;
DROP POLICY IF EXISTS "Work order read access"     ON public.work_orders;
DROP POLICY IF EXISTS "Work order insert access"   ON public.work_orders;
DROP POLICY IF EXISTS "Work order update access"   ON public.work_orders;
DROP POLICY IF EXISTS "Work order delete access"   ON public.work_orders;
-- 3. Recreate policies using the helper function.

-- Projects: split into read/modify vs insert
-- NOTE: SELECT uses a direct check instead of get_user_project_ids() because
-- the STABLE function caches results within a statement, which breaks
-- INSERT...RETURNING (the new row's ID isn't in the cached result).
CREATE POLICY "Project read access" ON public.projects FOR SELECT USING (
  owner_id = auth.uid()
  OR id IN (SELECT project_id FROM public.team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Project insert access" ON public.projects FOR INSERT WITH CHECK (
  owner_id = auth.uid()
);

CREATE POLICY "Project update access" ON public.projects FOR UPDATE USING (
  id IN (SELECT get_user_project_ids())
);

CREATE POLICY "Project delete access" ON public.projects FOR DELETE USING (
  owner_id = auth.uid()
);

-- Machines
CREATE POLICY "Machine access" ON public.machines FOR ALL USING (
  project_id IN (SELECT get_user_project_ids())
);

-- Issues
CREATE POLICY "Issue access" ON public.issues FOR ALL USING (
  project_id IN (SELECT get_user_project_ids())
);

-- Maintenance log
CREATE POLICY "Maintenance log access" ON public.maintenance_log FOR ALL USING (
  project_id IN (SELECT get_user_project_ids())
);

-- Team members
CREATE POLICY "Team member access" ON public.team_members FOR ALL USING (
  project_id IN (SELECT get_user_project_ids())
);

-- Activity log
CREATE POLICY "Activity log access" ON public.activity_log FOR ALL USING (
  project_id IN (SELECT get_user_project_ids())
);

-- Work orders (split by operation, matching 002 intent)
CREATE POLICY "Work order read access" ON public.work_orders FOR SELECT USING (
  project_id IN (SELECT get_user_project_ids())
);

CREATE POLICY "Work order insert access" ON public.work_orders FOR INSERT WITH CHECK (
  project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
);

CREATE POLICY "Work order update access" ON public.work_orders FOR UPDATE USING (
  project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
  OR assigned_to = auth.uid()
);

CREATE POLICY "Work order delete access" ON public.work_orders FOR DELETE USING (
  project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
);

