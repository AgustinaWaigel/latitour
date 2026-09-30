'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { authSchema, placeSchema, PlaceInput } from '@/lib/validation';
import { z } from 'zod';
type Result = { error?: string; success?: string };
export async function authenticate(
  values: { email: string; password: string },
  register: boolean,
): Promise<Result> {
  const parsed = authSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const db = await supabase();
    const { data, error } = register
      ? await db.auth.signUp(parsed.data)
      : await db.auth.signInWithPassword(parsed.data);
    if (error)
      return {
        error: register
          ? 'No se pudo crear la cuenta. Revisá el correo o intentá iniciar sesión.'
          : 'Correo o contraseña incorrectos, o correo pendiente de confirmación.',
      };
    if (register && !data.session)
      return {
        success:
          'Revisá tu correo y confirmá la cuenta antes de iniciar sesión.',
      };
  } catch {
    return {
      error:
        'No pudimos conectar con Supabase. Revisá la configuración y volvé a intentar.',
    };
  }
  redirect('/panel');
}
export async function signOut() {
  const db = await supabase();
  await db.auth.signOut();
  redirect('/ingresar');
}
async function authenticated() {
  const db = await supabase();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user)
    throw new Error('Tu sesión venció. Volvé a iniciar sesión.');
  return { db, user };
}
export async function savePlace(
  values: PlaceInput,
  id?: string,
): Promise<Result> {
  const parsed = placeSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const { db, user } = await authenticated();
    if (id) {
      const { data, error } = await db
        .from('places')
        .update(parsed.data)
        .eq('id', id)
        .eq('owner_id', user.id)
        .select('id')
        .single();
      if (error || !data)
        return { error: 'No se pudo guardar. Verificá que el lugar sea tuyo.' };
    } else {
      const { error } = await db
        .from('places')
        .insert({ ...parsed.data, owner_id: user.id, is_demo: false });
      if (error)
        return {
          error: 'No se pudo crear el lugar. Revisá el esquema y los datos.',
        };
    }
    revalidatePath('/');
    revalidatePath('/panel');
    if (id) revalidatePath(`/lugares/${id}`);
    return { success: 'Establecimiento guardado correctamente.' };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'No se pudo guardar.' };
  }
}
export async function updateStatus(
  id: string,
  status: string,
  availability: string,
): Promise<Result> {
  const values = z
    .object({
      id: z.string().uuid(),
      status: z.enum(['open', 'closed', 'unknown']),
      availability: z.enum(['available', 'limited', 'unavailable', 'ask']),
    })
    .safeParse({ id, status, availability });
  if (!values.success) return { error: 'Estado o disponibilidad inválidos.' };
  try {
    const { db, user } = await authenticated();
    const { data, error } = await db
      .from('places')
      .update({
        status,
        availability,
        status_updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('owner_id', user.id)
      .select('id')
      .single();
    if (error || !data)
      return {
        error: 'No se pudo actualizar este lugar. Comprobá que sea tuyo.',
      };
    revalidatePath('/');
    revalidatePath('/panel');
    revalidatePath(`/lugares/${id}`);
    return {
      success: 'Estado confirmado. Ya está disponible para los turistas.',
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'No se pudo actualizar.' };
  }
}
export async function deletePlace(id: string): Promise<Result> {
  try {
    const { db, user } = await authenticated();
    const { data, error } = await db
      .from('places')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id)
      .select('id')
      .single();
    if (error || !data)
      return { error: 'No se pudo eliminar. Comprobá que el lugar sea tuyo.' };
    revalidatePath('/');
    revalidatePath('/panel');
    revalidatePath(`/lugares/${id}`);
    return { success: 'Establecimiento eliminado.' };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'No se pudo eliminar.' };
  }
}
