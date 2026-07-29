import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { buscar } from '@/sanity/client';
import {
  CONFIGURACAO,
  SAIDAS_HOME,
  QUEM_SOU,
  DEPOIMENTOS_HOME,
  POSTS_HOME,
  MATERIAL_PRINCIPAL,
  FAQ_HOME,
} from '@/sanity/queries';
import type {
  CONFIGURACAO_RESULT,
  SAIDAS_HOME_RESULT,
  QUEM_SOU_RESULT,
  DEPOIMENTOS_HOME_RESULT,
  POSTS_HOME_RESULT,
  MATERIAL_PRINCIPAL_RESULT,
  FAQ_HOME_RESULT,
} from '@/sanity/types';
import { urlDaImagem } from '@/sanity/image';
import { jsonLdFaq } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';
import { Acordeao } from '@/components/ui/Acordeao';
import { FormularioLead } from '@/components/ui/FormularioLead';
import { CardSaida } from '@/components/saida/CardSaida';
import { CardPost } from '@/components/conteudo/CardPost';
import { Credencial } from '@/components/credencial/Credencial';

export const revalidate = 3600;

const classeEyebrow =
  'font-[var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]';
const classeTituloSecao =
  'mt-2 font-[var(--fonte-display)] text-[var(--texto-2xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]';

const ETAPAS_COMO_FUNCIONA = [
  {
    numero: '01',
    titulo: 'Escolher a saída',
    texto: 'Veja as datas abertas, o ramal e o nível de exigência de cada uma.',
  },
  {
    numero: '02',
    titulo: 'Conversar com o Felipe',
    texto: 'Tire suas dúvidas direto no WhatsApp antes de decidir.',
  },
  {
    numero: '03',
    titulo: 'Preparar',
    texto: 'Receba orientação sobre equipamento e condicionamento físico.',
  },
  {
    numero: '04',
    titulo: 'Caminhar',
    texto: 'Chegue ao ponto de encontro e caminhe com o grupo até Aparecida.',
  },
];

