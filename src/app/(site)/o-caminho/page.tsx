import Image from 'next/image';
import Link from 'next/link';
import { buscar } from '@/sanity/client';
import { RAMAIS } from '@/sanity/queries';
import type { RAMAIS_RESULT } from '@/sanity/types';
import { urlDaImagem } from '@/sanity/image';
import { Container } from '@/components/ui/Container';

export const revalidate = 3600;

export const metadata = {
  title: 'O Caminho da Fé',
  description:
    'O que é o Caminho da Fé, entre Águas da Prata e Aparecida: ramais, distâncias e quando ir.',
};

const rotuloDificuldade: Record<string, string> = {
  leve: 'Leve',
  moderado: 'Moderado',
  exigente: 'Exigente',
};

export default async function PaginaOCaminho() {
  const ramais = await buscar<RAMAIS_RESULT>(RAMAIS, {}, ['ramal']);

  return (
    <Container className="py-16">
      <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        O Caminho
      </p>
      <h1 className="mt-2 max-w-2xl [font-family:var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        O que é o Caminho da Fé
      </h1>
      <div className="mt-4 max-w-[var(--largura-conteudo)] text-[var(--nevoa-fraca)]">
        <p>
          O Caminho da Fé é uma rota de peregrinação que liga o interior de São Paulo e Minas
          Gerais ao Santuário Nacional de Aparecida. Inspirado no Caminho de Santiago, é
          percorrido a pé, em etapas diárias, com pousadas e credencial carimbada em cada trecho.
        </p>
        <p className="mt-4">
          Não é uma trilha única: existem vários ramais, com pontos de partida, distâncias e
          níveis de exigência diferentes. Todos chegam ao mesmo lugar — a Basílica de Aparecida —
          por caminhos diferentes.
        </p>
      </div>

      {ramais.length === 0 ? (
        <p className="mt-10 max-w-md text-[var(--nevoa-fraca)]">
          Ainda não cadastramos nenhum ramal. Volte em breve.
        </p>
      ) : (
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {ramais.map((ramal) =>
            ramal.slug ? (
              <li key={ramal._id}>
                <Link
                  href={`/o-caminho/${ramal.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[var(--raio-m)] bg-[var(--azul-noite)]"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    {ramal.imagem?.asset && (
                      <Image
                        src={urlDaImagem(ramal.imagem).width(800).height(533).url()}
                        alt={ramal.imagem.alt}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        placeholder={ramal.imagem.lqip ? 'blur' : undefined}
                        blurDataURL={ramal.imagem.lqip ?? undefined}
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h2 className="[font-family:var(--fonte-display)] text-lg font-bold text-[var(--nevoa)]">
                      {ramal.nome}
                    </h2>
                    <p className="[font-family:var(--fonte-dados)] text-sm text-[var(--nevoa-fraca)] [font-variant-numeric:tabular-nums]">
                      {ramal.cidadeInicio}
                      {ramal.km ? ` · ${ramal.km} km` : ''}
                      {ramal.diasSugeridos ? ` · ${ramal.diasSugeridos} dias` : ''}
                    </p>
                    {ramal.dificuldade && (
                      <p className="text-sm text-[var(--nevoa-fraca)]">
                        Nível {rotuloDificuldade[ramal.dificuldade] ?? ramal.dificuldade}
                      </p>
                    )}
                    <span className="group mt-auto inline-flex items-center gap-2 pt-2 text-sm font-bold text-[var(--nevoa)] group-hover:text-[var(--amarelo-seta)]">
                      Conhecer o ramal
                      <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ) : null
          )}
        </ul>
      )}
    </Container>
  );
}
