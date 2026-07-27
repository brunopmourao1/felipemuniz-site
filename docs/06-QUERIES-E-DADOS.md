# 06 — Queries GROQ e camada de dados

Todas as queries centralizadas em `src/sanity/queries.ts`. Regra: nenhum componente escreve GROQ inline. Query espalhada pelo código é query que ninguém encontra quando o schema muda.

---

## 1. Fragmentos reutilizáveis

```ts
// src/sanity/queries.ts
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
```

---

## 2. Saídas

```ts
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
```

**Sobre `references(^._id)`:** o `^` sobe um nível no escopo. Dentro da projeção da saída, ele aponta para a própria saída — é assim que os depoimentos daquela saída específica vêm na mesma requisição, sem uma segunda ida ao servidor.

---

## 3. Blog e conteúdo

```ts
export const POSTS = groq`
  *[_type == "post" && publicadoEm <= now()]
  | order(publicadoEm desc)[$inicio...$fim]{
    _id, titulo, "slug": slug.current, resumo, categoria, publicadoEm,
    capa ${IMAGEM}
  }
`;

export const TOTAL_POSTS = groq`count(*[_type == "post" && publicadoEm <= now()])`;

export const POSTS_POR_CATEGORIA = groq`
  *[_type == "post" && categoria == $categoria && publicadoEm <= now()]
  | order(publicadoEm desc){
    _id, titulo, "slug": slug.current, resumo, categoria, publicadoEm,
    capa ${IMAGEM}
  }
`;

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

export const SLUGS_POST = groq`
  *[_type == "post" && defined(slug.current)][]{ "slug": slug.current }
`;
```

`pt::text()` extrai o texto puro do Portable Text. Dividido por 5 dá a contagem aproximada de palavras; por 200, os minutos de leitura. Calculado no servidor, sem custo no cliente.

---

## 4. Depoimentos, FAQ, materiais

```ts
export const DEPOIMENTOS = groq`
  *[_type == "depoimento" && publicado == true] | order(_createdAt desc){
    _id, nome, cidade, texto, videoUrl,
    foto ${IMAGEM},
    saida->{ titulo, "slug": slug.current, dataInicio,
             ramal->{ nome } }
  }
`;

export const DEPOIMENTOS_HOME = groq`
  *[_type == "depoimento" && publicado == true]
  | order(destaque desc, _createdAt desc)[0...8]{
    _id, nome, cidade, texto,
    foto ${IMAGEM},
    saida->{ dataInicio, ramal->{ nome } }
  }
`;

export const FAQ_COMPLETA = groq`
  *[_type == "faq"] | order(ordem asc){
    _id, pergunta, resposta, categoria
  }
`;

export const FAQ_HOME = groq`
  *[_type == "faq" && naHome == true] | order(ordem asc)[0...5]{
    _id, pergunta, resposta
  }
`;

export const MATERIAL_POR_SLUG = groq`
  *[_type == "material" && slug.current == $slug && ativo == true][0]{
    _id, titulo, "slug": slug.current, promessa, topicos,
    capa ${IMAGEM},
    "arquivoUrl": arquivo.asset->url,
    ${SEO}
  }
`;

export const MATERIAL_PRINCIPAL = groq`
  *[_type == "material" && ativo == true] | order(_createdAt asc)[0]{
    titulo, "slug": slug.current, promessa, capa ${IMAGEM}
  }
`;
```

---

## 5. Configuração e páginas fixas

```ts
export const CONFIGURACAO = groq`
  *[_type == "configuracao"][0]{
    whatsapp, email, instagram,
    heroTitulo, heroSubtitulo,
    heroImagem ${IMAGEM},
    peregrinosGuiados, saidasRealizadas, anoInicio
  }
`;

export const QUEM_SOU = groq`
  *[_type == "quemSou"][0]{
    titulo, credenciais,
    foto ${IMAGEM},
    historia[]{ ..., _type == "imagemComAlt" => ${IMAGEM} },
    ${SEO}
  }
`;

export const RAMAIS = groq`
  *[_type == "ramal"] | order(km asc){
    _id, nome, "slug": slug.current, cidadeInicio, km,
    diasSugeridos, dificuldade, imagem ${IMAGEM}
  }
`;

/** Tudo que entra no sitemap. Grupos ficam de fora de propósito. */
export const SITEMAP = groq`{
  "saidas": *[_type == "saida" && defined(slug.current)]{
    "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current) && publicadoEm <= now()]{
    "slug": slug.current, _updatedAt },
  "ramais": *[_type == "ramal" && defined(slug.current)]{
    "slug": slug.current, _updatedAt },
  "materiais": *[_type == "material" && ativo == true]{
    "slug": slug.current, _updatedAt }
}`;
```

