-- Keep anonymous reads independent from authenticated helper functions.
-- PostgreSQL may evaluate every branch in a policy expression, so anonymous
-- policies must never reference private helpers or auth.uid().

drop policy if exists locations_public_read on public.locations;
drop policy if exists locations_admin_write on public.locations;

create policy locations_anon_read
on public.locations for select
to anon
using (is_active);

create policy locations_authenticated_read
on public.locations for select
to authenticated
using (is_active or (select private.is_admin()));

create policy locations_admin_insert
on public.locations for insert
to authenticated
with check ((select private.is_admin()));

create policy locations_admin_update
on public.locations for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy locations_admin_delete
on public.locations for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists farms_public_read_published on public.farms;
drop policy if exists farms_owner_read on public.farms;

create policy farms_anon_read_published
on public.farms for select
to anon
using (
  exists (
    select 1
    from public.campaigns c
    where c.farm_id = farms.id
      and c.status = 'published'
  )
);

create policy farms_authenticated_read
on public.farms for select
to authenticated
using (
  owner_id = (select auth.uid())
  or (select private.is_admin())
  or exists (
    select 1
    from public.campaigns c
    where c.farm_id = farms.id
      and c.status = 'published'
  )
);

drop policy if exists campaigns_public_read on public.campaigns;

create policy campaigns_anon_read_published
on public.campaigns for select
to anon
using (status = 'published');

create policy campaigns_authenticated_read
on public.campaigns for select
to authenticated
using (
  status = 'published'
  or (select private.owns_campaign(campaigns.id))
  or (select private.is_admin())
);

drop policy if exists ratings_public_approved_read on public.ratings;

create policy ratings_anon_read_approved
on public.ratings for select
to anon
using (status = 'approved');

create policy ratings_authenticated_read
on public.ratings for select
to authenticated
using (
  status = 'approved'
  or rater_id = (select auth.uid())
  or rated_user_id = (select auth.uid())
  or (select private.is_admin())
);
