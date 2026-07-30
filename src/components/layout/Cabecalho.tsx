'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
  // Transparente no topo (sobre a hero, na home) e sólido assim que rola —
  // em páginas sem hero de foto, o fundo --azul-profundo por trás já é
  // praticamente igual à barra sólida, então não salta.
  const [solido, setSolido] = useState(false);

  useEffect(() => {
    function aoRolar() {
      setSolido(window.scrollY > 40);
    }
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 border-b transition-colors duration-300 ${
        solido
          ? 'border-[color-mix(in_srgb,var(--dourado)_20%,transparent)] bg-[var(--azul-profundo)]/95 backdrop-blur'
          : 'border-transparent bg-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/marca/seta-amarela.png"
            alt=""
            width={2795}
            height={1525}
            className="h-4 w-auto"
          />
          <span className="font-[var(--fonte-display)] font-extrabold uppercase tracking-[-0.02em] text-[var(--nevoa)]">
            Felipe Muniz
          </span>
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
