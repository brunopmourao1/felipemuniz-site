import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { buscar } from '@/sanity/client';
import { GRUPO_POR_SLUG } from '@/sanity/queries';
import type { GRUPO_POR_SLUG_RESULT } from '@/sanity/types';
import { formatarPeriodo, contarDias } from '@/lib/datas';
import { Container } from '@/components/ui/Container';

export const revalidate = 3600;

// Sem generateStaticParams de propósito: o slug é secreto (RF-05.1),
// então a página é sempre renderizada sob demanda, sem entrar em
// nenhuma lista de rotas geradas no build.

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const grupo = await buscar<GRUPO_POR_SLUG_RESULT>(GRUPO_POR_SLUG, { slug }, ['saida']);
  if (!grupo) return {};
  return {
    title: grupo.titulo ? `Grupo — ${grupo.titulo}` : 'Área do grupo',
    robots: { index: false, follow: false },
  };
}

export default async function PaginaGrupo({ params }: Props) {
  const { slug } = await params;
  const grupo = await buscar<GRUPO_POR_SLUG_RESULT>(GRUPO_POR_SLUG, { slug }, ['saida']);
  if (!grupo || !grupo.dataInicio || !grupo.dataFim) notFound();

  return (
    <Container className="py-16">
      <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Área do grupo
      </p>
      <h1 className="mt-2 font-[var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        {grupo.titulo}
      </h1>
      <p className="mt-2 font-[var(--fonte-dados)] text-[var(--nevoa-fraca)] [font-variant-numeric:tabular-nums]">
        {formatarPeriodo(grupo.dataInicio, grupo.dataFim)} · {contarDias(grupo.dataInicio, grupo.dataFim)} dias
        {grupo.cidadeSaida ? ` · saída de ${grupo.cidadeSaida}` : ''}
        {grupo.ramal?.nome ? ` · ${grupo.ramal.nome}` : ''}
        {grupo.distanciaKm ? ` · ${grupo.distanciaKm} km` : ''}
      </p>
      <p className="mt-4 max-w-[var(--largura-conteudo)] text-[var(--nevoa-fraca)]">
        Esta página é só para quem já confirmou vaga nesta saída. Não compartilhe o link.
      </p>

      {grupo.roteiro && grupo.roteiro.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[var(--fonte-display)] text-[var(--texto-2xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            Roteiro dia a dia
          </h2>
          <ol className="mt-6 flex flex-col gap-6">
            {grupo.roteiro.map((dia) => (
              <li
                key={dia.dia}
                className="flex gap-4 border-t border-[color-mix(in_srgb,var(--dourado)_20%,transparent)] pt-6"
              >
                <span className="font-[var(--fonte-dados)] text-2xl font-bold text-[var(--dourado)] [font-variant-numeric:tabular-nums]">
                  {String(dia.dia).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-[var(--fonte-display)] font-bold text-[var(--nevoa)]">{dia.trecho}</p>
                  <p className="mt-1 font-[var(--fonte-dados)] text-sm text-[var(--nevoa-fraca)] [font-variant-numeric:tabular-nums]">
                    {dia.km} km{dia.altimetria ? ` · +${dia.altimetria} m` : ''}
                    {dia.pousada ? ` · ${dia.pousada}` : ''}
                  </p>
                  {dia.descricao && (
                    <p className="mt-2 max-w-[var(--largura-conteudo)] text-[var(--nevoa)]">{dia.descricao}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {((grupo.incluso && grupo.incluso.length > 0) || (grupo.naoIncluso && grupo.naoIncluso.length > 0)) && (
        <section className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {grupo.incluso && grupo.incluso.length > 0 && (
            <div>
              <h2 className="font-[var(--fonte-display)] font-bold uppercase tracking-[0.08em] text-[var(--nevoa)]">
                Está incluso
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {grupo.incluso.map((item) => (
                  <li key={item} className="text-[var(--nevoa)]">{item}</li>
                ))}
              </ul>
            </div>
          )}
          {grupo.naoIncluso && grupo.naoIncluso.length > 0 && (
            <div>
              <h2 className="font-[var(--fonte-display)] font-bold uppercase tracking-[0.08em] text-[var(--nevoa)]">
                Não está incluso
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {grupo.naoIncluso.map((item) => (
                  <li key={item} className="text-[var(--nevoa-fraca)]">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {grupo.orientacoesGrupo && grupo.orientacoesGrupo.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[var(--fonte-display)] text-[var(--texto-2xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            Orientações para o grupo
          </h2>
          <div className="mt-6 max-w-[var(--largura-conteudo)] text-[var(--nevoa)] [&>h2]:mt-6 [&>h2]:font-[var(--fonte-display)] [&>h2]:text-lg [&>h2]:font-bold [&>p+p]:mt-4 [&>ul]:mt-3 [&>ul]:list-disc [&>ul]:pl-5">
            <PortableText value={grupo.orientacoesGrupo} />
          </div>
        </section>
      )}
    </Container>
  );
}
