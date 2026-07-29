/** Rotação estável do carimbo, derivada do id — não muda a cada renderização. */
export function anguloDoCarimbo(id: string): number {
  const soma = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ((soma % 160) - 80) / 10; // −8.0° a +8.0°
}

/** Opacidade estável do carimbo, derivada do id — entre 0,85 e 1. */
export function opacidadeDoCarimbo(id: string): number {
  const soma = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return 0.85 + (soma % 16) / 100;
}

export function mesAnoCarimbo(iso: string): string {
  const partes = new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).formatToParts(new Date(iso));
  const mes = partes.find((p) => p.type === 'month')?.value.replace('.', '') ?? '';
  const ano = partes.find((p) => p.type === 'year')?.value ?? '';
  return `${mes}/${ano}`.toUpperCase();
}
