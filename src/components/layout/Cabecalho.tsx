'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
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
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${
        solido
          ? 'border-b border-[color-mix(in_srgb,var(--dourado)_20%,transparent)] bg-[var(--azul-profundo)]/95 backdrop-blur'
          : ''
      }`}
    >
      {!solido && (
        // Mais alto que a barra (64px) de propósito: o degradê já está 100%
        // transparente aos 64px, a sobra é só pra empurrar a borda da camada
        // composta pra dentro de uma faixa onde não há nada visível — sem
        // isso, o Chrome desenha uma linha de costura exatamente no limite
        // da barra, sobre o vídeo/imagem animado da hero.
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{ background: 'linear-gradient(180deg, rgba(8,10,8,.65) 0px, transparent 64px)' }}
        />
      )}
      <Container className="relative flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/marca/seta-amarela.png"
            alt=""
            width={2795}
            height={1525}
            className="h-auto w-[38px]"
          />
          <span className="[font-family:var(--fonte-hero)] text-[23px] font-semibold tracking-[0.02em] text-white">
            Felipe Muniz
          </span>
        </Link>

        <nav aria-label="Menu principal" className="hidden md:flex items-center gap-8">
          {ITENS_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="[font-family:var(--fonte-hero-corpo)] text-[15px] tracking-[0.08em] text-white/85 transition-colors duration-150 hover:text-white"
            >
              {item.rotulo}
            </Link>
          ))}
          <Link
            href={linkDoWhatsapp(whatsapp, mensagemGeral())}
            className="rounded-full bg-[var(--hero-ambar)] px-[22px] py-[10px] [font-family:var(--fonte-hero-corpo)] text-[15px] font-medium text-[var(--hero-sobre-ambar)] transition-colors duration-150 hover:bg-[var(--hero-ambar-hover)]"
          >
            Falar com o Felipe
          </Link>
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
