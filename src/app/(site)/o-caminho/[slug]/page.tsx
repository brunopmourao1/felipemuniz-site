import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { buscar } from '@/sanity/client';
import { RAMAL_POR_SLUG, SLUGS_RAMAL } from '@/sanity/queries';
import type { RAMAL_POR_SLUG_RESULT, SLUGS_RAMAL_RESULT } from '@/sanity/types';
import { urlDaImagem } from '@/sanity/image';
import { Container } from '@/components/ui/Container';
import { CardSaida } from '@/components/saida/CardSaida';

export const revalidate = 3600;

const rotuloDificuldade: Record<string, string> = {
  leve: 'Leve',
  moderado: 'Moderado',
  exigente: 'Exigente',
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await buscar<SLUGS_RAMAL_RESULT>(SLUGS_RAMAL);
  return slugs.filter((s) => s.slug).map(({ slug }) => ({ slug: slug as string }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ramal = await buscar<RAMAL_POR_SLUG_RESULT>(RAMAL_POR_SLUG, { slug }, ['ramal']);
  if (!ramal) return {};
  return {
    title: ramal.seo?.titulo ?? `${ramal.nome} — Caminho da Fé`,
    description: ramal.seo?.descricao ?? `${ramal.nome}: ${ramal.km} km a partir de ${ramal.cidadeInicio}.`,
    robots: ramal.seo?.naoIndexar ? { index: false } : undefined,
  };
}

export default async function PaginaRamal({ params }: Props) {
  const { slug } = await params;
  const ramal = await buscar<RAMAL_POR_SLUG_RESULT>(RAMAL_POR_SLUG, { slug }, ['ramal']);
  if (!ramal) notFound();

  return (
    <Container className="py-16">
      <Link href="/o-caminho" className="text-sm text-[var(--nevoa-fraca)] hover:text-[var(--amarelo-seta)]">
        ← Voltar para o Caminho
      </Link>

      <header className="mt-6">
        <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
          Ramal
        </p>
        <h1 className="mt-2 font-[var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
          {ramal.nome}
        </h1>
        <p className="mt-2 font-[var(--fonte-dados)] text-sm text-[var(--nevoa-fraca)] [font-variant-numeric:tabular-nums]">
          {ramal.cidadeInicio}
          {ramal.km ? ` · ${ramal.km} km` : ''}
          {ramal.diasSugeridos ? ` · ${ramal.diasSugeridos} dias sugeridos` : ''}
          {ramal.dificuldade ? ` · ${rotuloDificuldade[ramal.dificuldade] ?? ramal.dificuldade}` : ''}
        </p>
      </header>

      {ramal.imagem?.asset && (
        <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-[var(--raio-m)] sm:aspect-[16/7]">
          <Image
            src={urlDaImagem(ramal.imagem).width(1400).height(613).url()}
            alt={ramal.imagem.alt}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1200px) 1200px, 100vw"
            placeholder={ramal.imagem.lqip ? 'blur' : undefined}
            blurDataURL={ramal.imagem.lqip ?? undefined}
            className="object-cover"
          />
        </div>
      )}

      {ramal.descricao && (
        <div className="mt-8 max-w-[var(--largura-conteudo)] text-[var(--nevoa)] [&>p+p]:mt-4">
          <PortableText value={ramal.descricao} />
        </div>
      )}

      {ramal.saidas.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[var(--fonte-display)] text-[var(--texto-xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            Próximas saídas por este ramal
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ramal.saidas.map((saida) => (
              <li key={saida._id}>
                <CardSaida saida={saida} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
