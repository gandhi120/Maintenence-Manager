-- v3 Schema Migration: Role system, notifications, work order notes

-- 1. Add notifications table
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null default '',
  reference_type text, -- 'work_order', 'issue', 'project'
  reference_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Add work_order_notes table
create table public.work_order_notes (
  id uuid primary key default uuid_generate_v4(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- 3. Add assigned_by column to work_orders
alter table public.work_orders add column if not exists assigned_by uuid references public.users(id);

-- 4. Add last_active_at column to users
alter table public.users add column if not exists last_active_at timestamptz;

-- 5. Update users.role CHECK: rename 'owner' to 'manager'
-- First drop the existing check constraint
alter table public.users drop constraint if exists users_role_check;
-- Update existing 'owner' rows to 'manager'
update public.users set role = 'manager' where role = 'owner';
-- Add new check constraint
alter table public.users add constraint users_role_check check (role in ('manager', 'technician'));

-- 6. Indexes
create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id, is_read) where is_read = false;
create index idx_work_order_notes_wo on public.work_order_notes(work_order_id);

-- 7. RLS on notifications
alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can update own notifications"
  on public.notifications for update
  using (user_id = auth.uid());

create policy "Authenticated users can insert notifications"
  on public.notifications for insert
  with check (true);

-- 8. RLS on work_order_notes
alter table public.work_order_notes enable row level security;

-- Read: anyone with project access can read notes
create policy "Work order notes read access"
  on public.work_order_notes for select
  using (
    work_order_id in (
      select wo.id from public.work_orders wo
      where wo.project_id in (
        select id from public.projects where owner_id = auth.uid()
        union
        select project_id from public.team_members where user_id = auth.uid()
      )
    )
  );

-- Insert: only the author can insert their own notes
create policy "Work order notes insert access"
  on public.work_order_notes for insert
  with check (author_id = auth.uid());

-- 9. Refined RLS for work_orders UPDATE: technicians can only update their assigned WOs
-- Drop existing policy and create separate ones for different operations
drop policy if exists "Work order access" on public.work_orders;

create policy "Work order read access"
  on public.work_orders for select
  using (
    project_id in (
      select id from public.projects where owner_id = auth.uid()
      union
      select project_id from public.team_members where user_id = auth.uid()
    )
  );

create policy "Work order insert access"
  on public.work_orders for insert
  with check (
    project_id in (
      select id from public.projects where owner_id = auth.uid()
    )
  );

create policy "Work order update access"
  on public.work_orders for update
  using (
    project_id in (
      select id from public.projects where owner_id = auth.uid()
    )
    or assigned_to = auth.uid()
  );

create policy "Work order delete access"
  on public.work_orders for delete
  using (
    project_id in (
      select id from public.projects where owner_id = auth.uid()
    )
  );

-- 10. Allow users to read other users (needed for team member display, assignee names)
create policy "Users can read all users" on public.users for select using (true);
-- Drop the restrictive self-only read policy if it causes issues
drop policy if exists "Users can view own profile" on public.users;
