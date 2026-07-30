import type { StatusSaida } from '@/lib/status-saida';

const classePorStatus: Record<StatusSaida, string> = {
  aberta: 'bg-[color-mix(in_srgb,var(--sucesso)_15%,transparent)] text-[var(--sucesso)]',
  ultimas: 'bg-[var(--amarelo-seta)] text-[var(--azul-profundo)]',
  esgotada: 'bg-[color-mix(in_srgb,var(--nevoa-fraca)_15%,transparent)] text-[var(--nevoa-fraca)]',
  realizada: 'bg-[var(--azul-noite)] text-[var(--dourado)]',
};

export function Selo({ status, children }: { status: StatusSaida; children: React.ReactNode }) {
  return (
    <span
      className={`inline-block rounded-none px-2 py-1 [font-family:var(--fonte-dados)] uppercase text-[11px] tracking-[0.1em] ${classePorStatus[status]}`}
    >
      {children}
    </span>
  );
}
