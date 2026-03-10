ALTER TABLE public.maintenance_log
ADD COLUMN checklist jsonb DEFAULT '[]'::jsonb;
