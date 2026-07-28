import EstudioCliente from '@/components/EstudioCliente';

export const dynamic = 'force-static';
export const metadata = { robots: { index: false, follow: false } };

export default function StudioPage() {
  return <EstudioCliente />;
}
