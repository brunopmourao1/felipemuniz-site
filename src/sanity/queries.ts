import { groq } from 'next-sanity';

const IMAGEM = groq`{
  ...,
  "alt": coalesce(alt, ""),
  "lqip": asset->metadata.lqip,
  "dimensoes": asset->metadata.dimensions
}`;

const SEO = groq`seo{
  titulo, descricao, naoIndexar,
  imagem { ..., "lqip": asset->metadata.lqip }
}`;

const CARTAO_SAIDA = groq`{
  _id,
  titulo,
  "slug": slug.current,
  dataInicio,
  dataFim,
  cidadeSaida,
  resumo,
  distanciaKm,
  nivel,
  vagasTotal,
  vagasDisponiveis,
  valor,
  destaque,
  imagemCapa ${IMAGEM},
  ramal->{ nome, "slug": slug.current, km }
}`;

/** Próximas saídas, da mais próxima para a mais distante. */
export const PROXIMAS_SAIDAS = groq`
  *[_type == "saida" && dataFim >= now()]
  | order(dataInicio asc) ${CARTAO_SAIDA}
`;

/** Até N saídas para a home; prioriza as marcadas como destaque. */
export const SAIDAS_HOME = groq`
  *[_type == "saida" && dataFim >= now()]
  | order(destaque desc, dataInicio asc)[0...$limite] ${CARTAO_SAIDA}
`;

/** Saídas já realizadas, para prova social. */
export const SAIDAS_REALIZADAS = groq`
  *[_type == "saida" && dataFim < now()]
  | order(dataInicio desc) ${CARTAO_SAIDA}
`;

/** Página completa de uma saída, com depoimentos e FAQ embutidos. */
export const SAIDA_POR_SLUG = groq`
  *[_type == "saida" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    imagemCapa ${IMAGEM},
    galeria[] ${IMAGEM},
    ramal->{ nome, "slug": slug.current, km, dificuldade, cidadeInicio },
    roteiro[]{ dia, trecho, km, altimetria, pousada, descricao },
    incluso,
    naoIncluso,
    ${SEO},
    "depoimentos": *[_type == "depoimento" && publicado == true
                     && references(^._id)] | order(_createdAt desc){
      _id, nome, cidade, texto, videoUrl, foto ${IMAGEM}
    },
    "perguntas": *[_type == "faq" && categoria in ["decisao", "valores"]]
                 | order(ordem asc)[0...6]{ _id, pergunta, resposta }
  }
`;

/** Slugs para generateStaticParams. */
export const SLUGS_SAIDA = groq`
  *[_type == "saida" && defined(slug.current)][]{ "slug": slug.current }
`;

/** Página privada do grupo. */
export const GRUPO_POR_SLUG = groq`
  *[_type == "saida" && slugGrupo.current == $slug][0]{
    titulo, dataInicio, dataFim, cidadeSaida, distanciaKm,
    roteiro[]{ dia, trecho, km, altimetria, pousada, descricao },
    orientacoesGrupo,
    incluso, naoIncluso,
    ramal->{ nome, km }
  }
`;

/** Configurações do site — usado no cabeçalho, rodapé e home. */
export const CONFIGURACAO = groq`
  *[_type == "configuracao"][0]{
    whatsapp, email, instagram,
    heroTitulo, heroSubtitulo,
    heroImagem ${IMAGEM},
    peregrinosGuiados, saidasRealizadas, anoInicio
  }
`;
