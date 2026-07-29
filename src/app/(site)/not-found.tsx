import { PaginaNaoEncontrada } from '@/components/PaginaNaoEncontrada';

export const metadata = {
  title: 'Página não encontrada',
  robots: { index: false, follow: false },
};

export default function NaoEncontrado() {
  return <PaginaNaoEncontrada />;
}
