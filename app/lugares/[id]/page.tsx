import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Navigation,
  MessageCircle,
  Clock,
  Info,
} from 'lucide-react';
import { getPlace } from '@/lib/data';
import { labels, days, availabilityLabels, dateLabel } from '@/lib/types';
import { Status } from '@/components/card';
import { Favorite } from '@/components/favorite';
import { LazyMap } from '@/components/lazy-map';
import { Button } from '@/components/ui/button';
export const dynamic = 'force-dynamic';
export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const p = await getPlace(id);
  if (!p) notFound();
  return (
    <main id="main" className="shell detail-page">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Volver a explorar
      </Link>
      <div className="detail-title">
        <div>
          <span className="section-kicker">{labels[p.category]}</span>
          <h1>{p.name}</h1>
          <p className="inline-meta">
            <MapPin size={17} />
            {p.address}
          </p>
        </div>
        <Favorite id={p.id} full />
      </div>
      <div className="detail-photo">
        <Image
          src={p.image_url || '/placeholder.svg'}
          alt={`Imagen ilustrativa de ${p.name}`}
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
          unoptimized={!p.image_url.includes('images.unsplash.com')}
        />
        {p.is_demo && (
          <span className="photo-category">
            Establecimiento ficticio · Demo
          </span>
        )}
      </div>
      <div className="detail-columns">
        <div>
          <section className="detail-section">
            <h2>Un lugar para descubrir</h2>
            <p>{p.description}</p>
          </section>
          <section className="detail-section">
            <h2>Encontranos en Paraná</h2>
            <p>{p.address}</p>
            <LazyMap places={[p]} />
            <Button asChild className="mt-4">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation size={17} />
                Cómo llegar
              </a>
            </Button>
          </section>
        </div>
        <aside>
          <div className="info-panel">
            <Status place={p} />
            <h3 className="mt-4">{availabilityLabels[p.availability]}</h3>
            <p className="muted small">
              Última confirmación del estado:
              <br />
              {dateLabel(p.status_updated_at)} (Argentina)
            </p>
            <p className="info-note">
              <Info size={16} />
              Estado declarado por el prestador. Vence a las 24 horas y es
              independiente de los horarios.
            </p>
            <div className="contact-actions">
              {p.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${p.phone}`}>
                    <Phone size={16} />
                    Llamar
                  </a>
                </Button>
              )}
              {p.whatsapp && (
                <Button asChild>
                  <a
                    href={`https://wa.me/${p.whatsapp.replace(/D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                </Button>
              )}
              {!p.phone && !p.whatsapp && (
                <p className="muted small">
                  Este lugar todavía no informó un contacto.
                </p>
              )}
            </div>
          </div>
          <div className="info-panel mt-5">
            <h3 className="inline-meta">
              <Clock size={19} />
              Horarios habituales
            </h3>
            <dl className="hours">
              {days.map((d, i) => (
                <div key={d}>
                  <dt>{d}</dt>
                  <dd>{p.hours[i] || 'Sin informar'}</dd>
                </div>
              ))}
            </dl>
            <p className="muted small">
              Información actualizada: {dateLabel(p.updated_at)} (Argentina)
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
