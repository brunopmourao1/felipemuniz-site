# 07 — SEO, performance e conteúdo

---

## 1. A oportunidade

O negócio do Felipe é sazonal: as saídas se concentram em setembro e novembro. Mas a decisão do peregrino começa de 3 a 9 meses antes — e começa numa busca no Google, não no Instagram.

Hoje ele não captura nada desse tráfego, porque tudo que produz vive dentro de um feed que o Google não indexa. Os conteúdos utilitários que ele já publica — por que usar a meia do avesso, o guia do peregrino de primeira viagem, a realidade do Ramal da Luminosa, o checklist — são exatamente o tipo de material que rankeia. Falta só ele existir numa página.

**Tese:** transformar o conteúdo que ele já produz em ativo permanente de busca. O post do Instagram morre em 48 horas; o artigo trabalha por anos.

---

## 2. Arquitetura de conteúdo

Modelo pilar-e-satélites. Um hub forte que concentra autoridade, cercado de artigos específicos que linkam de volta.

```
        ┌───────────────────────────────┐
        │   /preparacao   (PILAR)       │
        │   "Como se preparar para o    │
        │    Caminho da Fé"             │
        └───────┬───────────────────────┘
                │  links internos nos dois sentidos
    ┌───────────┼───────────┬───────────┬──────────┐
    ▼           ▼           ▼           ▼          ▼
 mochila    preparo      quantos     escolher    sozinho
 e itens    físico        dias        o ramal    ou em grupo
    │           │           │           │          │
    └───────────┴─────┬─────┴───────────┴──────────┘
                      ▼
              ┌───────────────┐
              │   /saidas     │  ← conversão
              └───────────────┘
```

Todo artigo satélite termina com uma chamada para o material de captura **ou** para a saída relacionada. Nenhum artigo é um beco sem saída.

---

## 3. Pauta inicial — 12 artigos

Priorizados por intenção de busca e por proximidade da conversão.

| # | Título de trabalho | Intenção | Prioridade |
|---|---|---|---|
| 1 | O que levar no Caminho da Fé: lista completa com peso de cada item | informacional, volume alto | 🔴 |
| 2 | Quantos dias leva o Caminho da Fé? Comparação por ramal | informacional, alta conversão | 🔴 |
| 3 | Qual ramal do Caminho da Fé escolher | comparação, decisão | 🔴 |
| 4 | Dá para fazer o Caminho da Fé sozinho? | dúvida, ponte direta para grupo guiado | 🔴 |
| 5 | Quanto custa fazer o Caminho da Fé | transacional | 🔴 |
| 6 | Preparo físico: quanto treinar antes | informacional | 🟡 |
| 7 | A credencial e os carimbos: como funciona | informacional | 🟡 |
| 8 | Como são as pousadas do Caminho | informacional | 🟡 |
| 9 | Melhor época do ano para caminhar | informacional | 🟡 |
| 10 | Precisa ser católico para fazer o Caminho? | dúvida, amplia público | 🟡 |
| 11 | Bolhas, joelho e ombro: o que realmente machuca | informacional | 🟢 |
| 12 | Ramal da Luminosa: a subida mais temida | cauda longa, alta intenção | 🟢 |

**Ritmo sugerido:** 2 artigos por mês nos primeiros 6 meses. Depois, 1 por mês. Não é volume — é constância.

**Reaproveitamento direto.** Os itens 1, 4, 7 e 12 já existem como post do Instagram. Vira artigo expandindo o texto e reaproveitando a arte como imagem de capa. O trabalho é de transcrição e ampliação, não de criação.

---

## 4. Dados estruturados

### `src/lib/seo.ts`

```ts
const SITE = process.env.NEXT_PUBLIC_SITE_URL!;

/** Aplicado no layout raiz, em todas as páginas. */
export function jsonLdOrganizacao(config: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE}/#negocio`,
    name: 'Felipe Muniz — Guia do Caminho da Fé',
    description:
      'Guia credenciado que conduz grupos de peregrinos no Caminho da Fé, entre Águas da Prata e Aparecida.',
    url: SITE,
    telephone: `+${config.whatsapp}`,
    email: config.email,
    areaServed: [
      { '@type': 'State', name: 'São Paulo' },
      { '@type': 'State', name: 'Minas Gerais' },
    ],
    sameAs: [config.instagram].filter(Boolean),
  };
}

