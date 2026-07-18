create extension if not exists pgcrypto with schema extensions;

create type public.user_role as enum ('worker', 'farmer', 'admin');
create type public.account_status as enum ('pending', 'active', 'suspended');
create type public.registration_status as enum ('pending', 'approved', 'rejected');
create type public.campaign_status as enum ('draft', 'pending_review', 'published', 'closed', 'rejected', 'cancelled');
create type public.application_status as enum ('pending', 'accepted', 'rejected', 'withdrawn');
create type public.assignment_status as enum ('active', 'completed', 'cancelled');
create type public.rating_status as enum ('pending', 'approved', 'rejected');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type public.report_type as enum ('no_payment', 'abuse', 'theft', 'unsafe_conditions', 'fraud', 'other');
create type public.work_type as enum ('harvest', 'maintenance', 'postharvest', 'mixed');
create type public.payment_mode as enum ('per_day', 'per_week', 'per_unit');

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  province text not null default 'Jaén',
  district text not null,
  slug text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (province, district)
);

create table public.registration_requests (
  id uuid primary key default gen_random_uuid(),
  requested_role public.user_role not null check (requested_role <> 'admin'),
  full_name text not null check (char_length(full_name) between 3 and 120),
  phone text not null check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  email text,
  location_id uuid references public.locations(id),
  note text check (note is null or char_length(note) <= 500),
  status public.registration_status not null default 'pending',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  internal_note text check (internal_note is null or char_length(internal_note) <= 1000),
  created_user_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index registration_requests_pending_phone_idx
  on public.registration_requests(phone)
  where status = 'pending';

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  status public.account_status not null default 'pending',
  must_change_password boolean not null default true,
  full_name text not null check (char_length(full_name) between 3 and 120),
  email text,
  location_id uuid references public.locations(id),
  bio text check (bio is null or char_length(bio) <= 500),
  experience_level text check (experience_level is null or experience_level in ('less_than_1', '1_to_3', '3_plus')),
  crops text[] not null default array['coffee']::text[],
  available_from date,
  availability_type text check (availability_type is null or availability_type in ('current_campaign', 'rotating_campaigns', 'occasional')),
  payment_preference public.payment_mode,
  accepts_lodging boolean,
  operation_zone text,
  cooperative_name text,
  completed_campaigns integer not null default 0 check (completed_campaigns >= 0),
  rating_average numeric(3,2) not null default 0 check (rating_average between 0 and 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.farms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  description text check (description is null or char_length(description) <= 1000),
  location_id uuid not null references public.locations(id),
  location_reference text not null check (char_length(location_reference) between 5 and 300),
  main_crop text not null default 'coffee' check (main_crop = 'coffee'),
  area_hectares numeric(8,2) check (area_hectares is null or area_hectares > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  slug text not null unique,
  title text not null check (char_length(title) between 5 and 120),
  description text not null check (char_length(description) between 20 and 2000),
  location_id uuid not null references public.locations(id),
  start_date date not null,
  end_date date not null,
  workers_needed integer not null check (workers_needed between 1 and 500),
  work_type public.work_type not null,
  payment_mode public.payment_mode not null,
  payment_amount numeric(10,2) not null check (payment_amount > 0),
  payment_unit_label text check (payment_unit_label is null or char_length(payment_unit_label) <= 80),
  includes_food boolean not null default false,
  includes_lodging boolean not null default false,
  transport_provided boolean not null default false,
  safety_note text not null check (char_length(safety_note) between 10 and 1000),
  status public.campaign_status not null default 'draft',
  moderation_note text check (moderation_note is null or char_length(moderation_note) <= 1000),
  published_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  message text check (message is null or char_length(message) <= 500),
  status public.application_status not null default 'pending',
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, worker_id)
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  status public.assignment_status not null default 'active',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (campaign_id, worker_id)
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  rater_id uuid not null references public.profiles(id) on delete cascade,
  rated_user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 500),
  status public.rating_status not null default 'pending',
  moderated_by uuid references auth.users(id),
  moderated_at timestamptz,
  created_at timestamptz not null default now(),
  unique (assignment_id, rater_id),
  check (rater_id <> rated_user_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  type public.report_type not null,
  description text not null check (char_length(description) between 20 and 2000),
  evidence_path text,
  status public.report_status not null default 'open',
  assigned_to uuid references auth.users(id),
  resolution_note text check (resolution_note is null or char_length(resolution_note) <= 2000),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (reported_user_id is not null or campaign_id is not null)
);

create table public.moderation_events (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references auth.users(id),
  entity_type text not null check (entity_type in ('registration_request', 'profile', 'campaign', 'rating', 'report', 'location')),
  entity_id uuid not null,
  action text not null,
  note text check (note is null or char_length(note) <= 2000),
  created_at timestamptz not null default now()
);

create table public.contact_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete cascade,
  channel text not null default 'whatsapp' check (channel = 'whatsapp'),
  created_at timestamptz not null default now()
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in ('registration_requested', 'campaign_submitted', 'campaign_published', 'application_created', 'application_accepted', 'campaign_completed', 'report_created', 'whatsapp_opened')),
  actor_id uuid references public.profiles(id) on delete set null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index campaigns_public_filters_idx on public.campaigns(status, location_id, start_date);
