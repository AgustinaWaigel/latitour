'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Heart, ArrowUpRight } from 'lucide-react';
export function Header() {
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <Compass size={25} />
          </span>
          latitour<span className="brand-dot">.</span>
        </Link>
        <nav aria-label="Navegación principal">
          <Link className={path === '/' ? 'active' : ''} href="/">
            Explorar
          </Link>
          <Link
            className={path === '/favoritos' ? 'active' : ''}
            href="/favoritos"
          >
            <Heart size={16} /> <span>Favoritos</span>
          </Link>
        </nav>
        <Link href="/panel" className="provider-link">
          Soy prestador <ArrowUpRight size={16} />
        </Link>
      </div>
    </header>
  );
}
