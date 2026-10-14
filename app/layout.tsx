import type { Metadata } from 'next';
import { Familjen_Grotesk, Gloock } from 'next/font/google';
import { Toaster } from 'sonner';
import { Header } from '@/components/header';
import './globals.css';
const sans = Familjen_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});
const display = Gloock({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});
export const metadata: Metadata = {
  title: 'Latitour · Descubrí Paraná',
  description:
    'Tu próximo plan en Paraná. Gastronomía, alojamientos, actividades y servicios en un solo lugar.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${sans.variable} ${display.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        <Header />
        {children}
        <footer className="shell footer">
          <div>
            <strong>latitour.</strong>
            <span>Hecho para descubrir, pensado para disfrutar.</span>
          </div>
          <p>
            Paraná, Entre Ríos <span>·</span> Proyecto universitario
          </p>
        </footer>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