create index campaigns_work_payment_idx on public.campaigns(work_type, payment_mode, includes_lodging);
create index applications_campaign_status_idx on public.applications(campaign_id, status);
create index applications_worker_created_idx on public.applications(worker_id, created_at desc);
create index reports_status_created_idx on public.reports(status, created_at);
create index moderation_events_entity_idx on public.moderation_events(entity_type, entity_id, created_at desc);
create index analytics_events_name_created_idx on public.analytics_events(event_name, created_at desc);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

create or replace function private.owns_farm(target_farm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.farms
    where id = target_farm_id and owner_id = auth.uid()
  );
$$;

create or replace function private.owns_campaign(target_campaign_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.campaigns c
    join public.farms f on f.id = c.farm_id
    where c.id = target_campaign_id and f.owner_id = auth.uid()
  );
$$;

revoke all on all functions in schema private from public, anon;
grant execute on all functions in schema private to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.role() <> 'service_role' and not private.is_admin() then
    new.role := old.role;
    new.status := old.status;
    new.must_change_password := old.must_change_password;
    new.completed_campaigns := old.completed_campaigns;
    new.rating_average := old.rating_average;
    new.rating_count := old.rating_count;
  end if;
  return new;
end;
$$;

create or replace function public.protect_campaign_moderation_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.role() <> 'service_role' and not private.is_admin() then
    new.moderation_note := old.moderation_note;
    new.published_at := old.published_at;
    if new.status <> old.status and not (
      (old.status in ('draft', 'rejected') and new.status = 'pending_review')
      or (old.status = 'published' and new.status in ('closed', 'cancelled'))
    ) then
      raise exception 'Ese cambio de estado requiere moderación';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.validate_rating_participants()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  assignment_row public.assignments%rowtype;
  owner_user_id uuid;
begin
  select * into assignment_row from public.assignments where id = new.assignment_id;
  if assignment_row.status <> 'completed' then
    raise exception 'La asignación debe estar completada para calificar';
  end if;

  select f.owner_id into owner_user_id
  from public.campaigns c join public.farms f on f.id = c.farm_id
  where c.id = assignment_row.campaign_id;

  if new.campaign_id <> assignment_row.campaign_id then
    raise exception 'La campaña no coincide con la asignación';
  end if;

  if not (
    (new.rater_id = assignment_row.worker_id and new.rated_user_id = owner_user_id)
    or
    (new.rater_id = owner_user_id and new.rated_user_id = assignment_row.worker_id)
  ) then
    raise exception 'Solo los participantes pueden calificarse';
  end if;
  return new;
