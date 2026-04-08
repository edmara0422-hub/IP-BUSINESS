-- Perfis de usuário (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  role text not null default 'student' check (role in ('admin', 'student')),
  created_at timestamptz default now()
);

-- Notas de estudo por usuário e sub-módulo
create table public.study_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  submodule_id text not null,
  content text default '',
  updated_at timestamptz default now(),
  unique(user_id, submodule_id)
);

-- Progresso de leitura por usuário e sub-módulo
create table public.study_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  submodule_id text not null,
  read boolean default false,
  read_at timestamptz default now(),
  unique(user_id, submodule_id)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.study_notes enable row level security;
alter table public.study_progress enable row level security;

-- Policies: cada usuário acessa só os próprios dados
create policy "profiles: own" on public.profiles
  for all using (auth.uid() = id);

create policy "study_notes: own" on public.study_notes
  for all using (auth.uid() = user_id);

create policy "study_progress: own" on public.study_progress
  for all using (auth.uid() = user_id);

-- Admin vê tudo
create policy "profiles: admin read all" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "study_notes: admin read all" on public.study_notes
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "study_progress: admin read all" on public.study_progress
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Perfil de workspace (onboarding)
create table public.workspace_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  type text not null check (type in ('pf', 'pj', 'unknown')),
  subtype text not null default '',
  sectors text[] not null default '{}',
  revenue text not null default '',
  product text[] not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.workspace_profiles enable row level security;

create policy "workspace_profiles: own" on public.workspace_profiles
  for all using (auth.uid() = user_id);

create policy "workspace_profiles: admin read all" on public.workspace_profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Auto-criar perfil ao registrar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