---

## 6. Uso nas páginas

### Lista de saídas

```tsx
// src/app/(site)/saidas/page.tsx
import { buscar } from '@/sanity/client';
import { PROXIMAS_SAIDAS, SAIDAS_REALIZADAS } from '@/sanity/queries';
import { CardSaida } from '@/components/saida/CardSaida';
import type { CartaoSaida } from '@/sanity/types';

export const revalidate = 3600;

export const metadata = {
  title: 'Próximas saídas no Caminho da Fé',
  description:
    'Datas, roteiro dia a dia e vagas disponíveis para caminhar o Caminho da Fé com o guia Felipe Muniz.',
};

export default async function PaginaSaidas() {
  const [proximas, realizadas] = await Promise.all([
    buscar<CartaoSaida[]>(PROXIMAS_SAIDAS, {}, ['saida']),
    buscar<CartaoSaida[]>(SAIDAS_REALIZADAS, {}, ['saida']),
  ]);

  return (
    <>
      <section>
        <p className="eyebrow">Agenda</p>
        <h1>Próximas saídas</h1>

        {proximas.length === 0 ? (
          <p>
            Não há data aberta no momento. Deixe seu contato e você
            será avisado quando a próxima saída for publicada.
          </p>
        ) : (
          <ul className="grade-saidas">
            {proximas.map((saida) => (
              <li key={saida._id}>
                <CardSaida saida={saida} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {realizadas.length > 0 && (
        <section>
          <p className="eyebrow">Já aconteceram</p>
          <h2>Saídas realizadas</h2>
          <ul className="grade-saidas">
            {realizadas.map((saida) => (
              <li key={saida._id}>
                <CardSaida saida={saida} variante="realizada" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
```

O estado vazio não é uma mensagem de erro — é um convite a agir, conforme a diretriz de escrita do documento 04.

### Página da saída

```tsx
// src/app/(site)/saidas/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { buscar } from '@/sanity/client';
import { SAIDA_POR_SLUG, SLUGS_SAIDA } from '@/sanity/queries';
import { jsonLdSaida } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await buscar<{ slug: string }[]>(SLUGS_SAIDA);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const saida = await buscar(SAIDA_POR_SLUG, { slug }, ['saida']);
  if (!saida) return {};
  return {
    title: saida.seo?.titulo ?? `${saida.titulo} — Caminho da Fé`,
    description: saida.seo?.descricao ?? saida.resumo,
    openGraph: {
      images: [urlDaImagem(saida.seo?.imagem ?? saida.imagemCapa)
        .width(1200).height(630).url()],
    },
    robots: saida.seo?.naoIndexar ? { index: false } : undefined,
  };
}

export default async function PaginaSaida({ params }) {
  const { slug } = await params;
  const saida = await buscar(SAIDA_POR_SLUG, { slug }, ['saida']);
  if (!saida) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSaida(saida)) }}
      />
      {/* blocos conforme o documento 02 */}
    </>
  );
}
```

---

## 7. Derivação de estado

```ts
// src/lib/status-saida.ts

export type StatusSaida = 'aberta' | 'ultimas' | 'esgotada' | 'realizada';

const LIMITE_ULTIMAS = 0.3;

export function statusDaSaida(saida: {
  dataFim: string;
  vagasTotal: number;
  vagasDisponiveis: number;
}): StatusSaida {
  if (new Date(saida.dataFim) < new Date()) return 'realizada';
  if (saida.vagasDisponiveis <= 0) return 'esgotada';
  if (saida.vagasDisponiveis <= Math.ceil(saida.vagasTotal * LIMITE_ULTIMAS)) {
    return 'ultimas';
  }
  return 'aberta';
}

export const rotuloDoStatus: Record<StatusSaida, string> = {
  aberta: 'Vagas abertas',
  ultimas: 'Últimas vagas',
  esgotada: 'Esgotada',
  realizada: 'Realizada',
};

export function textoDoBotao(status: StatusSaida): string {
  switch (status) {
    case 'aberta':
    case 'ultimas':
      return 'Quero reservar';
    case 'esgotada':
      return 'Entrar na lista de espera';
    case 'realizada':
      return 'Ver a próxima data';
  }
}
```

Uma única fonte de verdade para o estado. Se a regra dos 30% mudar, muda em um lugar.

---

## 8. Formatação de datas

