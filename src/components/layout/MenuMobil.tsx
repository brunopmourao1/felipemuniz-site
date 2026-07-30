'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ItemNav = { href: string; rotulo: string };

export function MenuMobil({ itens }: { itens: ItemNav[] }) {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false);
    };
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aberto]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setAberto((v) => !v)}
        className="flex h-11 w-11 items-center justify-center text-[var(--nevoa)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--amarelo-seta)]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          {aberto ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {aberto && (
        <div
          id="menu-mobile"
          className="fixed inset-0 z-50 bg-[var(--azul-sombra)]/80"
          onClick={() => setAberto(false)}
        >
          <nav
            aria-label="Menu principal"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col gap-1 bg-[var(--azul-noite)] p-6 pt-20 animate-[deslizar_250ms_ease-out] motion-reduce:animate-none"
          >
            {itens.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
                className="rounded-[var(--raio-m)] px-3 py-3 text-[var(--nevoa)] [font-family:var(--fonte-display)] uppercase tracking-[0.05em] hover:bg-[color-mix(in_srgb,var(--dourado)_12%,transparent)]"
              >
                {item.rotulo}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style>{`
        @keyframes deslizar {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
