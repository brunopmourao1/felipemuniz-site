'use client';

import { useState } from 'react';
import { anguloDoCarimbo, opacidadeDoCarimbo, mesAnoCarimbo } from '@/lib/credencial';
import type { DEPOIMENTOS_HOME_RESULT } from '@/sanity/types';

type Depoimento = DEPOIMENTOS_HOME_RESULT[number];

export function Carimbo({ depoimento }: { depoimento: Depoimento }) {
  const [aberto, setAberto] = useState(false);
  const angulo = anguloDoCarimbo(depoimento._id);
  const opacidade = opacidadeDoCarimbo(depoimento._id);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-label={`Carimbo de ${depoimento.nome}${depoimento.cidade ? `, ${depoimento.cidade}` : ''}. Toque para ler o depoimento completo.`}
        className="flex w-28 flex-col items-center gap-0.5 border-2 border-[var(--tinta-carimbo)] bg-transparent px-2 py-3 text-center transition-transform duration-200 hover:scale-105 focus-visible:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tinta-carimbo)]"
        style={{ transform: `rotate(${angulo}deg)`, opacity: opacidade, color: 'var(--tinta-carimbo)' }}
      >
        <span className="[font-family:var(--fonte-display)] text-xs font-bold uppercase tracking-[0.05em]">
          {depoimento.nome}
        </span>
        {depoimento.cidade && (
          <span className="[font-family:var(--fonte-dados)] text-[10px] uppercase">{depoimento.cidade}</span>
        )}
        {depoimento.saida?.dataInicio && (
          <span className="[font-family:var(--fonte-dados)] text-[10px] uppercase [font-variant-numeric:tabular-nums]">
            {mesAnoCarimbo(depoimento.saida.dataInicio)}
          </span>
        )}
      </button>

      {aberto && (
        <div
          role="note"
          className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-[var(--raio-p)] border border-[var(--tinta-carimbo)] bg-[var(--pergaminho)] p-4 text-left shadow-lg"
        >
          <p className="[font-family:var(--fonte-citacao)] italic text-[var(--azul-profundo)]">
            &ldquo;{depoimento.texto}&rdquo;
          </p>
          <p className="mt-2 [font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.05em] text-[var(--tinta-carimbo)]">
            {depoimento.nome}
            {depoimento.cidade ? ` · ${depoimento.cidade}` : ''}
            {depoimento.saida?.ramal?.nome ? ` · ${depoimento.saida.ramal.nome}` : ''}
          </p>
        </div>
      )}
    </div>
  );
}
