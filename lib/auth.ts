import { cache } from 'react';
import { redirect } from 'next/navigation';
import { configured, supabase } from './supabase';
export const requireProvider = cache(async () => {
  if (!configured) redirect('/ingresar');
  const db = await supabase();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect('/ingresar');
  return { db, user };
});
