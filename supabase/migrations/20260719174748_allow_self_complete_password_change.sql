-- A user who is signed in with a temporary password may only clear this flag
-- for their own active profile. The password itself is changed first through
-- Supabase Auth in the server action.
create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.role() <> 'service_role' and current_user not in ('postgres', 'supabase_admin') and not private.is_admin() then
    new.role := old.role;
    new.status := old.status;
    if not (
      old.must_change_password
      and not new.must_change_password
      and old.status = 'active'
      and old.id = (select auth.uid())
    ) then
      new.must_change_password := old.must_change_password;
    end if;
    new.completed_campaigns := old.completed_campaigns;
    new.rating_average := old.rating_average;
    new.rating_count := old.rating_count;
  end if;
  return new;
end;
$$;
