-- Change this email to the confirmed provider account created in the app.
-- Run only in the Supabase SQL editor, as administrator.
do $$
declare
 provider_email text := 'prestador@example.com';
 provider uuid;
 confirmed timestamptz;
 assigned int;
begin
 select id, email_confirmed_at into provider, confirmed
 from auth.users where lower(email) = lower(trim(provider_email));
 if provider is null then raise exception 'No account for %. Create it in the app first, then replace the email in this script.', provider_email; end if;
 if confirmed is null then raise exception 'The account % has not confirmed its email yet.', provider_email; end if;
 update public.places set owner_id = provider
 where id in ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000003');
 get diagnostics assigned = row_count;
 if assigned = 0 then raise exception 'Demo places not found. Run supabase/seed.sql first.'; end if;
 raise notice 'Assigned % demo places to %.', assigned, provider_email;
end $$;
