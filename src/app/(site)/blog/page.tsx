import { buscar } from '@/sanity/client';
import { POSTS } from '@/sanity/queries';
import type { POSTS_RESULT } from '@/sanity/types';
import { Container } from '@/components/ui/Container';
import { CardPost } from '@/components/conteudo/CardPost';

export const revalidate = 3600;

export const metadata = {
  title: 'Blog',
  description: 'Textos sobre preparação, espiritualidade e relatos do Caminho da Fé.',
};

export default async function PaginaBlog() {
  const posts = await buscar<POSTS_RESULT>(POSTS, { inicio: 0, fim: 30 }, ['post']);

  return (
    <Container className="py-16">
      <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Blog
      </p>
      <h1 className="mt-2 [font-family:var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        Textos sobre o Caminho da Fé
      </h1>

      {posts.length === 0 ? (
        <p className="mt-8 max-w-md text-[var(--nevoa-fraca)]">
          Ainda não publicamos nenhum texto. Volte em breve.
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
