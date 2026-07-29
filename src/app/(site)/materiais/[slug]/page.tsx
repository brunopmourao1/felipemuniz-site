import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { buscar } from '@/sanity/client';
import { MATERIAL_POR_SLUG } from '@/sanity/queries';
import type { MATERIAL_POR_SLUG_RESULT } from '@/sanity/types';
import { urlDaImagem } from '@/sanity/image';
import { Container } from '@/components/ui/Container';
import { FormularioLead } from '@/components/ui/FormularioLead';

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const material = await buscar<MATERIAL_POR_SLUG_RESULT>(MATERIAL_POR_SLUG, { slug }, ['material']);
  if (!material) return {};
  return {
    title: material.seo?.titulo ?? material.titulo ?? undefined,
    description: material.seo?.descricao ?? material.promessa ?? undefined,
    robots: material.seo?.naoIndexar ? { index: false } : undefined,
  };
}

export default async function PaginaMaterial({ params }: Props) {
  const { slug } = await params;
  const material = await buscar<MATERIAL_POR_SLUG_RESULT>(MATERIAL_POR_SLUG, { slug }, ['material']);
  if (!material) notFound();

  return (
    <Container className="py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
        <div>
          {material.capa?.asset && (
            <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--raio-m)]">
              <Image
                src={urlDaImagem(material.capa).width(900).height(600).url()}
                alt={material.capa.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder={material.capa.lqip ? 'blur' : undefined}
                blurDataURL={material.capa.lqip ?? undefined}
                className="object-cover"
              />
            </div>
          )}

          <h1 className="mt-6 font-[var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            {material.titulo}
          </h1>
          {material.promessa && (
            <p className="mt-4 max-w-[var(--largura-conteudo)] text-[var(--texto-lg)] text-[var(--nevoa-fraca)]">
              {material.promessa}
            </p>
          )}

          {material.topicos && material.topicos.length > 0 && (
            <ul className="mt-6 flex flex-col gap-2">
              {material.topicos.map((topico) => (
                <li key={topico} className="flex items-start gap-2 text-[var(--nevoa)]">
                  <span aria-hidden="true" className="text-[var(--amarelo-seta)]">
                    →
                  </span>
                  {topico}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[var(--raio-m)] bg-[var(--azul-noite)] p-8">
          <h2 className="font-[var(--fonte-display)] text-lg font-bold text-[var(--nevoa)]">
            Receba grátis por e-mail
          </h2>
          <div className="mt-6">
            <FormularioLead
              origem={`material:${material.slug ?? slug}`}
              materialSlug={material.slug ?? slug}
              textoBotao="Quero receber"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
