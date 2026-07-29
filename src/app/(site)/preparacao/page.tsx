import { buscar } from '@/sanity/client';
import { POSTS } from '@/sanity/queries';
import type { POSTS_RESULT } from '@/sanity/types';
import { Container } from '@/components/ui/Container';
import { CardPost } from '@/components/conteudo/CardPost';

export const revalidate = 3600;

export const metadata = {
  title: 'Preparação para o Caminho da Fé',
  description:
    'Tudo o que você precisa saber antes de caminhar: o que levar, como treinar e o que esperar do trajeto.',
};

export default async function PaginaPreparacao() {
  const posts = await buscar<POSTS_RESULT>(POSTS, { inicio: 0, fim: 30 }, ['post']);
  const preparacao = posts.filter((post) => post.categoria === 'preparacao');
  const exibidos = preparacao.length > 0 ? preparacao : posts;

  return (
    <Container className="py-16">
      <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Preparação
      </p>
      <h1 className="mt-2 max-w-2xl font-[var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        Antes de caminhar, prepare-se de verdade
      </h1>
      <p className="mt-4 max-w-[var(--largura-conteudo)] text-[var(--nevoa-fraca)]">
        O que levar na mochila, como treinar o corpo e o que esperar de cada trecho — direto de
        quem já guiou o Caminho da Fé dezenas de vezes.
      </p>

      {exibidos.length === 0 ? (
        <p className="mt-10 max-w-md text-[var(--nevoa-fraca)]">
          Ainda não publicamos nenhum texto de preparação. Volte em breve.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exibidos.map((post) => (
            <li key={post._id}>
              <CardPost post={post} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
