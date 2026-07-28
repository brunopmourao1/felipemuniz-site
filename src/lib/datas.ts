const fusoBR = 'America/Sao_Paulo';

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: fusoBR,
  });
}

/** "04 a 16 de setembro de 2026" ou "28 de agosto a 9 de setembro de 2026" */
export function formatarPeriodo(inicio: string, fim: string): string {
  const d1 = new Date(inicio);
  const d2 = new Date(fim);
  const dia = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', timeZone: fusoBR });
  const mes = (d: Date) =>
    d.toLocaleDateString('pt-BR', { month: 'long', timeZone: fusoBR });
  const ano = (d: Date) =>
    d.toLocaleDateString('pt-BR', { year: 'numeric', timeZone: fusoBR });

  if (mes(d1) === mes(d2) && ano(d1) === ano(d2)) {
    return `${dia(d1)} a ${dia(d2)} de ${mes(d2)} de ${ano(d2)}`;
  }
  if (ano(d1) === ano(d2)) {
    return `${dia(d1)} de ${mes(d1)} a ${dia(d2)} de ${mes(d2)} de ${ano(d2)}`;
  }
  return `${formatarData(inicio)} a ${formatarData(fim)}`;
}

export function contarDias(inicio: string, fim: string): number {
  const ms = new Date(fim).getTime() - new Date(inicio).getTime();
  return Math.round(ms / 86_400_000) + 1;
}
