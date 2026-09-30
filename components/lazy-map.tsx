'use client';
import dynamic from 'next/dynamic';
import { Place } from '@/lib/types';
const Map = dynamic(() => import('./map'), {
  ssr: false,
  loading: () => (
    <div className="map-loading" role="status">
      Cargando mapa de Paraná…
    </div>
  ),
});
export function LazyMap({ places }: { places: Place[] }) {
  return <Map places={places} />;
}
