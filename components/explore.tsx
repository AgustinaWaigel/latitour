'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useTransition,
  useState,
  useOptimistic,
  useRef,
  type CSSProperties,
} from 'react';
import {
  ArrowRight,
  Search,
  MapPin,
  Utensils,
  BedDouble,
  Compass,
  Bus,
  BriefcaseMedical,
  LayoutGrid,
  Map,
  SlidersHorizontal,
  Info,
  RotateCw,
  Waves,
  Navigation,
} from 'lucide-react';
import { Place, categories, labels } from '@/lib/types';
import { PlaceCard } from './card';
import { Button } from './ui/button';
import { LazyMap } from './lazy-map';
import { useReveal } from './reveal';
const icons = {
  gastronomia: Utensils,
  alojamiento: BedDouble,
  actividades: Compass,
  transporte: Bus,
  servicios: BriefcaseMedical,
};
const delay = (d: number) => ({ '--d': d }) as CSSProperties;
const riverLines = [0, 1, 2, 3, 4].map((n) => {
  const y = 300 + n * 34;
  return `M -40 ${y} C 220 ${y - 70}, 420 ${y + 60}, 680 ${y - 10} S 1040 ${y - 90}, 1240 ${y - 30}`;
});
const spots = [
  'Costanera',
  'Parque Urquiza',
  'Puerto Viejo',
  'Túnel Subfluvial',
  'Balneario Thompson',
  'El Rosedal',
  'Bajada Grande',
  'Parque Nuevo',
  'Isla Curupí',
];
export function Explore({ places }: { places: Place[] }) {
  const router = useRouter(),
    params = useSearchParams();
  const [pending, start] = useTransition();
  const [query, setQuery] = useState(params.get('q') || '');
  const rawCategory = params.get('category');
  const category = categories.find((c) => c === rawCategory) || '';
  const open = params.get('open') === 'true';
  const [optimisticOpen, setOptimisticOpen] = useOptimistic(open);
  const map = params.get('view') === 'map';
  const grid = useRef<HTMLDivElement>(null);
  useReveal(grid, `${map}:${places.map((p) => p.id).join()}`);
  function update(values: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(values).forEach(([k, v]) =>
      v ? next.set(k, v) : next.delete(k),
    );
    start(() => router.push(`/?${next}`, { scroll: false }));
  }
  return (
    <main id="main">
      <section className="hero shell">
        <Image
          className="hero-image"
          src="/river.jpg"
          alt="Paisaje verde de bosque junto al agua, imagen ilustrativa del litoral"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <svg
          className="hero-river"
          viewBox="0 0 1200 520"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {riverLines.map((d, i) => (
            <path key={d} d={d} style={delay(i)} />
          ))}
        </svg>
        <div className="hero-content">
          <span className="eyebrow hero-rise">
            <MapPin size={14} /> PARANÁ, ENTRE RÍOS
          </span>
          <h1>
            <span className="line">
              <span>Tu próximo plan</span>
            </span>
            <span className="line" style={delay(1)}>
              <span>
                está{' '}
                <em>
                  acá cerca.
                  <svg
                    className="squiggle"
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M2 9 C 22 2, 38 2, 56 8 S 92 14, 112 7 S 150 1, 170 7 S 192 11, 198 6" />
                  </svg>
                </em>
              </span>
            </span>
          </h1>
          <p className="hero-rise" style={delay(3)}>
            Descubrí los sabores, rincones y experiencias de Paraná.
            <br className="desktop" /> Todo lo que necesitás, en un mismo lugar.
          </p>
          <form
            className="search-box hero-rise"
            style={delay(4)}
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: query });
            }}
          >
            <Search size={22} />
            <input
              aria-label="Buscar lugares"
              placeholder="¿Qué te gustaría descubrir?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={100}
            />
            <Button type="submit" disabled={pending}>
              Buscar <ArrowRight size={17} />
            </Button>
          </form>
          <div className="hero-foot hero-rise" style={delay(5)}>
            <Waves size={17} />
            <span>Un río. Mil formas de disfrutarlo.</span>
          </div>
        </div>
        <div
          className="hero-coords"
          aria-label="Coordenadas de Paraná: 31°44′ sur, 60°31′ oeste"
        >
          <Navigation className="hero-needle" size={20} aria-hidden="true" />
          <span aria-hidden="true">
            <small>LAT</small> 31°44′ S
          </span>
          <span aria-hidden="true">
            <small>LON</small> 60°31′ O
          </span>
        </div>
        <span className="hero-caption">
          IMAGEN ILUSTRATIVA <span>—</span> SALÍ A EXPLORAR
        </span>
      </section>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy}>
              {spots.map((spot) => (
                <li key={spot}>{spot}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <section className="shell discovery" aria-label="Explorar lugares">
        <div className="category-row">
          <button
            className={`category ${!category ? 'selected' : ''}`}
            aria-pressed={!category}
            onClick={() => update({ category: '' })}
          >
            <span className="category-top">
              <LayoutGrid size={21} />
              <span className="category-num" aria-hidden="true">
                00
              </span>
            </span>
            <span>Todo para explorar</span>
          </button>
          {categories.map((c, i) => {
            const Icon = icons[c];
            return (
              <button
                key={c}
                className={`category ${category === c ? 'selected' : ''}`}
                aria-pressed={category === c}
                onClick={() => update({ category: c })}
              >
                <span className="category-top">
                  <Icon size={21} />
                  <span className="category-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
                <span>{labels[c]}</span>
              </button>
            );
          })}
        </div>
        <div className="results-heading">
          <div key={category || 'all'} className="results-title">
            <span className="section-kicker">ENCONTRÁ TU LUGAR</span>
            <h2>
              {category ? labels[category] : 'Paraná te espera'}
              <svg
                className="small-spark"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 1 L13.6 10.4 L23 12 L13.6 13.6 L12 23 L10.4 13.6 L1 12 L10.4 10.4 Z" />
              </svg>
            </h2>
            <p>Planes para cada momento, a tu manera.</p>
          </div>
          <div
            className="view-switch"
            aria-label="Vista de resultados"
            data-view={map ? 'map' : 'list'}
          >
            <button
              className={!map ? 'selected' : ''}
              aria-pressed={!map}
              onClick={() => update({ view: '' })}
            >
              <LayoutGrid size={16} />
              Lista
            </button>
            <button
              className={map ? 'selected' : ''}
              aria-pressed={map}
              onClick={() => update({ view: 'map' })}
            >
              <Map size={16} />
              Mapa
            </button>
          </div>
        </div>
        <div className="filter-bar">
          <div className="filter-left">
            <SlidersHorizontal size={17} />
            <label className="open-filter">
              <input
                type="checkbox"
                checked={optimisticOpen}
                onChange={(e) => {
                  const checked = e.target.checked;
                  start(() => {
                    setOptimisticOpen(checked);
                    update({ open: checked ? 'true' : '' });
                  });
                }}
              />
              <span className="switch" />
              Abierto ahora
            </label>
            <span className="filter-divider" />
            <span className="result-count" aria-live="polite">
              {pending
                ? 'Buscando…'
                : `${places.length} lugares para descubrir`}
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={() => start(() => router.refresh())}
            disabled={pending}
            aria-label="Volver a consultar lugares"
          >
            <RotateCw size={15} />
            <span className="desktop">Actualizar</span>
          </Button>
        </div>
        {(params.get('q') || category || open) && (
          <div className="active-filters">
            <span>
              {params.get('q')
                ? `Búsqueda: “${params.get('q')}”`
                : 'Filtros aplicados'}
            </span>
            <button
              onClick={() => {
                setQuery('');
                update({ q: '', category: '', open: '' });
              }}
            >
              Limpiar filtros ×
            </button>
          </div>
        )}
        <div
          aria-busy={pending}
          className={pending ? 'results pending' : 'results'}
        >
          {places.length === 0 ? (
            <div className="empty">
              <Search size={36} />
              <h3>No encontramos lugares con esos filtros</h3>
              <p>Probá otra búsqueda o explorá todas las categorías.</p>
              <Button
                onClick={() => {
                  setQuery('');
                  update({ q: '', category: '', open: '' });
                }}
              >
                Ver todos los lugares
              </Button>
            </div>
          ) : map ? (
            <LazyMap places={places} />
          ) : (
            <div className="cards-grid" ref={grid}>
              {places.map((p, i) => (
                <div
                  key={p.id}
                  data-reveal
                  style={{ '--i': i % 3 } as CSSProperties}
                >
                  <PlaceCard place={p} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="demo-notice">
          <Info size={18} />
          <p>
            <strong>Estás explorando una demostración.</strong> Los
            establecimientos marcados como demo son ficticios y las fotos son
            ilustrativas. El estado es declarado por cada prestador y vence a
            las 24 horas.
          </p>
        </div>
      </section>
    </main>
  );
}
