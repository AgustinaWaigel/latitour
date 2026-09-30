'use client';
import { Button } from '@/components/ui/button';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="shell empty"><h1>No pudimos cargar esta página</h1><p>Revisá tu conexión. Si configuraste Supabase, comprobá las variables de entorno y ejecutá el esquema del README.</p><Button onClick={reset}>Volver a intentar</Button></main>}