/** Página da saída. TouristTrip é o tipo correto — não Event nem Product. */
export function jsonLdSaida(saida: any) {
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
      itemListElement: (saida.roteiro ?? []).map((dia: any) => ({
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
          saida.vagasDisponiveis > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/SoldOut',
        validThrough: saida.dataInicio,
        url: `${SITE}/saidas/${saida.slug}`,
      },
    }),
  };
}

/** Página de FAQ. Rende resultado expandido no Google. */
export function jsonLdFaq(perguntas: { pergunta: string; respostaTexto: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: perguntas.map((p) => ({
      '@type': 'Question',
      name: p.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respostaTexto },
    })),
  };
}

/** Post do blog. */
export function jsonLdArtigo(post: any, imagemUrl: string) {
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
```

**Validar em:** [search.google.com/test/rich-results](https://search.google.com/test/rich-results) antes de publicar. `FAQPage` e `TouristTrip` são os que mais rendem no resultado de busca.

---

## 5. Sitemap e robots

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { buscar } from '@/sanity/client';
import { SITEMAP } from '@/sanity/queries';

const SITE = process.env.NEXT_PUBLIC_SITE_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dados = await buscar<any>(SITEMAP);

  const fixas = [
    { url: '', prioridade: 1.0, frequencia: 'weekly' as const },
    { url: '/saidas', prioridade: 0.9, frequencia: 'daily' as const },
    { url: '/preparacao', prioridade: 0.8, frequencia: 'weekly' as const },
    { url: '/o-caminho', prioridade: 0.8, frequencia: 'monthly' as const },
    { url: '/quem-sou', prioridade: 0.7, frequencia: 'monthly' as const },
    { url: '/blog', prioridade: 0.7, frequencia: 'weekly' as const },
    { url: '/depoimentos', prioridade: 0.6, frequencia: 'weekly' as const },
    { url: '/perguntas-frequentes', prioridade: 0.6, frequencia: 'monthly' as const },
    { url: '/contato', prioridade: 0.5, frequencia: 'yearly' as const },
  ].map((p) => ({
    url: `${SITE}${p.url}`,
    lastModified: new Date(),
    changeFrequency: p.frequencia,
    priority: p.prioridade,
  }));

  const dinamicas = [
    ...dados.saidas.map((s: any) => ({
      url: `${SITE}/saidas/${s.slug}`,
      lastModified: new Date(s._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...dados.posts.map((p: any) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...dados.ramais.map((r: any) => ({
      url: `${SITE}/o-caminho/${r.slug}`,
      lastModified: new Date(r._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...dados.materiais.map((m: any) => ({
      url: `${SITE}/materiais/${m.slug}`,
      lastModified: new Date(m._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [...fixas, ...dinamicas];
}
```

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL!;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/grupo/', '/api/', '/obrigado'],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
```

As páginas de grupo também recebem `robots: { index: false, follow: false }` no `generateMetadata`. Bloquear só no `robots.txt` impede o rastreamento, mas não a indexação se alguém colar o link em algum lugar público — a meta tag é a garantia real.

---

## 6. Imagem de compartilhamento dinâmica

Cada saída gera automaticamente a imagem que aparece quando o link é colado no WhatsApp — que é como esse público compartilha.

```tsx
// src/app/(site)/saidas/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { buscar } from '@/sanity/client';
import { SAIDA_POR_SLUG } from '@/sanity/queries';
import { formatarPeriodo } from '@/lib/datas';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Saída no Caminho da Fé';

export default async function Imagem({ params }: { params: { slug: string } }) {
  const saida = await buscar<any>(SAIDA_POR_SLUG, { slug: params.slug });

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: 72,
        background: 'linear-gradient(160deg, #0B2038 0%, #12314F 100%)',
      }}>
        <div style={{
          fontSize: 26, letterSpacing: 6, textTransform: 'uppercase',
          color: '#C9A227', marginBottom: 20,
        }}>
          Caminho da Fé
        </div>
        <div style={{
          fontSize: 76, fontWeight: 800, color: '#E4EBF1',
          lineHeight: 1.05, marginBottom: 28,
        }}>
          {saida?.titulo}
        </div>
        <div style={{ fontSize: 32, color: '#9BB0C4' }}>
          {saida && formatarPeriodo(saida.dataInicio, saida.dataFim)} · {saida?.distanciaKm} km
        </div>
        <div style={{
          marginTop: 40, display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ width: 56, height: 6, background: '#F5B31E' }} />
          <div style={{ fontSize: 28, color: '#F5B31E' }}>com Felipe Muniz</div>
        </div>
      </div>
    ),
    size
  );
}
```

---

## 7. Metas de performance

| Métrica | Meta | Como |
|---|---|---|
| LCP | < 2,0 s | Hero com `priority`, imagem servida pelo CDN do Sanity em AVIF, fontes com `preload` |
| INP | < 200 ms | Quase nenhum JavaScript no cliente — quase tudo é Server Component |
| CLS | < 0,05 | `width`/`height` em toda imagem, `lqip` como blur, fontes com `font-display: swap` e métricas de fallback ajustadas |
| Peso da home | < 350 KB | Sem biblioteca de animação, sem carrossel, sem ícone em fonte |
| Lighthouse mobile | ≥ 90 nas 4 categorias | Verificado antes de cada entrega |

### Fontes

```css
@font-face {
  font-family: 'Archivo';
  src: url('/fontes/Archivo-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-stretch: 62% 125%;
  font-display: swap;
}

/* Ajuste de métricas do fallback — reduz o salto quando a fonte carrega */
@font-face {
  font-family: 'Archivo Fallback';
  src: local('Arial');
  ascent-override: 92%;
  descent-override: 24%;
  line-gap-override: 0%;
  size-adjust: 101%;
}
```

Uma fonte variável cobre todos os pesos e larguras da Archivo num arquivo só. Baixar seis arquivos estáticos custaria mais que o site inteiro.

---

## 8. Palavras-chave de referência

Sem dado real de volume — o Bruno deve validar no Planejador de Palavras-chave do Google antes de escrever. A lista abaixo é hipótese de trabalho, ordenada por intenção.

**Cauda curta (difícil, disputada):** caminho da fé · caminho da fé aparecida · peregrinação caminho da fé

**Cauda média (alvo realista):** guia caminho da fé · caminho da fé em grupo · quantos dias caminho da fé · caminho da fé quanto custa · caminho da fé ramais

**Cauda longa (onde se ganha primeiro):** o que levar no caminho da fé · caminho da fé sozinho é seguro · caminho da fé preparo físico · qual ramal do caminho da fé é mais fácil · caminho da fé para iniciantes · caminho da fé setembro 2026

A estratégia é ganhar cauda longa primeiro. Um site novo não disputa "caminho da fé" com o site da associação — mas disputa e vence "o que levar na mochila do caminho da fé", porque ninguém escreveu isso direito ainda.

---

## 9. Ligação com o Instagram

O site não substitui o Instagram; muda o papel dele.

| Onde | Papel |
|---|---|
| **Instagram** | Descoberta, relacionamento, prova social viva. Reels e bastidores |
| **Site** | Conversão, informação profunda, captura, memória permanente |

**Ações concretas:**

1. **Link da bio → `/saidas`**, não para a home. Quem vem do Instagram já sabe quem é o Felipe; quer ver data e vaga.
2. **Destaques do perfil** apontando para o site: "Agenda", "Como funciona", "Depoimentos".
3. **Todo post utilitário** ganha um artigo correspondente e o CTA "link na bio" passa a ter destino real.
4. **UTM em tudo:** `?utm_source=instagram&utm_medium=bio` e `&utm_medium=stories`. Sem isso não se sabe o que funciona.
5. **Caminho inverso:** cada artigo do blog vira 3 posts de carrossel. O conteúdo é escrito uma vez e trabalha nos dois canais.

---

## 10. Medição

**Google Search Console** — instalar no dia 1, antes de qualquer conteúdo. É onde aparecem as consultas reais que trazem gente, e elas quase nunca são as que se imaginou. Submeter o sitemap na configuração.

**Vercel Web Analytics** ou **Umami** — sem cookie, sem banner de consentimento, sem peso.

### Indicadores por trimestre

| Indicador | Meta T1 | Meta T2 |
|---|---|---|
| Páginas indexadas | 20+ | 35+ |
| Cliques orgânicos/mês | 100 | 400 |
| Contatos capturados/mês | 15 | 50 |
| Reservas originadas no site | 3 | 10 |

Números de referência para um site novo em nicho pequeno. O que importa não é bater a meta — é ter o número visível para saber se a coisa anda.
