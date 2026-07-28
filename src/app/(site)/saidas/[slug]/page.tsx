import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { buscar } from '@/sanity/client';
import { SAIDA_POR_SLUG, SLUGS_SAIDA } from '@/sanity/queries';
import type { SAIDA_POR_SLUG_RESULT, SLUGS_SAIDA_RESULT } from '@/sanity/types';
import { urlDaImagem } from '@/sanity/image';
import { statusDaSaida, rotuloDoStatus, textoDoBotao } from '@/lib/status-saida';
import { formatarPeriodo, contarDias } from '@/lib/datas';
import { linkDoWhatsapp, mensagemReserva } from '@/lib/whatsapp';
import { Container } from '@/components/ui/Container';
import { Selo } from '@/components/ui/Selo';
import { Botao } from '@/components/ui/Botao';
import { FitaAltimetria } from '@/components/saida/FitaAltimetria';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await buscar<SLUGS_SAIDA_RESULT>(SLUGS_SAIDA);
  return slugs.filter((s) => s.slug).map(({ slug }) => ({ slug: slug as string }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const saida = await buscar<SAIDA_POR_SLUG_RESULT>(SAIDA_POR_SLUG, { slug }, ['saida']);
  if (!saida) return {};
  return {
    title: saida.seo?.titulo ?? `${saida.titulo} — Caminho da Fé`,
    description: saida.seo?.descricao ?? saida.resumo ?? undefined,
    robots: saida.seo?.naoIndexar ? { index: false } : undefined,
  };
}

export default async function PaginaSaida({ params }: Props) {
  const { slug } = await params;
  const saida = await buscar<SAIDA_POR_SLUG_RESULT>(SAIDA_POR_SLUG, { slug }, ['saida']);
  if (!saida || !saida.dataInicio || !saida.dataFim) notFound();

  const status = statusDaSaida({
    dataFim: saida.dataFim,
    vagasTotal: saida.vagasTotal ?? 0,
    vagasDisponiveis: saida.vagasDisponiveis ?? 0,
  });

  const numeroWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? '';
  const linkReserva = linkDoWhatsapp(
    numeroWhatsapp,
    mensagemReserva(saida.titulo ?? '', formatarPeriodo(saida.dataInicio, saida.dataFim))
  );

  return (
    <Container className="py-16">
      <Link href="/saidas" className="text-sm text-[var(--nevoa-fraca)] hover:text-[var(--amarelo-seta)]">
        ← Voltar para saídas
      </Link>

      <header className="mt-6">
        {saida.ramal?.nome && (
          <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
            {saida.ramal.nome}
          </p>
        )}
        <h1 className="mt-2 font-[var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
          {saida.titulo}
        </h1>
        <p className="mt-2 font-[var(--fonte-dados)] text-[var(--nevoa-fraca)] [font-variant-numeric:tabular-nums]">
          {formatarPeriodo(saida.dataInicio, saida.dataFim)} · {contarDias(saida.dataInicio, saida.dataFim)} dias
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Selo status={status}>{rotuloDoStatus[status]}</Selo>
          {saida.distanciaKm && (
            <span className="font-[var(--fonte-dados)] text-sm text-[var(--nevoa-fraca)]">
              {saida.distanciaKm} km
            </span>
          )}
          {saida.nivel && (
            <span className="font-[var(--fonte-dados)] text-sm capitalize text-[var(--nevoa-fraca)]">
              Nível {saida.nivel}
            </span>
          )}
        </div>

        {saida.valor && (
          <p className="mt-4 font-[var(--fonte-dados)] text-xl text-[var(--nevoa)]">{saida.valor}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-4">
          <Botao href={linkReserva} variante="primario" comSeta>
            {textoDoBotao(status)}
          </Botao>
        </div>
      </header>

      {saida.roteiro && saida.roteiro.length > 0 && (
        <section className="mt-16">
          <FitaAltimetria
            roteiro={saida.roteiro
              .filter((d): d is typeof d & { dia: number; trecho: string; km: number } =>
                d.dia != null && d.trecho != null && d.km != null
              )
              .map((d) => ({ dia: d.dia, trecho: d.trecho, km: d.km, altimetria: d.altimetria }))}
          />
        </section>
      )}

      {saida.roteiro && saida.roteiro.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[var(--fonte-display)] text-[var(--texto-2xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            Roteiro dia a dia
          </h2>
          <ol className="mt-6 flex flex-col gap-6">
            {saida.roteiro.map((dia) => (
              <li key={dia.dia} className="flex gap-4 border-t border-[color-mix(in_srgb,var(--dourado)_20%,transparent)] pt-6">
                <span className="font-[var(--fonte-dados)] text-2xl font-bold text-[var(--dourado)] [font-variant-numeric:tabular-nums]">
                  {String(dia.dia).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-[var(--fonte-display)] font-bold text-[var(--nevoa)]">{dia.trecho}</p>
                  <p className="mt-1 font-[var(--fonte-dados)] text-sm text-[var(--nevoa-fraca)] [font-variant-numeric:tabular-nums]">
                    {dia.km} km{dia.altimetria ? ` · +${dia.altimetria} m` : ''}
                    {dia.pousada ? ` · ${dia.pousada}` : ''}
                  </p>
                  {dia.descricao && <p className="mt-2 max-w-[var(--largura-conteudo)] text-[var(--nevoa)]">{dia.descricao}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {((saida.incluso && saida.incluso.length > 0) || (saida.naoIncluso && saida.naoIncluso.length > 0)) && (
        <section className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {saida.incluso && saida.incluso.length > 0 && (
            <div>
              <h2 className="font-[var(--fonte-display)] font-bold uppercase tracking-[0.08em] text-[var(--nevoa)]">
                Está incluso
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {saida.incluso.map((item) => (
                  <li key={item} className="text-[var(--nevoa)]">{item}</li>
                ))}
              </ul>
            </div>
          )}
          {saida.naoIncluso && saida.naoIncluso.length > 0 && (
            <div>
              <h2 className="font-[var(--fonte-display)] font-bold uppercase tracking-[0.08em] text-[var(--nevoa)]">
                Não está incluso
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {saida.naoIncluso.map((item) => (
                  <li key={item} className="text-[var(--nevoa-fraca)]">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {saida.galeria && saida.galeria.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[var(--fonte-display)] text-[var(--texto-2xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            Galeria
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {saida.galeria.map((foto, i) =>
              foto.asset ? (
                <li key={i} className="relative aspect-square overflow-hidden rounded-[var(--raio-m)]">
                  <Image
                    src={urlDaImagem(foto).width(400).height(400).url()}
                    alt={foto.alt}
                    fill
                    placeholder={foto.lqip ? 'blur' : undefined}
                    blurDataURL={foto.lqip ?? undefined}
                    className="object-cover"
                  />
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}

      {saida.depoimentos && saida.depoimentos.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[var(--fonte-display)] text-[var(--texto-2xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            Quem já foi nesta saída
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {saida.depoimentos.map((dep) => (
              <li key={dep._id} className="rounded-[var(--raio-m)] bg-[var(--azul-noite)] p-6">
                <p className="font-[var(--fonte-citacao)] italic text-[var(--nevoa)]">&ldquo;{dep.texto}&rdquo;</p>
                <p className="mt-3 font-[var(--fonte-dados)] text-sm text-[var(--nevoa-fraca)]">
                  {dep.nome}{dep.cidade ? ` · ${dep.cidade}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {saida.perguntas && saida.perguntas.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[var(--fonte-display)] text-[var(--texto-2xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            Dúvidas sobre esta saída
          </h2>
          <dl className="mt-6 flex flex-col gap-6">
            {saida.perguntas.map((p) => (
              <div key={p._id} className="border-t border-[color-mix(in_srgb,var(--dourado)_20%,transparent)] pt-4">
                <dt className="font-[var(--fonte-display)] font-bold text-[var(--nevoa)]">{p.pergunta}</dt>
                <dd className="mt-2 max-w-[var(--largura-conteudo)] text-[var(--nevoa-fraca)]">
                  {p.resposta && <PortableText value={p.resposta} />}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="mt-16 rounded-[var(--raio-m)] bg-[var(--azul-noite)] p-8 text-center">
        <h2 className="font-[var(--fonte-display)] text-[var(--texto-xl)] font-extrabold text-[var(--nevoa)]">
          Quer garantir sua vaga?
        </h2>
        <div className="mt-6 flex justify-center">
          <Botao href={linkReserva} variante="primario" comSeta>
            {textoDoBotao(status)}
          </Botao>
        </div>
      </section>
    </Container>
  );
}
