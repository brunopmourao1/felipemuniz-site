import Image from 'next/image';
import type { Metadata } from 'next';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { buscar } from '@/sanity/client';
import { QUEM_SOU, CONFIGURACAO } from '@/sanity/queries';
import type { QUEM_SOU_RESULT, CONFIGURACAO_RESULT } from '@/sanity/types';
import { urlDaImagem } from '@/sanity/image';
import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';
import { linkDoWhatsapp, mensagemGeral } from '@/lib/whatsapp';

export const revalidate = 3600;

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
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const quemSou = await buscar<QUEM_SOU_RESULT>(QUEM_SOU, {}, ['quemSou']);
  if (!quemSou) return {};
  return {
    title: quemSou.seo?.titulo ?? quemSou.titulo ?? 'Quem sou',
    description:
      quemSou.seo?.descricao ??
      'A história de Felipe Muniz, guia do Caminho da Fé entre Águas da Prata e Aparecida.',
    robots: quemSou.seo?.naoIndexar ? { index: false } : undefined,
  };
}

export default async function PaginaQuemSou() {
  const [quemSou, config] = await Promise.all([
    buscar<QUEM_SOU_RESULT>(QUEM_SOU, {}, ['quemSou']),
    buscar<CONFIGURACAO_RESULT>(CONFIGURACAO, {}, ['configuracao']),
  ]);

  const whatsapp = config?.whatsapp ?? process.env.NEXT_PUBLIC_WHATSAPP ?? '';

  return (
    <Container className="py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
        <div>
          {quemSou?.foto?.asset && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--raio-m)]">
              <Image
                src={urlDaImagem(quemSou.foto).width(900).height(1125).url()}
                alt={quemSou.foto.alt}
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder={quemSou.foto.lqip ? 'blur' : undefined}
                blurDataURL={quemSou.foto.lqip ?? undefined}
                className="object-cover"
              />
            </div>
          )}

          {quemSou?.credenciais && quemSou.credenciais.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {quemSou.credenciais.map((credencial) => (
                <li
                  key={credencial}
                  className="rounded-[var(--raio-p)] border border-[var(--dourado)] px-3 py-1 font-[var(--fonte-dados)] text-xs uppercase tracking-[0.05em] text-[var(--nevoa)]"
                >
                  {credencial}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
            Quem sou
          </p>
          <h1 className="mt-2 font-[var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            {quemSou?.titulo ?? 'Quem caminha com você'}
          </h1>

          {quemSou?.historia && (
            <div className="mt-6 max-w-[var(--largura-conteudo)] text-[var(--nevoa)] [&>p+p]:mt-4">
              <PortableText value={quemSou.historia} components={componentesPortableText} />
            </div>
          )}

          <div className="mt-10">
            <Botao href={linkDoWhatsapp(whatsapp, mensagemGeral())} variante="primario" comSeta>
              Falar com o Felipe
            </Botao>
          </div>
        </div>
      </div>
    </Container>
  );
}
