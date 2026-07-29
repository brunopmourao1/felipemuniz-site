import Image from 'next/image';
import Link from 'next/link';
import { urlDaImagem } from '@/sanity/image';
import type { POSTS_HOME_RESULT } from '@/sanity/types';

type Post = POSTS_HOME_RESULT[number];

const rotuloCategoria: Record<string, string> = {
  preparacao: 'Preparação',
  espiritualidade: 'Espiritualidade',
  roteiros: 'Roteiros',
  relatos: 'Relatos',
};

export function CardPost({ post }: { post: Post }) {
  if (!post.slug) return null;

  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--raio-m)] bg-[var(--azul-noite)]">
      <div className="relative aspect-[3/2] overflow-hidden">
        {post.capa?.asset && (
          <Image
            src={urlDaImagem(post.capa).width(600).height(400).url()}
            alt={post.capa.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            placeholder={post.capa.lqip ? 'blur' : undefined}
            blurDataURL={post.capa.lqip ?? undefined}
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {post.categoria && (
          <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.1em] text-[var(--dourado)]">
            {rotuloCategoria[post.categoria] ?? post.categoria}
          </p>
        )}
        <h3 className="font-[var(--fonte-display)] text-lg font-bold text-[var(--nevoa)]">{post.titulo}</h3>
        {post.resumo && <p className="text-sm text-[var(--nevoa-fraca)]">{post.resumo}</p>}
        <Link
          href={`/blog/${post.slug}`}
          className="group mt-auto inline-flex items-center gap-2 pt-2 text-sm font-bold text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]"
        >
          Ler
          <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
