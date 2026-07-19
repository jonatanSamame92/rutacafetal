-- Reduce API exposure from the project bootstrap helper. Product RPCs remain
-- executable only by authenticated users and perform their own role/ownership checks.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Cover foreign keys used by moderation, ownership checks, and cascade updates.
create index if not exists analytics_events_actor_idx on public.analytics_events(actor_id);
create index if not exists assignments_application_idx on public.assignments(application_id);
create index if not exists assignments_worker_idx on public.assignments(worker_id);
create index if not exists campaigns_farm_idx on public.campaigns(farm_id);
create index if not exists campaigns_location_idx on public.campaigns(location_id);
create index if not exists contact_events_actor_idx on public.contact_events(actor_id);
create index if not exists contact_events_application_idx on public.contact_events(application_id);
create index if not exists farms_location_idx on public.farms(location_id);
create index if not exists farms_owner_idx on public.farms(owner_id);
create index if not exists moderation_events_admin_idx on public.moderation_events(admin_id);
create index if not exists profiles_location_idx on public.profiles(location_id);
create index if not exists ratings_campaign_idx on public.ratings(campaign_id);
create index if not exists ratings_moderated_by_idx on public.ratings(moderated_by);
create index if not exists ratings_rated_user_idx on public.ratings(rated_user_id);
create index if not exists ratings_rater_idx on public.ratings(rater_id);
create index if not exists registration_requests_created_user_idx on public.registration_requests(created_user_id);
create index if not exists registration_requests_location_idx on public.registration_requests(location_id);
create index if not exists registration_requests_reviewed_by_idx on public.registration_requests(reviewed_by);
create index if not exists reports_assigned_to_idx on public.reports(assigned_to);
create index if not exists reports_campaign_idx on public.reports(campaign_id);
create index if not exists reports_reported_user_idx on public.reports(reported_user_id);
create index if not exists reports_reporter_idx on public.reports(reporter_id);

-- Cache auth.uid() once per statement instead of recalculating it for every row.
alter policy profiles_self_or_admin_read on public.profiles
using (id = (select auth.uid()) or (select private.is_admin()));
alter policy profiles_self_update on public.profiles
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

alter policy farms_owner_read on public.farms
using (owner_id = (select auth.uid()) or (select private.is_admin()));
alter policy farms_owner_insert on public.farms
with check (owner_id = (select auth.uid()) and (select private.is_active_role('farmer')));
alter policy farms_owner_update on public.farms
using ((owner_id = (select auth.uid()) and (select private.is_active_role('farmer'))) or (select private.is_admin()))
with check ((owner_id = (select auth.uid()) and (select private.is_active_role('farmer'))) or (select private.is_admin()));
alter policy farms_owner_delete on public.farms
using ((owner_id = (select auth.uid()) and (select private.is_active_role('farmer'))) or (select private.is_admin()));

alter policy applications_participants_read on public.applications
using (worker_id = (select auth.uid()) or (select private.owns_campaign(campaign_id)) or (select private.is_admin()));
alter policy applications_worker_insert on public.applications
with check (
  worker_id = (select auth.uid()) and status = 'pending'
  and (select private.is_active_role('worker'))
  and exists (select 1 from public.campaigns c where c.id = campaign_id and c.status = 'published')
);
alter policy assignments_participants_read on public.assignments
using (worker_id = (select auth.uid()) or (select private.owns_campaign(campaign_id)) or (select private.is_admin()));

alter policy ratings_public_approved_read on public.ratings
using (status = 'approved' or rater_id = (select auth.uid()) or rated_user_id = (select auth.uid()) or (select private.is_admin()));
alter policy ratings_participant_insert on public.ratings
with check (
  rater_id = (select auth.uid()) and status = 'pending'
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.status = 'active' and not p.must_change_password
  )
);

alter policy reports_reporter_read on public.reports
using (reporter_id = (select auth.uid()) or (select private.is_admin()));
alter policy reports_user_insert on public.reports
with check (
  reporter_id = (select auth.uid())
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.status = 'active' and not p.must_change_password
  )
);

alter policy contact_participants_read on public.contact_events
using (
  actor_id = (select auth.uid()) or exists (
    select 1 from public.applications a
    where a.id = application_id
      and (a.worker_id = (select auth.uid()) or (select private.owns_campaign(a.campaign_id)))
  ) or (select private.is_admin())
);
alter policy contact_farmer_insert on public.contact_events
with check (
  actor_id = (select auth.uid()) and (select private.is_active_role('farmer')) and exists (
    select 1 from public.applications a
    where a.id = application_id and a.status = 'accepted' and (select private.owns_campaign(a.campaign_id))
  )
);
