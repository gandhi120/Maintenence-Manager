-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  name text not null default '',
  mobile_number text unique,
  avatar_url text,
  role text not null default 'owner' check (role in ('owner', 'manager', 'technician')),
  created_at timestamptz not null default now()
);

-- Projects table
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text not null,
  description text,
  color text not null default '#8B5CF6',
  owner_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Machines table
create table public.machines (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  type text not null default 'custom',
  serial_number text,
  image_url text,
  last_maintenance_date date,
  maintenance_cycle_days integer not null default 30,
  next_maintenance_date date,
  zone text,
  status text not null default 'active' check (status in ('active', 'inactive', 'under_repair')),
  created_at timestamptz not null default now()
);

-- Issues table
create table public.issues (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  machine_id uuid not null references public.machines(id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'assigned', 'in_progress', 'resolved')),
  image_urls text[] default '{}',
  reported_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Work Orders table
create table public.work_orders (
  id uuid primary key default uuid_generate_v4(),
  issue_id uuid not null unique references public.issues(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  assigned_to uuid references public.users(id),
  status text not null default 'open' check (status in ('open', 'assigned', 'in_progress', 'completed')),
  estimated_completion date,
  actual_completion date,
  notes text,
  created_at timestamptz not null default now()
);

-- Maintenance Log table
create table public.maintenance_log (
  id uuid primary key default uuid_generate_v4(),
  machine_id uuid not null references public.machines(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  maintenance_type text not null default 'routine' check (maintenance_type in ('routine', 'oil_change', 'repair', 'inspection', 'custom')),
  date date not null default current_date,
  technician_id uuid references public.users(id),
  notes text,
  created_at timestamptz not null default now()
);

-- Team Members table
create table public.team_members (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'technician' check (role in ('manager', 'technician')),
  added_at timestamptz not null default now(),
  unique(project_id, user_id)
);

-- Activity Log table
create table public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  issue_id uuid references public.issues(id) on delete set null,
  work_order_id uuid references public.work_orders(id) on delete set null,
  actor_id uuid references public.users(id),
  action text not null,
  description text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_machines_project on public.machines(project_id);
create index idx_issues_project on public.issues(project_id);
create index idx_issues_machine on public.issues(machine_id);
create index idx_issues_status on public.issues(status);
create index idx_work_orders_project on public.work_orders(project_id);
create index idx_work_orders_status on public.work_orders(status);
create index idx_maintenance_log_machine on public.maintenance_log(machine_id);
create index idx_activity_log_project on public.activity_log(project_id);
create index idx_team_members_project on public.team_members(project_id);

-- Trigger: auto-calculate next_maintenance_date
create or replace function calc_next_maintenance()
returns trigger as $$
begin
  if NEW.last_maintenance_date is not null then
    NEW.next_maintenance_date := NEW.last_maintenance_date + (NEW.maintenance_cycle_days || ' days')::interval;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_calc_maintenance
  before insert or update of last_maintenance_date, maintenance_cycle_days
  on public.machines
  for each row
  execute function calc_next_maintenance();

-- Trigger: work order completed -> issue resolved
create or replace function resolve_issue_on_wo_complete()
returns trigger as $$
begin
  if NEW.status = 'completed' and OLD.status != 'completed' then
    update public.issues set status = 'resolved', resolved_at = now() where id = NEW.issue_id;
    NEW.actual_completion := current_date;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_wo_complete
  before update of status
  on public.work_orders
  for each row
  execute function resolve_issue_on_wo_complete();

-- RLS policies
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.machines enable row level security;
alter table public.issues enable row level security;
alter table public.work_orders enable row level security;
alter table public.maintenance_log enable row level security;
alter table public.team_members enable row level security;
alter table public.activity_log enable row level security;

-- Basic RLS: users can see their own data
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users for insert with check (auth.uid() = id);

-- Projects: owner or team member can access
create policy "Project access" on public.projects for all using (
  owner_id = auth.uid() or
  id in (select project_id from public.team_members where user_id = auth.uid())
);

-- Machines: project access required
create policy "Machine access" on public.machines for all using (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
    union
    select project_id from public.team_members where user_id = auth.uid()
  )
);

-- Issues: project access required
create policy "Issue access" on public.issues for all using (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
    union
    select project_id from public.team_members where user_id = auth.uid()
  )
);

-- Work Orders: project access required
create policy "Work order access" on public.work_orders for all using (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
    union
    select project_id from public.team_members where user_id = auth.uid()
  )
);

-- Maintenance Log: project access required
create policy "Maintenance log access" on public.maintenance_log for all using (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
    union
    select project_id from public.team_members where user_id = auth.uid()
  )
);

-- Team Members: project access required
create policy "Team member access" on public.team_members for all using (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
    union
    select project_id from public.team_members where user_id = auth.uid()
  )
);

-- Activity Log: project access required
create policy "Activity log access" on public.activity_log for all using (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
    union
    select project_id from public.team_members where user_id = auth.uid()
  )
);
