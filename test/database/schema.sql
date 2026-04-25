create extension if not exists vector;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role text not null check (role in ('editor', 'filmmaker', 'admin')),
  email text,
  phone text,
  country text,
  city text,
  timezone text,
  language text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists editors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  headline text,
  bio text,
  years_experience int default 0,
  hourly_rate numeric,
  project_rate_min numeric,
  project_rate_max numeric,
  availability_status text default 'available' check (availability_status in ('available', 'busy', 'unavailable')),
  verification_status text default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
  portfolio_summary text,
  previous_clients text[],
  profile_embedding vector(1536),
  profile_search_text text,
  rating_avg numeric default 0,
  rating_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists editor_specializations (
  id uuid primary key default gen_random_uuid(),
  editor_id uuid not null references editors(id) on delete cascade,
  specialization text not null
);

create table if not exists editor_genres (
  id uuid primary key default gen_random_uuid(),
  editor_id uuid not null references editors(id) on delete cascade,
  genre text not null
);

create table if not exists editor_software (
  id uuid primary key default gen_random_uuid(),
  editor_id uuid not null references editors(id) on delete cascade,
  software text not null,
  proficiency text default 'intermediate' check (proficiency in ('beginner', 'intermediate', 'advanced', 'expert'))
);

create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  editor_id uuid not null references editors(id) on delete cascade,
  title text not null,
  description text,
  project_type text,
  genre text,
  video_url text,
  thumbnail_url text,
  role_in_project text,
  tools_used text[],
  year_completed int,
  is_featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists filmmakers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  company_name text,
  bio text,
  website_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  filmmaker_id uuid not null references filmmakers(id) on delete cascade,
  title text not null,
  description text not null,
  natural_language_query text not null,
  genre text,
  project_type text,
  budget_min numeric,
  budget_max numeric,
  deadline date,
  style_preferences text,
  reference_links text[],
  query_embedding vector(1536),
  status text default 'draft' check (status in ('draft', 'searching', 'shortlisting', 'hired', 'closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  editor_id uuid not null references editors(id) on delete cascade,
  semantic_score numeric,
  experience_score numeric,
  rating_score numeric,
  availability_score numeric,
  budget_score numeric,
  final_score numeric,
  match_reason text,
  created_at timestamptz default now(),
  unique(project_id, editor_id)
);

create table if not exists shortlists (
  id uuid primary key default gen_random_uuid(),
  filmmaker_id uuid not null references filmmakers(id) on delete cascade,
  editor_id uuid not null references editors(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  created_at timestamptz default now(),
  unique(filmmaker_id, editor_id, project_id)
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists editors_profile_embedding_idx
on editors using ivfflat (profile_embedding vector_cosine_ops)
with (lists = 100);

create or replace function match_editors(
  query_embedding vector(1536),
  match_count int default 20
)
returns table (
  editor_id uuid,
  user_id uuid,
  headline text,
  bio text,
  years_experience int,
  hourly_rate numeric,
  project_rate_min numeric,
  project_rate_max numeric,
  availability_status text,
  verification_status text,
  rating_avg numeric,
  rating_count int,
  profile_search_text text,
  semantic_score double precision
)
language sql stable
as $$
  select
    e.id as editor_id,
    e.user_id,
    e.headline,
    e.bio,
    e.years_experience,
    e.hourly_rate,
    e.project_rate_min,
    e.project_rate_max,
    e.availability_status,
    e.verification_status,
    e.rating_avg,
    e.rating_count,
    e.profile_search_text,
    1 - (e.profile_embedding <=> query_embedding) as semantic_score
  from editors e
  where e.profile_embedding is not null
    and e.verification_status = 'approved'
  order by e.profile_embedding <=> query_embedding
  limit match_count;
$$;

alter table profiles enable row level security;
alter table editors enable row level security;
alter table filmmakers enable row level security;
alter table projects enable row level security;
alter table portfolio_items enable row level security;
alter table shortlists enable row level security;

create policy "Users can read their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);

create policy "Approved editors are public" on editors for select using (verification_status = 'approved' or auth.uid() = user_id);
create policy "Editors can manage own row" on editors for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Portfolio is public for approved editors" on portfolio_items for select using (true);
create policy "Editors manage own portfolio" on portfolio_items for all using (
  exists (select 1 from editors where editors.id = portfolio_items.editor_id and editors.user_id = auth.uid())
) with check (
  exists (select 1 from editors where editors.id = portfolio_items.editor_id and editors.user_id = auth.uid())
);

create policy "Filmmakers manage own row" on filmmakers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Filmmakers manage own projects" on projects for all using (
  exists (select 1 from filmmakers where filmmakers.id = projects.filmmaker_id and filmmakers.user_id = auth.uid())
) with check (
  exists (select 1 from filmmakers where filmmakers.id = projects.filmmaker_id and filmmakers.user_id = auth.uid())
);
