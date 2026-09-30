export const categories = [
  'gastronomia',
  'alojamiento',
  'actividades',
  'transporte',
  'servicios',
] as const;
export type Category = (typeof categories)[number];
export const labels: Record<Category, string> = {
  gastronomia: 'Gastronomía',
  alojamiento: 'Alojamiento',
  actividades: 'Actividades',
  transporte: 'Transporte',
  servicios: 'Servicios útiles',
};
export const days = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];
export type Place = {
  id: string;
  owner_id: string | null;
  name: string;
  description: string;
  category: Category;
  address: string;
  latitude: number;
  longitude: number;
  image_url: string;
  phone: string;
  whatsapp: string;
  hours: string[];
  status: 'open' | 'closed' | 'unknown';
  availability: 'available' | 'limited' | 'unavailable' | 'ask';
  status_updated_at: string;
  updated_at: string;
  is_demo: boolean;
};
export function effectiveStatus(
  p: Pick<Place, 'status' | 'status_updated_at'>,
  now = Date.now(),
) {
  return now - new Date(p.status_updated_at).getTime() > 86400000
    ? 'unknown'
    : p.status;
}
export const statusLabels = {
  open: 'Abierto ahora',
  closed: 'Cerrado',
  unknown: 'Estado sin confirmar',
};
export const availabilityLabels = {
  available: 'Disponible',
  limited: 'Disponibilidad limitada',
  unavailable: 'Sin disponibilidad',
  ask: 'Consultar disponibilidad',
};
export const dateLabel = (s: string) =>
  new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date(s));
