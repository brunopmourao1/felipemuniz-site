import Image from 'next/image';
import Link from 'next/link';
import { buscar } from '@/sanity/client';
import { DEPOIMENTOS } from '@/sanity/queries';
import type { DEPOIMENTOS_RESULT } from '@/sanity/types';
import { urlDaImagem } from '@/sanity/image';
import { formatarData } from '@/lib/datas';
import { Container } from '@/components/ui/Container';
import { VideoDepoimento } from '@/components/conteudo/VideoDepoimento';

export const revalidate = 3600;

export const metadata = {
  title: 'Depoimentos',
  description: 'Relatos de quem já caminhou o Caminho da Fé com o guia Felipe Muniz.',
};

export default async function PaginaDepoimentos() {
  const depoimentos = await buscar<DEPOIMENTOS_RESULT>(DEPOIMENTOS, {}, ['depoimento']);

  return (
    <Container className="py-16">
      <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Prova social
      </p>
      <h1 className="mt-2 max-w-2xl [font-family:var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        Quem já caminhou com o Felipe
      </h1>

      {depoimentos.length === 0 ? (
        <p className="mt-10 max-w-md text-[var(--nevoa-fraca)]">
          Ainda não publicamos nenhum depoimento. Volte em breve.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {depoimentos.map((dep) => (
            <li key={dep._id} className="flex flex-col gap-4 rounded-[var(--raio-m)] bg-[var(--azul-noite)] p-6">
              <div className="flex items-center gap-3">
                {dep.foto?.asset && (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[var(--raio-m)]">
                    <Image
                      src={urlDaImagem(dep.foto).width(96).height(96).url()}
                      alt={dep.foto.alt}
                      fill
                      sizes="48px"
                      placeholder={dep.foto.lqip ? 'blur' : undefined}
                      blurDataURL={dep.foto.lqip ?? undefined}
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="[font-family:var(--fonte-display)] font-bold text-[var(--nevoa)]">{dep.nome}</p>
                  {dep.cidade && <p className="text-sm text-[var(--nevoa-fraca)]">{dep.cidade}</p>}
                </div>
              </div>

              {dep.texto && (
                <p className="[font-family:var(--fonte-citacao)] italic text-[var(--nevoa)]">&ldquo;{dep.texto}&rdquo;</p>
              )}

              {dep.videoUrl && <VideoDepoimento url={dep.videoUrl} />}

              {dep.saida?.slug && (
                <Link
                  href={`/saidas/${dep.saida.slug}`}
                  className="mt-auto text-sm text-[var(--dourado)] hover:text-[var(--amarelo-seta)]"
                >
                  {dep.saida.titulo}
                  {dep.saida.dataInicio ? ` · ${formatarData(dep.saida.dataInicio)}` : ''}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