end;
$$;

create trigger locations_updated_at before update on public.locations
for each row execute function public.set_updated_at();
create trigger registration_requests_updated_at before update on public.registration_requests
for each row execute function public.set_updated_at();
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger profiles_protect_fields before update on public.profiles
for each row execute function public.protect_profile_privileged_fields();
create trigger farms_updated_at before update on public.farms
for each row execute function public.set_updated_at();
create trigger campaigns_updated_at before update on public.campaigns
for each row execute function public.set_updated_at();
create trigger campaigns_protect_moderation before update on public.campaigns
for each row execute function public.protect_campaign_moderation_fields();
create trigger applications_updated_at before update on public.applications
for each row execute function public.set_updated_at();
create trigger reports_updated_at before update on public.reports
for each row execute function public.set_updated_at();
create trigger ratings_validate before insert or update on public.ratings
for each row execute function public.validate_rating_participants();

create or replace function public.accept_application(target_application_id uuid)
returns public.applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  app public.applications%rowtype;
  campaign_row public.campaigns%rowtype;
  accepted_count integer;
begin
  select * into app from public.applications where id = target_application_id for update;
  if app.id is null or not private.owns_campaign(app.campaign_id) then
    raise exception 'Postulación no disponible';
  end if;
  if app.status <> 'pending' then
    raise exception 'La postulación ya fue atendida';
  end if;

  select * into campaign_row from public.campaigns where id = app.campaign_id for update;
  if campaign_row.status <> 'published' then
    raise exception 'La campaña no está publicada';
  end if;

  select count(*) into accepted_count from public.applications
  where campaign_id = app.campaign_id and status = 'accepted';
  if accepted_count >= campaign_row.workers_needed then
    raise exception 'La campaña ya completó sus cupos';
  end if;

  update public.applications
  set status = 'accepted', decided_at = now()
  where id = target_application_id
  returning * into app;

  insert into public.assignments(campaign_id, worker_id, application_id)
  values (app.campaign_id, app.worker_id, app.id)
  on conflict (campaign_id, worker_id) do nothing;

  insert into public.analytics_events(event_name, actor_id, entity_id)
  values ('application_accepted', auth.uid(), app.id);
  return app;
end;
$$;

create or replace function public.reject_application(target_application_id uuid)
returns public.applications
language plpgsql
security definer
set search_path = ''
as $$
declare app public.applications%rowtype;
begin
  select * into app from public.applications where id = target_application_id for update;
  if app.id is null or not private.owns_campaign(app.campaign_id) or app.status <> 'pending' then
    raise exception 'Postulación no disponible';
  end if;
  update public.applications set status = 'rejected', decided_at = now()
  where id = target_application_id returning * into app;
  return app;
end;
$$;

create or replace function public.withdraw_application(target_application_id uuid)
returns public.applications
language plpgsql
security definer
set search_path = ''
as $$
declare app public.applications%rowtype;
begin
  update public.applications
  set status = 'withdrawn'
  where id = target_application_id and worker_id = auth.uid() and status = 'pending'
  returning * into app;
  if app.id is null then raise exception 'No se pudo retirar la postulación'; end if;
  return app;
end;
$$;

create or replace function public.complete_assignment(target_assignment_id uuid)
returns public.assignments
language plpgsql
security definer
set search_path = ''
as $$
declare assignment_row public.assignments%rowtype;
begin
  select * into assignment_row
  from public.assignments
  where id = target_assignment_id
  for update;
  if assignment_row.id is null or not private.owns_campaign(assignment_row.campaign_id) then
    raise exception 'Asignación no disponible';
  end if;
  if assignment_row.status <> 'active' then
    raise exception 'La asignación ya fue atendida';
  end if;

  update public.assignments
  set status = 'completed', completed_at = now()
  where id = target_assignment_id
  returning * into assignment_row;

  update public.profiles
  set completed_campaigns = completed_campaigns + 1
  where id = assignment_row.worker_id;

  insert into public.analytics_events(event_name, actor_id, entity_id)
  values ('campaign_completed', auth.uid(), assignment_row.id);
  return assignment_row;
