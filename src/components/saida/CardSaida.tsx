import Image from 'next/image';
import { urlDaImagem } from '@/sanity/image';
import { statusDaSaida, rotuloDoStatus } from '@/lib/status-saida';
import { formatarPeriodo, contarDias } from '@/lib/datas';
import { Selo } from '@/components/ui/Selo';
import { Botao } from '@/components/ui/Botao';
import type { PROXIMAS_SAIDAS_RESULT } from '@/sanity/types';

type ItemSaida = PROXIMAS_SAIDAS_RESULT[number];

function mesAno(iso: string): string {
  const partes = new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).formatToParts(new Date(iso));
  const mes = partes.find((p) => p.type === 'month')?.value.replace('.', '') ?? '';
  const ano = partes.find((p) => p.type === 'year')?.value ?? '';
  return `${mes}/${ano}`.toUpperCase();
}

export function CardSaida({
  saida,
  variante = 'aberta',
}: {
  saida: ItemSaida;
  variante?: 'aberta' | 'realizada';
}) {
  if (!saida.slug || !saida.dataInicio || !saida.dataFim) return null;

  const status = statusDaSaida({
    dataFim: saida.dataFim,
    vagasTotal: saida.vagasTotal ?? 0,
    vagasDisponiveis: saida.vagasDisponiveis ?? 0,
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--raio-m)] bg-[var(--azul-noite)]">
      <div className="relative aspect-[3/2] overflow-hidden">
        {saida.imagemCapa?.asset && (
          <Image
            src={urlDaImagem(saida.imagemCapa).width(800).height(533).url()}
            alt={saida.imagemCapa.alt}
            fill
            placeholder={saida.imagemCapa.lqip ? 'blur' : undefined}
            blurDataURL={saida.imagemCapa.lqip ?? undefined}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute right-3 top-3">
          <Selo status={status}>{rotuloDoStatus[status]}</Selo>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.1em] text-[var(--dourado)]">
          {mesAno(saida.dataInicio)}
        </p>
        <h3 className="font-[var(--fonte-display)] text-lg font-bold text-[var(--nevoa)]">
          {saida.titulo}
        </h3>
        <p className="font-[var(--fonte-dados)] text-sm text-[var(--nevoa-fraca)] [font-variant-numeric:tabular-nums]">
          {formatarPeriodo(saida.dataInicio, saida.dataFim)} · {contarDias(saida.dataInicio, saida.dataFim)} dias
          {saida.distanciaKm ? ` · ${saida.distanciaKm} km` : ''}
        </p>

        <hr className="border-t border-[color-mix(in_srgb,var(--dourado)_30%,transparent)]" />

        <div className="flex items-center justify-between">
          <span className="font-[var(--fonte-dados)] text-sm text-[var(--nevoa)]">
            {variante === 'realizada'
              ? 'Realizada'
              : status === 'esgotada'
                ? 'Esgotada'
                : `${saida.vagasDisponiveis ?? 0} vagas`}
          </span>
          {saida.valor && (
            <span className="font-[var(--fonte-dados)] text-sm text-[var(--nevoa-fraca)]">{saida.valor}</span>
          )}
        </div>

        <Botao href={`/saidas/${saida.slug}`} variante="secundario" comSeta className="mt-2">
          Ver a saída
        </Botao>
      </div>
    </article>
  );
}
