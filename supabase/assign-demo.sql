-- Change this email to the confirmed provider account created in the app.
-- Run only in the Supabase SQL editor, as administrator.
do $$
declare provider uuid;
begin
 select id into provider from auth.users where email = 'prestador@example.com';
 if provider is null then raise exception 'Create and confirm the account first, then replace the email in this script.'; end if;
 update public.places set owner_id = provider
 where id in ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000003');
end $$;