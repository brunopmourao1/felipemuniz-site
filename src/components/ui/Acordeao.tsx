'use client';

import { useState } from 'react';
import { PortableText } from '@portabletext/react';
import type { FAQ_HOME_RESULT } from '@/sanity/types';

export function Acordeao({ itens }: { itens: FAQ_HOME_RESULT }) {
  const [abertoId, setAbertoId] = useState<string | null>(null);

  return (
    <ul className="flex flex-col divide-y divide-[color-mix(in_srgb,var(--dourado)_20%,transparent)] border-y border-[color-mix(in_srgb,var(--dourado)_20%,transparent)]">
      {itens.map((item) => {
        const aberto = abertoId === item._id;
        return (
          <li key={item._id}>
            <h3>
              <button
                type="button"
                onClick={() => setAbertoId(aberto ? null : item._id)}
                aria-expanded={aberto}
                aria-controls={`faq-resposta-${item._id}`}
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-[var(--fonte-display)] font-bold text-[var(--nevoa)]"
              >
                {item.pergunta}
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-[var(--dourado)] transition-transform duration-200 ${aberto ? 'rotate-180' : ''}`}
                >
                  ↓
                </span>
              </button>
            </h3>
            {aberto && item.resposta && (
              <div
                id={`faq-resposta-${item._id}`}
                className="max-w-[var(--largura-conteudo)] pb-4 text-[var(--nevoa-fraca)]"
              >
                <PortableText value={item.resposta} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
