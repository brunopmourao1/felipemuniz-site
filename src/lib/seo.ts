import { urlDaImagem } from '@/sanity/image';
import type {
  CONFIGURACAO_RESULT,
  SAIDA_POR_SLUG_RESULT,
  FAQ_COMPLETA_RESULT,
  FAQ_HOME_RESULT,
  POST_POR_SLUG_RESULT,
} from '@/sanity/types';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Aplicado no layout do site, em todas as páginas públicas. */
export function jsonLdOrganizacao(config: CONFIGURACAO_RESULT) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE}/#negocio`,
    name: 'Felipe Muniz — Guia do Caminho da Fé',
    description:
      'Guia credenciado que conduz grupos de peregrinos no Caminho da Fé, entre Águas da Prata e Aparecida.',
    url: SITE,
    telephone: config?.whatsapp ? `+${config.whatsapp}` : undefined,
    email: config?.email ?? undefined,
    areaServed: [
      { '@type': 'State', name: 'São Paulo' },
      { '@type': 'State', name: 'Minas Gerais' },
    ],
    sameAs: [config?.instagram].filter(Boolean),
  };
}

/** Página da saída. TouristTrip é o tipo correto — não Event nem Product. */
export function jsonLdSaida(saida: NonNullable<SAIDA_POR_SLUG_RESULT>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: saida.titulo,
    description: saida.resumo,
    url: `${SITE}/saidas/${saida.slug}`,
    touristType: 'Peregrinos',
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: saida.roteiro?.length ?? 0,
      itemListElement: (saida.roteiro ?? []).map((dia) => ({
        '@type': 'ListItem',
        position: dia.dia,
        item: { '@type': 'TouristDestination', name: dia.trecho },
      })),
    },
    provider: { '@id': `${SITE}/#negocio` },
    ...(saida.valor && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        availability:
          (saida.vagasDisponiveis ?? 0) > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/SoldOut',
        validThrough: saida.dataInicio,
        url: `${SITE}/saidas/${saida.slug}`,
      },
    }),
  };
}

/** Página de FAQ. Rende resultado expandido no Google. */
export function jsonLdFaq(perguntas: FAQ_COMPLETA_RESULT | FAQ_HOME_RESULT) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: perguntas
      .filter((p) => p.pergunta && p.respostaTexto)
      .map((p) => ({
        '@type': 'Question',
        name: p.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: p.respostaTexto },
      })),
  };
}

/** Post do blog. */
export function jsonLdArtigo(post: NonNullable<POST_POR_SLUG_RESULT>) {
  const imagemUrl = post.capa?.asset
    ? urlDaImagem(post.capa).width(1200).height(630).url()
    : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titulo,
    description: post.resumo,
    image: imagemUrl,
    datePublished: post.publicadoEm,
    dateModified: post._updatedAt,
    author: { '@type': 'Person', name: 'Felipe Muniz', url: `${SITE}/quem-sou` },
    publisher: { '@id': `${SITE}/#negocio` },
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
  };
}
