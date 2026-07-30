type Dia = { dia: number; trecho: string; km: number; altimetria?: number | null };

export function FitaAltimetria({ roteiro }: { roteiro: Dia[] }) {
  const dados = roteiro.filter((d) => typeof d.altimetria === 'number') as (Dia & { altimetria: number })[];
  if (dados.length < 3) return null;   // com menos de 3 pontos não há perfil

  const L = 800, A = 180, margem = 24;
  const maxAlt = Math.max(...dados.map((d) => d.altimetria));

  const pontos = dados.map((d, i) => {
    const x = margem + (i / (dados.length - 1)) * (L - margem * 2);
    const y = A - margem - (d.altimetria / maxAlt) * (A - margem * 2);
    return { x, y, ...d };
  });

  const traco = pontos.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = `${traco} L ${pontos.at(-1)!.x} ${A - margem} L ${pontos[0].x} ${A - margem} Z`;

  return (
    <figure className="fita-altimetria">
      <figcaption className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Perfil do percurso
      </figcaption>
      <svg viewBox={`0 0 ${L} ${A}`} role="img"
           aria-label={`Perfil de elevação em ${dados.length} dias, com máximo de ${maxAlt} metros de subida em um dia.`}>
        <path d={area} fill="var(--dourado)" fillOpacity="0.12" />
        <path d={traco} fill="none" stroke="var(--amarelo-seta)"
              strokeWidth="2" strokeLinejoin="round" className="traco-altimetria" />
        {pontos.map((p) => (
          <g key={p.dia}>
            <circle cx={p.x} cy={p.y} r="3" fill="var(--amarelo-seta)" />
            <text x={p.x} y={A - 6} textAnchor="middle"
                  className="rotulo-dia" fill="var(--nevoa-fraca)" fontSize="10">D{p.dia}</text>
          </g>
        ))}
      </svg>
      <p className="sr-only">
        {dados.map((d) => `Dia ${d.dia}, ${d.trecho}: ${d.km} km, ${d.altimetria} metros de subida.`).join(' ')}
      </p>
    </figure>
  );
}
