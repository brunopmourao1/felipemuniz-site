import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';
import { MenuMobil } from './MenuMobil';
import { linkDoWhatsapp, mensagemGeral } from '@/lib/whatsapp';

const ITENS_NAV = [
  { href: '/saidas', rotulo: 'Saídas' },
  { href: '/o-caminho', rotulo: 'O Caminho' },
  { href: '/preparacao', rotulo: 'Preparação' },
  { href: '/quem-sou', rotulo: 'Quem sou' },
];

export function Cabecalho({ whatsapp }: { whatsapp: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[color-mix(in_srgb,var(--dourado)_20%,transparent)] bg-[var(--azul-profundo)]/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-[var(--fonte-display)] font-extrabold uppercase tracking-[-0.02em] text-[var(--nevoa)]"
        >
          Felipe Muniz
        </Link>

        <nav aria-label="Menu principal" className="hidden md:flex items-center gap-6">
          {ITENS_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-[var(--fonte-display)] text-sm uppercase tracking-[0.05em] text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]"
            >
              {item.rotulo}
            </Link>
          ))}
          <Botao href={linkDoWhatsapp(whatsapp, mensagemGeral())} variante="primario">
            Falar com o Felipe
          </Botao>
        </nav>

        <MenuMobil
          itens={[
            ...ITENS_NAV,
            { href: linkDoWhatsapp(whatsapp, mensagemGeral()), rotulo: 'Falar com o Felipe' },
          ]}
        />
      </Container>
    </header>
  );
}
