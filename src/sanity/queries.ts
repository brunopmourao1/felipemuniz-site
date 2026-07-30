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
    heroTitulo, heroSubtitulo, heroCitacao,
    heroImagem ${IMAGEM},
    peregrinosGuiados, saidasRealizadas, anoInicio
  }
`;

/** Página "Quem sou" — usada também no bloco "Quem guia" da home. */
export const QUEM_SOU = groq`
  *[_type == "quemSou"][0]{
    titulo, credenciais,
    foto ${IMAGEM},
    historia[]{ ..., _type == "imagemComAlt" => ${IMAGEM} },
    ${SEO}
  }
`;

/** Depoimentos para o módulo Credencial na home. */
export const DEPOIMENTOS_HOME = groq`
  *[_type == "depoimento" && publicado == true]
  | order(destaque desc, _createdAt desc)[0...8]{
    _id, nome, cidade, texto,
    foto ${IMAGEM},
    saida->{ dataInicio, ramal->{ nome } }
  }
`;

/** As 5 perguntas mais frequentes, para o acordeão da home. */
export const FAQ_HOME = groq`
  *[_type == "faq" && naHome == true] | order(ordem asc)[0...5]{
    _id, pergunta, resposta,
    "respostaTexto": pt::text(resposta)
  }
`;

/** Material principal, usado na faixa de captura da home. */
export const MATERIAL_PRINCIPAL = groq`
  *[_type == "material" && ativo == true] | order(_createdAt asc)[0]{
    titulo, "slug": slug.current, promessa, capa ${IMAGEM}
  }
`;

/** Landing de captura de um material específico. */
export const MATERIAL_POR_SLUG = groq`
  *[_type == "material" && slug.current == $slug && ativo == true][0]{
    _id, titulo, "slug": slug.current, promessa, topicos,
    capa ${IMAGEM},
    "arquivoUrl": arquivo.asset->url,
    ${SEO}
  }
`;

/** Os 3 conteúdos de preparação mais fortes, para o bloco da home. */
export const POSTS_HOME = groq`
  *[_type == "post" && categoria == "preparacao" && publicadoEm <= now()]
  | order(publicadoEm desc)[0...3]{
    _id, titulo, "slug": slug.current, resumo, categoria, publicadoEm,
    capa ${IMAGEM}
  }
`;

export const POSTS = groq`
  *[_type == "post" && publicadoEm <= now()]
  | order(publicadoEm desc)[$inicio...$fim]{
    _id, titulo, "slug": slug.current, resumo, categoria, publicadoEm,
    capa ${IMAGEM}
  }
`;

export const TOTAL_POSTS = groq`count(*[_type == "post" && publicadoEm <= now()])`;

export const POST_POR_SLUG = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    capa ${IMAGEM},
    corpo[]{
      ...,
      _type == "imagemComAlt" => ${IMAGEM},
      markDefs[]{ ..., _type == "link" => { href } }
    },
    saidasRelacionadas[]-> ${CARTAO_SAIDA},
    ${SEO},
    "relacionados": *[_type == "post" && categoria == ^.categoria
                      && _id != ^._id] | order(publicadoEm desc)[0...3]{
      _id, titulo, "slug": slug.current, resumo, capa ${IMAGEM}
    },
    "tempoLeitura": round(length(pt::text(corpo)) / 5 / 200)
  }
`;

/** Slugs para generateStaticParams. */
export const SLUGS_POST = groq`
  *[_type == "post" && defined(slug.current)][]{ "slug": slug.current }
`;

/** Posts de uma categoria específica, para /blog/categoria/[slug]. */
export const POSTS_POR_CATEGORIA = groq`
  *[_type == "post" && categoria == $categoria && publicadoEm <= now()]
  | order(publicadoEm desc){
    _id, titulo, "slug": slug.current, resumo, categoria, publicadoEm,
    capa ${IMAGEM}
  }
`;

/** Todos os depoimentos publicados, para a página /depoimentos. */
export const DEPOIMENTOS = groq`
  *[_type == "depoimento" && publicado == true] | order(_createdAt desc){
    _id, nome, cidade, texto, videoUrl,
    foto ${IMAGEM},
    saida->{ titulo, "slug": slug.current, dataInicio, ramal->{ nome } }
  }
`;

/** FAQ completa, agrupada por categoria na página /perguntas-frequentes. */
export const FAQ_COMPLETA = groq`
  *[_type == "faq"] | order(ordem asc){
    _id, pergunta, resposta, categoria,
    "respostaTexto": pt::text(resposta)
  }
`;

/** Todos os ramais, para o hub /o-caminho. */
export const RAMAIS = groq`
  *[_type == "ramal"] | order(km asc){
    _id, nome, "slug": slug.current, cidadeInicio, km,
    diasSugeridos, dificuldade, imagem ${IMAGEM}
  }
`;

/** Página de um ramal específico. */
export const RAMAL_POR_SLUG = groq`
  *[_type == "ramal" && slug.current == $slug][0]{
    _id, nome, "slug": slug.current, cidadeInicio, km,
    diasSugeridos, dificuldade,
    descricao[]{ ..., _type == "imagemComAlt" => ${IMAGEM} },
    imagem ${IMAGEM},
    ${SEO},
    "saidas": *[_type == "saida" && references(^._id) && dataFim >= now()]
      | order(dataInicio asc) ${CARTAO_SAIDA}
  }
`;

/** Slugs para generateStaticParams. */
export const SLUGS_RAMAL = groq`
  *[_type == "ramal" && defined(slug.current)][]{ "slug": slug.current }
`;

/** Tudo que entra no sitemap. Grupos ficam de fora de propósito. */
export const SITEMAP = groq`{
  "saidas": *[_type == "saida" && defined(slug.current)]{
    "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current) && publicadoEm <= now()]{
    "slug": slug.current, _updatedAt },
  "ramais": *[_type == "ramal" && defined(slug.current)]{
    "slug": slug.current, _updatedAt },
  "materiais": *[_type == "material" && ativo == true && defined(slug.current)]{
    "slug": slug.current, _updatedAt }
}`;
