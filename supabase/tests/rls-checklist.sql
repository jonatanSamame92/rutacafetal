-- Ejecutar en una base local después de `supabase db reset`.
-- Esta prueba falla si alguna tabla pública queda sin RLS.
do $$
declare unsecured_count integer;
begin
  select count(*) into unsecured_count
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and c.relrowsecurity = false;

  if unsecured_count > 0 then
    raise exception 'Hay % tablas públicas sin RLS', unsecured_count;
  end if;
end $$;

-- Los teléfonos viven únicamente en auth.users y no en tablas públicas.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'phone'
  ) then
    raise exception 'profiles no debe contener teléfonos';
  end if;
end $$;
