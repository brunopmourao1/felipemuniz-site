import Image from 'next/image';
import { buscar } from '@/sanity/client';
import { CONFIGURACAO } from '@/sanity/queries';
import type { CONFIGURACAO_RESULT } from '@/sanity/types';
import { urlDaImagem } from '@/sanity/image';
import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';

export const revalidate = 3600;

export default async function PaginaInicial() {
  const config = await buscar<CONFIGURACAO_RESULT>(CONFIGURACAO, {}, ['configuracao']);

  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden">
      {config?.heroImagem?.asset && (
        <Image
          src={urlDaImagem(config.heroImagem).width(1920).height(1280).url()}
          alt={config.heroImagem.alt}
          fill
          priority
          placeholder={config.heroImagem.lqip ? 'blur' : undefined}
          blurDataURL={config.heroImagem.lqip ?? undefined}
          className="object-cover"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--azul-profundo) 0%, color-mix(in srgb, var(--azul-profundo) 40%, transparent) 70%, transparent 100%)',
        }}
      />
      <Container className="relative py-16">
        <h1 className="max-w-2xl font-[var(--fonte-display)] text-[var(--texto-4xl)] font-extrabold leading-[0.95] tracking-[-0.02em] text-[var(--nevoa)]">
          {config?.heroTitulo ?? 'Caminhe o Caminho da Fé com quem conhece cada passo'}
        </h1>
        {config?.heroSubtitulo && (
          <p className="mt-4 max-w-xl text-[var(--texto-lg)] text-[var(--nevoa-fraca)]">
            {config.heroSubtitulo}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <Botao href="/saidas" variante="primario" comSeta>
            Ver próximas saídas
          </Botao>
        </div>
      </Container>
    </section>
  );
}
