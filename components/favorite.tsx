'use client';
import { useSyncExternalStore } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
const key='latitour:favorites';
function subscribe(cb:()=>void){window.addEventListener('storage',cb);window.addEventListener('favorites',cb);return()=>{window.removeEventListener('storage',cb);window.removeEventListener('favorites',cb);};}
function snapshot(){try{return localStorage.getItem(key)||'[]';}catch{return '[]';}}
export function useFavorites(){const raw=useSyncExternalStore(subscribe,snapshot,()=>'[]');try { const parsed:unknown=JSON.parse(raw);return Array.isArray(parsed)?parsed.filter((v):v is string=>typeof v==='string'):[];}catch{return [];}}
export function Favorite({id,full=false}:{id:string;full?:boolean}){const ids=useFavorites();const saved=ids.includes(id);return <button className={full?'favorite-full':'favorite'} aria-label={saved?'Quitar de favoritos':'Guardar como favorito'} aria-pressed={saved} onClick={()=>{try{localStorage.setItem(key,JSON.stringify(saved?ids.filter(v=>v!==id):[...ids,id]));window.dispatchEvent(new Event('favorites'));toast.success(saved?'Lugar eliminado de favoritos':'Lugar guardado en favoritos');}catch{toast.error('Tu navegador no permite guardar favoritos.');}}}><Heart size={19} fill={saved?'currentColor':'none'}/>{full&&(saved?'Guardado':'Guardar lugar')}</button>}