export default async function PaginaInicial() {
  const [config, saidas, quemSou, depoimentos, posts, material, perguntas] = await Promise.all([
    buscar<CONFIGURACAO_RESULT>(CONFIGURACAO, {}, ['configuracao']),
    buscar<SAIDAS_HOME_RESULT>(SAIDAS_HOME, { limite: 3 }, ['saida']),
    buscar<QUEM_SOU_RESULT>(QUEM_SOU, {}, ['quemSou']),
    buscar<DEPOIMENTOS_HOME_RESULT>(DEPOIMENTOS_HOME, {}, ['depoimento']),
    buscar<POSTS_HOME_RESULT>(POSTS_HOME, {}, ['post']),
    buscar<MATERIAL_PRINCIPAL_RESULT>(MATERIAL_PRINCIPAL, {}, ['material']),
    buscar<FAQ_HOME_RESULT>(FAQ_HOME, {}, ['faq']),
  ]);

  const historiaResumo = (quemSou?.historia ?? []).filter(
    (bloco) => bloco._type === 'block'
  ).slice(0, 3);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        {config?.heroImagem?.asset && (
          <Image
            src={urlDaImagem(config.heroImagem).width(1920).height(1280).url()}
            alt={config.heroImagem.alt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
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
            {material?.slug && (
              <Botao href={`/materiais/${material.slug}`} variante="secundario">
                Receber o guia de preparação
              </Botao>
            )}
          </div>
        </Container>
      </section>

      {/* 2. Próximas saídas */}
      {saidas.length > 0 && (
        <section className="mt-24 md:mt-32">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={classeEyebrow}>Agenda</p>
                <h2 className={classeTituloSecao}>Próximas saídas</h2>
              </div>
              <Link
                href="/saidas"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]"
              >
                Ver todas
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {saidas.map((saida) => (
                <li key={saida._id}>
                  <CardSaida saida={saida} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* 3. Quem guia */}
      {quemSou && (
        <section className="mt-24 md:mt-32">
          <Container className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
            {quemSou.foto?.asset && (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--raio-m)]">
                <Image
                  src={urlDaImagem(quemSou.foto).width(800).height(1000).url()}
                  alt={quemSou.foto.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  placeholder={quemSou.foto.lqip ? 'blur' : undefined}
                  blurDataURL={quemSou.foto.lqip ?? undefined}
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className={classeEyebrow}>Quem guia</p>
              <h2 className={classeTituloSecao}>{quemSou.titulo}</h2>
              {historiaResumo.length > 0 && (
                <div className="mt-4 max-w-[var(--largura-conteudo)] text-[var(--nevoa)] [&>p+p]:mt-4">
                  <PortableText value={historiaResumo} />
                </div>
              )}
              {(config?.peregrinosGuiados || config?.saidasRealizadas || config?.anoInicio) && (
                <div className="mt-6 flex flex-wrap gap-8">
                  {config?.peregrinosGuiados != null && (
                    <div>
                      <p className="font-[var(--fonte-dados)] text-2xl font-bold text-[var(--dourado)] [font-variant-numeric:tabular-nums]">
                        {config.peregrinosGuiados}
                      </p>
                      <p className="text-sm text-[var(--nevoa-fraca)]">peregrinos guiados</p>
                    </div>
                  )}
                  {config?.saidasRealizadas != null && (
                    <div>
                      <p className="font-[var(--fonte-dados)] text-2xl font-bold text-[var(--dourado)] [font-variant-numeric:tabular-nums]">
                        {config.saidasRealizadas}
                      </p>
                      <p className="text-sm text-[var(--nevoa-fraca)]">saídas realizadas</p>
                    </div>
                  )}
                  {config?.anoInicio != null && (
                    <div>
                      <p className="font-[var(--fonte-dados)] text-2xl font-bold text-[var(--dourado)] [font-variant-numeric:tabular-nums]">
                        {config.anoInicio}
                      </p>
                      <p className="text-sm text-[var(--nevoa-fraca)]">guiando desde</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* 4. Como funciona */}
      <section className="mt-24 md:mt-32">
        <Container>
          <p className={classeEyebrow}>Como funciona</p>
          <h2 className={classeTituloSecao}>Do primeiro contato até Aparecida</h2>
          <ol className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPAS_COMO_FUNCIONA.map((etapa) => (
              <li key={etapa.numero} className="border-t border-[color-mix(in_srgb,var(--dourado)_30%,transparent)] pt-4">
                <span className="font-[var(--fonte-dados)] text-3xl font-bold text-[var(--dourado)] [font-variant-numeric:tabular-nums]">
                  {etapa.numero}
                </span>
                <h3 className="mt-2 font-[var(--fonte-display)] font-bold text-[var(--nevoa)]">{etapa.titulo}</h3>
                <p className="mt-1 text-sm text-[var(--nevoa-fraca)]">{etapa.texto}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 5. A Credencial */}
      {depoimentos.length > 0 && (
        <section className="mt-24 md:mt-32">
          <Container>
            <p className={classeEyebrow}>Prova social</p>
            <h2 className={classeTituloSecao}>Quem já caminhou com o Felipe</h2>
            <div className="mt-8">
              <Credencial
                depoimentos={depoimentos}
                peregrinosGuiados={config?.peregrinosGuiados}
                saidasRealizadas={config?.saidasRealizadas}
              />
            </div>
          </Container>
        </section>
      )}

      {/* 6. Preparação */}
      {posts.length > 0 && (
        <section className="mt-24 md:mt-32">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={classeEyebrow}>Preparação</p>
                <h2 className={classeTituloSecao}>Antes de caminhar, prepare-se</h2>
              </div>
              <Link
                href="/preparacao"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]"
              >
                Ver hub de preparação
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {posts.map((post) => (
                <li key={post._id}>
                  <CardPost post={post} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* 7. Captura */}
      {material && (
        <section className="mt-24 md:mt-32 bg-[var(--azul-noite)] py-16">
          <Container className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
            {material.capa?.asset && (
              <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--raio-m)]">
                <Image
                  src={urlDaImagem(material.capa).width(800).height(533).url()}
                  alt={material.capa.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  placeholder={material.capa.lqip ? 'blur' : undefined}
                  blurDataURL={material.capa.lqip ?? undefined}
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className={classeEyebrow}>Material gratuito</p>
              <h2 className={classeTituloSecao}>{material.titulo}</h2>
              {material.promessa && <p className="mt-4 text-[var(--nevoa-fraca)]">{material.promessa}</p>}
              <div className="mt-6">
                <FormularioLead
                  origem={material.slug ? `material:${material.slug}` : 'captura-home'}
                  materialSlug={material.slug ?? undefined}
                  textoBotao="Quero receber"
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 8. FAQ resumida */}
      {perguntas.length > 0 && (
        <section className="mt-24 pb-24 md:mt-32">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq(perguntas)) }}
          />
          <Container>
            <p className={classeEyebrow}>Dúvidas</p>
            <h2 className={classeTituloSecao}>Perguntas frequentes</h2>
            <div className="mt-8">
              <Acordeao itens={perguntas} />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
