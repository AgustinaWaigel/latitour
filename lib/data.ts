import { configured, supabase } from './supabase';
import { demoPlaces } from './demo';
import { Place, effectiveStatus, categories } from './types';
export async function getPlaces(filters: { q?: string; category?: string; open?: string; ids?: string[] } = {}): Promise<Place[]> {
 const q = (filters.q || '').trim().slice(0,100);
 if (!configured) return demoPlaces.filter(p=>(!q||`${p.name} ${p.description}`.toLocaleLowerCase().includes(q.toLocaleLowerCase()))&&(!filters.category||p.category===filters.category)&&(filters.open!=='true'||effectiveStatus(p)==='open')&&(!filters.ids||filters.ids.includes(p.id)));
 const db = await supabase();
 let query = db.from('places').select('*').order('name').limit(100);
 if(q) { const safe=q.replace(/[^\p{L}\p{N}\s]/gu,''); if(safe) query=query.or(`name.ilike.%${safe}%,description.ilike.%${safe}%`); }
 if(filters.category && categories.includes(filters.category as typeof categories[number])) query=query.eq('category',filters.category);
 if(filters.open==='true') query=query.eq('status','open').gte('status_updated_at',new Date(Date.now()-86400000).toISOString());
 if(filters.ids) query=query.in('id',filters.ids);
 const {data,error}=await query; if(error) throw new Error('No pudimos consultar los lugares. Revisá la conexión y el esquema de Supabase.');
 return data as Place[];
}
export async function getPlace(id:string) { if(!configured) return demoPlaces.find(p=>p.id===id); const db=await supabase(); const {data,error}=await db.from('places').select('*').eq('id',id).maybeSingle(); if(error) throw new Error('No pudimos cargar el lugar.'); return data as Place|null; }
