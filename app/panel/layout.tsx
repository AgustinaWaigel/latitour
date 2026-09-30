import { requireProvider } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireProvider();
  return children;
}
