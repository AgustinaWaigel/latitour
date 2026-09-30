import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="shell empty">
      <h1>Este lugar no está disponible</h1>
      <p>Quizás fue eliminado o el enlace es incorrecto.</p>
      <Link href="/" className="back-link">
        Volver a explorar →
      </Link>
    </main>
  );
}
