import { notFound } from 'next/navigation';
import { requireProvider } from '@/lib/auth';
import { Place } from '@/lib/types';
import { PlaceForm } from '@/components/place-form';
export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { db, user } = await requireProvider();
  const { data, error } = await db
    .from('places')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();
  if (error || !data) notFound();
  return (
    <main id="main" className="shell standard-page narrow">
      <span className="section-kicker">MIS ESTABLECIMIENTOS</span>
      <h1>Editar establecimiento</h1>
      <PlaceForm place={data as Place} />
    </main>
  );
}
