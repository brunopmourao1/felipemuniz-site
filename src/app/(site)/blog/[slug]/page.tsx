import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { buscar } from '@/sanity/client';
import { POST_POR_SLUG, SLUGS_POST } from '@/sanity/queries';
import type { POST_POR_SLUG_RESULT, SLUGS_POST_RESULT } from '@/sanity/types';
import { urlDaImagem } from '@/sanity/image';
import { jsonLdArtigo } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { CardSaida } from '@/components/saida/CardSaida';
import { CardPost } from '@/components/conteudo/CardPost';

export const revalidate = 3600;

const rotuloCategoria: Record<string, string> = {
  preparacao: 'Preparação',
  espiritualidade: 'Espiritualidade',
  roteiros: 'Roteiros',
  relatos: 'Relatos',
};

const componentesPortableText: PortableTextComponents = {
  types: {
    imagemComAlt: ({ value }) =>
      value?.asset ? (
        <span className="relative my-8 block aspect-[3/2] overflow-hidden rounded-[var(--raio-m)]">
          <Image
            src={urlDaImagem(value).width(1000).height(667).url()}
            alt={value.alt ?? ''}
            fill
            sizes="(min-width: 768px) 680px, 100vw"
            placeholder={value.lqip ? 'blur' : undefined}
            blurDataURL={value.lqip ?? undefined}
            className="object-cover"
          />
        </span>
      ) : null,
    destaque: ({ value }) =>
      value?.texto ? (
        <blockquote className="my-8 border-l-2 border-[var(--amarelo-seta)] py-2 pl-6 [font-family:var(--fonte-citacao)] italic text-[var(--nevoa)]">
          {value.texto}
        </blockquote>
      ) : null,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-[var(--amarelo-seta)] underline underline-offset-2"
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await buscar<SLUGS_POST_RESULT>(SLUGS_POST);
  return slugs.filter((s) => s.slug).map(({ slug }) => ({ slug: slug as string }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await buscar<POST_POR_SLUG_RESULT>(POST_POR_SLUG, { slug }, ['post']);
  if (!post) return {};
  return {
    title: post.seo?.titulo ?? post.titulo,
    description: post.seo?.descricao ?? post.resumo,
    robots: post.seo?.naoIndexar ? { index: false } : undefined,
  };
}

export default async function PaginaPost({ params }: Props) {
  const { slug } = await params;
  const post = await buscar<POST_POR_SLUG_RESULT>(POST_POR_SLUG, { slug }, ['post']);
  if (!post) notFound();

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArtigo(post)) }}
      />

      <Link href="/blog" className="text-sm text-[var(--nevoa-fraca)] hover:text-[var(--amarelo-seta)]">
        ← Voltar para o blog
      </Link>

      <header className="mt-6">
        {post.categoria && (
          <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
            {rotuloCategoria[post.categoria] ?? post.categoria}
          </p>
        )}
        <h1 className="mt-2 [font-family:var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
          {post.titulo}
        </h1>
        <p className="mt-2 [font-family:var(--fonte-dados)] text-sm text-[var(--nevoa-fraca)] [font-variant-numeric:tabular-nums]">
          {post.tempoLeitura} min de leitura
        </p>
      </header>

      {post.capa?.asset && (
        <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-[var(--raio-m)]">
          <Image
            src={urlDaImagem(post.capa).width(1200).height(800).url()}
            alt={post.capa.alt}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1200px) 1200px, 100vw"
            placeholder={post.capa.lqip ? 'blur' : undefined}
            blurDataURL={post.capa.lqip ?? undefined}
            className="object-cover"
          />
        </div>
      )}

      {post.corpo && (
        <div className="mt-8 max-w-[var(--largura-conteudo)] text-[var(--nevoa)] [&>h2]:mt-8 [&>h2]:[font-family:var(--fonte-display)] [&>h2]:text-xl [&>h2]:font-bold [&>h3]:mt-6 [&>h3]:[font-family:var(--fonte-display)] [&>h3]:font-bold [&>p]:mt-4">
          <PortableText value={post.corpo} components={componentesPortableText} />
        </div>
      )}

      {post.saidasRelacionadas && post.saidasRelacionadas.length > 0 && (
        <section className="mt-16">
          <h2 className="[font-family:var(--fonte-display)] text-[var(--texto-xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            Saídas relacionadas
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {post.saidasRelacionadas.map((saida) => (
              <li key={saida._id}>
                <CardSaida saida={saida} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {post.relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="[font-family:var(--fonte-display)] text-[var(--texto-xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            Leia também
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {post.relacionados.map((relacionado) => (
              <li key={relacionado._id}>
                <CardPost
                  post={{
                    _id: relacionado._id,
                    titulo: relacionado.titulo,
                    slug: relacionado.slug,
                    resumo: relacionado.resumo,
                    categoria: null,
                    publicadoEm: null,
                    capa: relacionado.capa,
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
