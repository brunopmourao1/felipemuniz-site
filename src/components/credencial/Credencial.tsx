import { Carimbo } from '@/components/credencial/Carimbo';
import type { DEPOIMENTOS_HOME_RESULT } from '@/sanity/types';

export function Credencial({
  depoimentos,
  peregrinosGuiados,
  saidasRealizadas,
}: {
  depoimentos: DEPOIMENTOS_HOME_RESULT;
  peregrinosGuiados?: number | null;
  saidasRealizadas?: number | null;
}) {
  if (depoimentos.length === 0) return null;

  const numero = peregrinosGuiados ? String(peregrinosGuiados).padStart(4, '0') : '0001';

  return (
    <div className="rounded-[var(--raio-m)] bg-[var(--pergaminho)] px-6 py-10 sm:px-10">
      <div className="flex items-baseline justify-between border-b border-[color-mix(in_srgb,var(--tinta-carimbo)_30%,transparent)] pb-4">
        <p className="[font-family:var(--fonte-dados)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--tinta-carimbo)]">
          Credencial do peregrino
        </p>
        <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.1em] text-[var(--tinta-carimbo)] [font-variant-numeric:tabular-nums]">
          nº {numero}
        </p>
      </div>

      <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-10 pb-4">
        {depoimentos.map((dep) => (
          <li key={dep._id}>
            <Carimbo depoimento={dep} />
          </li>
        ))}
      </ul>

      {(peregrinosGuiados || saidasRealizadas) && (
        <p className="mt-6 text-center [font-family:var(--fonte-dados)] text-sm text-[var(--tinta-carimbo)] [font-variant-numeric:tabular-nums]">
          {peregrinosGuiados ? `${peregrinosGuiados} peregrinos guiados` : ''}
          {peregrinosGuiados && saidasRealizadas ? ' · ' : ''}
          {saidasRealizadas ? `${saidasRealizadas} saídas` : ''}
        </p>
      )}
    </div>
  );
}
