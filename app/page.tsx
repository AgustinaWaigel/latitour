import { getPlaces } from '@/lib/data';
import { Explore } from '@/components/explore';
export const dynamic='force-dynamic';
export default async function Home({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {const raw=await searchParams;const filters=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Array.isArray(v)?v[0]:v]));const places=await getPlaces(filters);return <Explore places={places}/>}