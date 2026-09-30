import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { Place, labels, effectiveStatus, statusLabels } from '@/lib/types';
import { Favorite } from './favorite';
export function Status({place}:{place:Place}){const status=effectiveStatus(place);return <span className={`status ${status}`}><span/>{statusLabels[status]}</span>}
export function PlaceCard({place:p}:{place:Place}){return <article className="place-card"><div className="card-photo"><Link href={`/lugares/${p.id}`} tabIndex={-1} aria-hidden="true"><Image src={p.image_url||'/placeholder.svg'} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" unoptimized={!p.image_url.includes('images.unsplash.com')} /></Link><Favorite id={p.id}/><span className="photo-category">{labels[p.category]}</span></div><div className="card-content"><div className="card-title"><Link href={`/lugares/${p.id}`}><h3>{p.name}</h3></Link><ArrowUpRight size={19}/></div><p className="card-address"><MapPin size={14}/>{p.address}</p><p className="card-description">{p.description}</p><div className="card-bottom"><Status place={p}/>{p.is_demo&&<span>Demo</span>}</div></div></article>}