end;
$$;

create or replace function public.refresh_profile_rating(target_profile_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles
  set rating_average = coalesce((
        select round(avg(score)::numeric, 2)
        from public.ratings
        where rated_user_id = target_profile_id and status = 'approved'
      ), 0),
      rating_count = (
        select count(*)
        from public.ratings
        where rated_user_id = target_profile_id and status = 'approved'
      )
  where id = target_profile_id;
$$;

create or replace function public.refresh_rating_after_moderation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare target_user_id uuid;
begin
  if tg_op = 'DELETE' then
    target_user_id := old.rated_user_id;
  else
    target_user_id := new.rated_user_id;
  end if;
  perform public.refresh_profile_rating(target_user_id);
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger ratings_refresh_profile after insert or update of status or delete on public.ratings
for each row execute function public.refresh_rating_after_moderation();

revoke execute on function public.accept_application(uuid) from public, anon;
revoke execute on function public.reject_application(uuid) from public, anon;
revoke execute on function public.withdraw_application(uuid) from public, anon;
revoke execute on function public.complete_assignment(uuid) from public, anon;
grant execute on function public.accept_application(uuid) to authenticated;
grant execute on function public.reject_application(uuid) to authenticated;
grant execute on function public.withdraw_application(uuid) to authenticated;
grant execute on function public.complete_assignment(uuid) to authenticated;
revoke execute on function public.refresh_profile_rating(uuid) from public, anon, authenticated;
revoke execute on function public.refresh_rating_after_moderation() from public, anon, authenticated;

alter table public.locations enable row level security;
alter table public.registration_requests enable row level security;
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.campaigns enable row level security;
alter table public.applications enable row level security;
alter table public.assignments enable row level security;
alter table public.ratings enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_events enable row level security;
alter table public.contact_events enable row level security;
alter table public.analytics_events enable row level security;

create policy locations_public_read on public.locations for select to anon, authenticated
using (is_active or (select private.is_admin()));
create policy locations_admin_write on public.locations for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy registration_admin_read on public.registration_requests for select to authenticated
using ((select private.is_admin()));
create policy registration_admin_update on public.registration_requests for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy profiles_self_or_admin_read on public.profiles for select to authenticated
using (id = auth.uid() or (select private.is_admin()));
create policy profiles_applicant_farmer_read on public.profiles for select to authenticated
using (exists (
  select 1 from public.applications a
  where a.worker_id = profiles.id
  and private.owns_campaign(a.campaign_id)
));
create policy profiles_self_update on public.profiles for update to authenticated
using (id = auth.uid() and status = 'active')
with check (id = auth.uid());
create policy profiles_admin_all on public.profiles for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy farms_public_read_published on public.farms for select to anon, authenticated
using (exists (select 1 from public.campaigns c where c.farm_id = farms.id and c.status = 'published'));
create policy farms_owner_read on public.farms for select to authenticated
using (owner_id = auth.uid() or (select private.is_admin()));
create policy farms_owner_insert on public.farms for insert to authenticated
with check (owner_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'farmer' and p.status = 'active'));
create policy farms_owner_update on public.farms for update to authenticated
using (owner_id = auth.uid() or (select private.is_admin()))
with check (owner_id = auth.uid() or (select private.is_admin()));
create policy farms_owner_delete on public.farms for delete to authenticated
using (owner_id = auth.uid() or (select private.is_admin()));

create policy campaigns_public_read on public.campaigns for select to anon, authenticated
using (status = 'published' or (select private.owns_campaign(id)) or (select private.is_admin()));
create policy campaigns_owner_insert on public.campaigns for insert to authenticated
with check ((select private.owns_farm(farm_id)) and status in ('draft', 'pending_review'));
create policy campaigns_owner_update on public.campaigns for update to authenticated
using ((select private.owns_campaign(id)) or (select private.is_admin()))
with check ((select private.owns_farm(farm_id)) or (select private.is_admin()));
create policy campaigns_owner_delete on public.campaigns for delete to authenticated
using (((select private.owns_campaign(id)) and status = 'draft') or (select private.is_admin()));

