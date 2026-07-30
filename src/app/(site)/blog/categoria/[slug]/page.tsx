import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buscar } from '@/sanity/client';
import { POSTS_POR_CATEGORIA } from '@/sanity/queries';
import type { POSTS_POR_CATEGORIA_RESULT } from '@/sanity/types';
import { Container } from '@/components/ui/Container';
import { CardPost } from '@/components/conteudo/CardPost';

export const revalidate = 3600;

const CATEGORIAS = {
  preparacao: 'Preparação',
  espiritualidade: 'Espiritualidade',
  roteiros: 'Roteiros',
  relatos: 'Relatos',
} as const;

type Categoria = keyof typeof CATEGORIAS;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(CATEGORIAS).map((slug) => ({ slug }));
}

function ehCategoriaValida(slug: string): slug is Categoria {
  return slug in CATEGORIAS;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!ehCategoriaValida(slug)) return {};
  return {
    title: `${CATEGORIAS[slug]} — Blog`,
    description: `Textos sobre ${CATEGORIAS[slug].toLowerCase()} para quem vai caminhar o Caminho da Fé.`,
  };
}

export default async function PaginaCategoria({ params }: Props) {
  const { slug } = await params;
  if (!ehCategoriaValida(slug)) notFound();

  const posts = await buscar<POSTS_POR_CATEGORIA_RESULT>(
    POSTS_POR_CATEGORIA,
    { categoria: slug },
    ['post']
  );

  return (
    <Container className="py-16">
      <Link href="/blog" className="text-sm text-[var(--nevoa-fraca)] hover:text-[var(--amarelo-seta)]">
        ← Voltar para o blog
      </Link>

      <p className="mt-6 [font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Categoria
      </p>
      <h1 className="mt-2 [font-family:var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        {CATEGORIAS[slug]}
      </h1>

      {posts.length === 0 ? (
        <p className="mt-8 max-w-md text-[var(--nevoa-fraca)]">
          Ainda não publicamos nenhum texto nessa categoria. Volte em breve.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post._id}>
              <CardPost post={post} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