```ts
// src/lib/datas.ts

const fusoBR = 'America/Sao_Paulo';

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: fusoBR,
  });
}

/** "04 a 16 de setembro de 2026" ou "28 de agosto a 9 de setembro de 2026" */
export function formatarPeriodo(inicio: string, fim: string): string {
  const d1 = new Date(inicio);
  const d2 = new Date(fim);
  const dia = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', timeZone: fusoBR });
  const mes = (d: Date) =>
    d.toLocaleDateString('pt-BR', { month: 'long', timeZone: fusoBR });
  const ano = (d: Date) =>
    d.toLocaleDateString('pt-BR', { year: 'numeric', timeZone: fusoBR });

  if (mes(d1) === mes(d2) && ano(d1) === ano(d2)) {
    return `${dia(d1)} a ${dia(d2)} de ${mes(d2)} de ${ano(d2)}`;
  }
  if (ano(d1) === ano(d2)) {
    return `${dia(d1)} de ${mes(d1)} a ${dia(d2)} de ${mes(d2)} de ${ano(d2)}`;
  }
  return `${formatarData(inicio)} a ${formatarData(fim)}`;
}

export function contarDias(inicio: string, fim: string): number {
  const ms = new Date(fim).getTime() - new Date(inicio).getTime();
  return Math.round(ms / 86_400_000) + 1;
}
```

**Fuso obrigatório.** Sem `timeZone`, um `date` do Sanity gravado como `2026-09-04` é interpretado como UTC e renderiza `03/09` para quem está no Brasil. Uma saída aparecendo com a data errada por um dia é o tipo de bug que só o cliente descobre — e descobre errado.

---

## 9. Componente da fita de altimetria

```tsx
// src/components/saida/FitaAltimetria.tsx

type Dia = { dia: number; trecho: string; km: number; altimetria?: number };

export function FitaAltimetria({ roteiro }: { roteiro: Dia[] }) {
  const dados = roteiro.filter((d) => typeof d.altimetria === 'number');
  if (dados.length < 3) return null;   // com menos de 3 pontos não há perfil

  const L = 800, A = 180, margem = 24;
  const maxAlt = Math.max(...dados.map((d) => d.altimetria!));

  const pontos = dados.map((d, i) => {
    const x = margem + (i / (dados.length - 1)) * (L - margem * 2);
    const y = A - margem - (d.altimetria! / maxAlt) * (A - margem * 2);
    return { x, y, ...d };
  });

  const traco = pontos.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = `${traco} L ${pontos.at(-1)!.x} ${A - margem} L ${pontos[0].x} ${A - margem} Z`;

  return (
    <figure className="fita-altimetria">
      <figcaption className="eyebrow">Perfil do percurso</figcaption>
      <svg viewBox={`0 0 ${L} ${A}`} role="img"
           aria-label={`Perfil de elevação em ${dados.length} dias, com máximo de ${maxAlt} metros de subida em um dia.`}>
        <path d={area} fill="var(--dourado)" fillOpacity="0.12" />
        <path d={traco} fill="none" stroke="var(--amarelo-seta)"
              strokeWidth="2" strokeLinejoin="round" className="traco-altimetria" />
        {pontos.map((p) => (
          <g key={p.dia}>
            <circle cx={p.x} cy={p.y} r="3" fill="var(--amarelo-seta)" />
            <text x={p.x} y={A - 6} textAnchor="middle"
                  className="rotulo-dia">D{p.dia}</text>
          </g>
        ))}
      </svg>
      <p className="sr-only">
        {dados.map((d) => `Dia ${d.dia}, ${d.trecho}: ${d.km} km, ${d.altimetria} metros de subida.`).join(' ')}
      </p>
    </figure>
  );
}
```

O parágrafo `sr-only` é a versão textual do gráfico para leitor de tela. Um SVG sozinho não comunica nada a quem não vê — e aqui o dado é justamente o que o peregrino mais quer saber.

---

## 10. Notas de performance

**Uma requisição por página.** As projeções aninhadas (`depoimentos`, `perguntas`, `relacionados`) resolvem tudo numa chamada só. Isso é o oposto do padrão WordPress, onde cada bloco dispara uma consulta.

**Nunca use `*[]` sem filtro de tipo.** `*[_type == "saida"]` usa o índice; `*[dataInicio > now()]` varre a base inteira.

**`useCdn: true` na leitura pública.** O CDN do Sanity responde em milissegundos. Para preview de rascunho, use um cliente separado com `useCdn: false` e token de leitura.

**Nunca faça `fetch` dentro de `map`.** Se precisar de vários documentos, resolva com `references()` ou com `->` na própria query.

**Imagens sempre com `lqip`.** O fragmento `IMAGEM` já traz o placeholder base64 gerado pelo Sanity. Passe direto para `next/image` como `blurDataURL` — elimina o salto de layout e melhora o LCP.