create policy applications_participants_read on public.applications for select to authenticated
using (worker_id = auth.uid() or (select private.owns_campaign(campaign_id)) or (select private.is_admin()));
create policy applications_worker_insert on public.applications for insert to authenticated
with check (
  worker_id = auth.uid() and status = 'pending'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'worker' and p.status = 'active')
  and exists (select 1 from public.campaigns c where c.id = campaign_id and c.status = 'published')
);
create policy assignments_participants_read on public.assignments for select to authenticated
using (worker_id = auth.uid() or (select private.owns_campaign(campaign_id)) or (select private.is_admin()));

create policy ratings_public_approved_read on public.ratings for select to anon, authenticated
using (status = 'approved' or rater_id = auth.uid() or rated_user_id = auth.uid() or (select private.is_admin()));
create policy ratings_participant_insert on public.ratings for insert to authenticated
with check (rater_id = auth.uid() and status = 'pending');
create policy ratings_admin_update on public.ratings for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy reports_reporter_read on public.reports for select to authenticated
using (reporter_id = auth.uid() or (select private.is_admin()));
create policy reports_user_insert on public.reports for insert to authenticated
with check (reporter_id = auth.uid());
create policy reports_admin_update on public.reports for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy moderation_admin_all on public.moderation_events for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy contact_participants_read on public.contact_events for select to authenticated
using (
  actor_id = auth.uid() or (select private.is_admin()) or exists (
    select 1 from public.applications a
    where a.id = contact_events.application_id
    and (a.worker_id = auth.uid() or private.owns_campaign(a.campaign_id))
  )
);
create policy contact_farmer_insert on public.contact_events for insert to authenticated
with check (
  actor_id = auth.uid() and exists (
    select 1 from public.applications a
    where a.id = application_id and a.status = 'accepted' and private.owns_campaign(a.campaign_id)
  )
);

create policy analytics_admin_read on public.analytics_events for select to authenticated
using ((select private.is_admin()));
create policy analytics_authenticated_insert on public.analytics_events for insert to authenticated
with check (actor_id = auth.uid() or actor_id is null);

revoke all on all tables in schema public from anon, authenticated;
grant select on public.locations, public.farms, public.campaigns, public.ratings to anon;
grant select on all tables in schema public to authenticated;
grant insert, update on public.profiles to authenticated;
grant insert, update, delete on public.farms, public.campaigns to authenticated;
grant insert on public.applications, public.ratings, public.reports, public.contact_events, public.analytics_events to authenticated;
grant insert, update, delete on public.locations to authenticated;
grant update on public.registration_requests, public.moderation_events to authenticated;
grant insert on public.moderation_events to authenticated;

insert into public.locations (province, district, slug, sort_order) values
  ('Jaén', 'Jaén', 'jaen', 10),
  ('Jaén', 'Bellavista', 'bellavista', 20),
  ('Jaén', 'Chontalí', 'chontali', 30),
  ('Jaén', 'Colasay', 'colasay', 40),
  ('Jaén', 'Huabal', 'huabal', 50),
  ('Jaén', 'Las Pirias', 'las-pirias', 60),
  ('Jaén', 'Pomahuaca', 'pomahuaca', 70),
  ('Jaén', 'Pucará', 'pucara', 80),
  ('Jaén', 'Sallique', 'sallique', 90),
  ('Jaén', 'San Felipe', 'san-felipe', 100),
  ('Jaén', 'San José del Alto', 'san-jose-del-alto', 110),
  ('Jaén', 'Santa Rosa', 'santa-rosa', 120)
on conflict (slug) do nothing;
