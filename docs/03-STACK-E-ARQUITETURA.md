# 03 — Stack, arquitetura técnica e infraestrutura

---

## 1. Stack

| Camada | Tecnologia | Versão | Por quê |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.x | SSG + ISR, rotas de API no mesmo projeto, ecossistema maduro |
| Linguagem | TypeScript | 5.x | Tipos gerados a partir dos schemas do Sanity — erro de campo aparece na compilação, não no ar |
| Estilo | Tailwind CSS | 4.x | Tokens como CSS custom properties nativas, sem arquivo de config JS |
| CMS | Sanity | v3 | Studio customizável em português, tempo real, camada gratuita generosa |
| Cliente CMS | `next-sanity` | 9.x | Cache e revalidação integrados ao App Router |
| Imagens | `@sanity/image-url` + `next/image` | — | Transformação sob demanda no CDN do Sanity, AVIF/WebP automáticos |
| Texto rico | `@portabletext/react` | 3.x | Renderização controlada do corpo dos posts |
| Formulários | React Hook Form + Zod | — | Validação única compartilhada entre cliente e servidor |
| E-mail | Resend | — | 3.000/mês grátis, API simples |
| Hospedagem | Vercel ou Cloudflare Pages | — | Ver seção 6 |
| Analytics | Vercel Web Analytics | — | Sem cookie, sem banner |

### Por que não WordPress

O site oficial do Caminho da Fé é a demonstração viva do argumento: roda WordPress e está com links de spam injetados no rodapé. WordPress exige atualização contínua de core, tema e plugins. Como este é um presente, qualquer stack que gere manutenção recorrente transfere um passivo para o Bruno — ou deixa o Felipe com um site comprometido em dois anos.

Um site estático não tem superfície de ataque: não há PHP executando, não há banco, não há admin exposto. O conteúdo mora no Sanity, que é responsabilidade de terceiro manter.

### Por que Sanity e não Strapi, Directus ou Contentful

Strapi e Directus precisam de servidor rodando — custo e manutenção. Contentful tem camada gratuita mais apertada e o editor é menos flexível. O Sanity permite construir a interface de edição em português com os campos exatos do domínio (ramal, km, altimetria, vagas), com pré-visualização e validação. Para um editor não técnico, isso é a diferença entre usar e não usar.

---

## 2. Estrutura de pastas

```
felipemuniz-site/
├── src/
│   ├── app/
│   │   ├── (site)/                    grupo de rotas públicas
│   │   │   ├── layout.tsx             header, footer, botão WhatsApp
│   │   │   ├── page.tsx               home
│   │   │   ├── saidas/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── o-caminho/
│   │   │   ├── preparacao/
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]/page.tsx
│   │   │   │   └── categoria/[slug]/page.tsx
│   │   │   ├── depoimentos/page.tsx
│   │   │   ├── quem-sou/page.tsx
│   │   │   ├── perguntas-frequentes/page.tsx
│   │   │   ├── contato/page.tsx
│   │   │   ├── materiais/[slug]/page.tsx
│   │   │   ├── obrigado/page.tsx
│   │   │   └── politica-de-privacidade/page.tsx
│   │   ├── grupo/[slug]/page.tsx      noindex, sem layout público
│   │   ├── studio/[[...tool]]/page.tsx
│   │   ├── api/
│   │   │   ├── lead/route.ts          captura de contato
│   │   │   ├── reserva/route.ts       pedido de reserva
│   │   │   └── revalidate/route.ts    webhook do Sanity
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css                tokens + camadas do Tailwind
│   │
│   ├── components/
│   │   ├── ui/                        Botao, Selo, Campo, Acordeao
│   │   ├── saida/                     CardSaida, FitaAltimetria, RoteiroDia, BarraReserva
│   │   ├── credencial/                Credencial, Carimbo   ← elemento assinatura
│   │   ├── layout/                    Cabecalho, Rodape, BotaoWhatsApp
│   │   └── conteudo/                  PortableText, Imagem, Galeria
│   │
│   ├── sanity/
│   │   ├── env.ts
│   │   ├── client.ts
│   │   ├── image.ts
│   │   ├── queries.ts                 todas as GROQ (documento 06)
│   │   ├── types.ts                   gerado por `sanity typegen`
│   │   ├── structure.ts               desk customizado em português
│   │   └── schemaTypes/
│   │       ├── index.ts
│   │       ├── documents/             saida, post, depoimento, faq, material, ramal, lead
│   │       ├── singletons/            configuracao, paginaQuemSou
│   │       └── objects/               diaRoteiro, seo, blocoTexto, imagemComAlt
│   │
│   ├── lib/
│   │   ├── schemas.ts                 validações Zod
│   │   ├── whatsapp.ts                montagem do link
│   │   ├── datas.ts                   formatação pt-BR
│   │   ├── status-saida.ts            derivação de estado
│   │   └── seo.ts                     metadata + JSON-LD
│   │
│   └── styles/tokens.css
│
├── public/
│   ├── fontes/                        WOFF2 self-hosted
│   └── materiais/                     PDFs de captura
│
├── sanity.config.ts
├── sanity.cli.ts
├── next.config.ts
├── .env.local
└── package.json
```

---

## 3. Renderização e cache

### Estratégia por rota

| Rota | Estratégia | Revalidação |
|---|---|---|
| `/` | Estática | Webhook + `revalidate: 3600` |
| `/saidas`, `/saidas/[slug]` | SSG com `generateStaticParams` | Webhook (crítico — vagas mudam) |
| `/blog/*` | SSG | Webhook |
| `/grupo/[slug]` | Dinâmica, `noindex` | Sem cache |
| `/api/*` | Dinâmica | — |

### Webhook de revalidação

O Felipe altera as vagas no celular → o Sanity dispara o webhook → a página específica é regerada em segundos. Sem isso, o site mostraria vagas desatualizadas até o próximo build.

**`src/app/api/revalidate/route.ts`**

```ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { NextRequest, NextResponse } from 'next/server';

type Corpo = { _type: string; slug?: { current: string } };

export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<Corpo>(
    req,
    process.env.SANITY_REVALIDATE_SECRET
  );

  if (!isValidSignature) {
    return new NextResponse('Assinatura inválida', { status: 401 });
  }
  if (!body?._type) {
    return new NextResponse('Corpo sem tipo', { status: 400 });
  }

  // Sempre revalida a tag do tipo alterado
  revalidateTag(body._type);

  // E a rota específica, quando houver slug
  const rotas: Record<string, (s: string) => string[]> = {
    saida: (s) => ['/', '/saidas', `/saidas/${s}`],
    post: (s) => ['/blog', `/blog/${s}`, '/preparacao'],
    depoimento: () => ['/', '/depoimentos'],
    faq: () => ['/perguntas-frequentes'],
    configuracao: () => ['/'],
  };

  const alvo = rotas[body._type];
  if (alvo) {
    for (const rota of alvo(body.slug?.current ?? '')) {
      revalidatePath(rota);
    }
  }

  return NextResponse.json({ revalidado: true, tipo: body._type });
}
```

**Configuração no Sanity** (Manage → API → Webhooks):
- URL: `https://felipemuniz.com.br/api/revalidate`
- Dataset: `production`
- Trigger: Create, Update, Delete
- Projection: `{_type, slug}`
- Secret: mesmo valor de `SANITY_REVALIDATE_SECRET`

---

## 4. Cliente Sanity

**`src/sanity/client.ts`**

```ts
import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset  = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = '2026-07-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,          // CDN para leitura pública
  perspective: 'published',
});

// Wrapper tipado com cache por tag
export async function buscar<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = []
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { tags, revalidate: 3600 },
  });
}
```

**`src/sanity/image.ts`**

```ts
import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { dataset, projectId } from './client';

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlDaImagem = (fonte: Image) =>
  builder.image(fonte).auto('format').fit('max');
```

---

## 5. Variáveis de ambiente

**`.env.local`** (nunca versionar)

```bash
# Sanity — público
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity — servidor
SANITY_API_READ_TOKEN=sk...        # só se usar preview de rascunho
SANITY_API_WRITE_TOKEN=sk...       # gravação de leads
SANITY_REVALIDATE_SECRET=...       # string aleatória forte

# E-mail
RESEND_API_KEY=re_...
EMAIL_DESTINO=felipe@...           # onde chegam os avisos
EMAIL_REMETENTE=site@felipemuniz.com.br

# Site
NEXT_PUBLIC_SITE_URL=https://felipemuniz.com.br
NEXT_PUBLIC_WHATSAPP=55199XXXXXXXX # com DDI, sem símbolos
```

Gerar o segredo do webhook: `openssl rand -base64 32`

---

## 6. Hospedagem — duas opções

### Opção A · Vercel (recomendada para desenvolver)

Integração nativa com Next.js. Deploy a cada push, preview por branch, ISR funcionando sem configuração.

**Ressalva:** o plano Hobby é destinado a uso não comercial. Um site que vende saídas guiadas é uso comercial. Na prática a Vercel raramente aciona isso em projetos desse porte, mas o risco existe e precisa estar registrado.

### Opção B · Cloudflare Pages (recomendada para produção)

Sem restrição de uso comercial na camada gratuita, banda ilimitada, CDN excelente no Brasil.

Requer o adaptador OpenNext:

```bash
npm i -D @opennextjs/cloudflare
```

**`wrangler.toml`**
```toml
name = "felipemuniz-site"
compatibility_date = "2026-07-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".open-next/assets"
```

**Recomendação prática:** desenvolver na Vercel pela velocidade de iteração e, antes de apontar o domínio definitivo, migrar para o Cloudflare Pages. Como o site é estático e o CMS é externo, a migração é trocar o alvo do deploy — não há dado a mover.

---

## 7. Fluxo de dados

```
┌──────────┐   edita    ┌────────────┐
│  FELIPE  │──────────▶ │   SANITY   │
│ (celular)│            │  (conteúdo)│
└──────────┘            └─────┬──────┘
                              │ webhook
                              ▼
                    ┌──────────────────┐
                    │  NEXT.JS na CDN  │
                    │  regenera a rota │
                    └─────┬────────────┘
                          │ HTML estático
                          ▼
                    ┌──────────────┐
                    │  VISITANTE   │
                    └─────┬────────┘
                          │ formulário
                          ▼
                 ┌────────────────────┐
                 │  /api/lead         │
                 │  Zod → Resend      │
                 │      → Sanity      │
                 └────┬──────────┬────┘
                      ▼          ▼
                 e-mail p/    documento
                  Felipe       `lead`
```

---

## 8. Rota de API — captura de contato

**`src/app/api/lead/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@sanity/client';
import { esquemaLead } from '@/lib/schemas';

const resend = new Resend(process.env.RESEND_API_KEY);

const escritor = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-07-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const janela = new Map<string, number[]>();

function excedeuLimite(ip: string, max = 5, janelaMs = 60_000) {
  const agora = Date.now();
  const registros = (janela.get(ip) ?? []).filter((t) => agora - t < janelaMs);
  registros.push(agora);
  janela.set(ip, registros);
  return registros.length > max;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'desconhecido';

  if (excedeuLimite(ip)) {
    return NextResponse.json(
      { erro: 'Muitas tentativas. Aguarde um minuto e tente de novo.' },
      { status: 429 }
    );
  }

  const dados = await req.json();

  // Honeypot: campo invisível que só bot preenche
  if (dados.website) {
    return NextResponse.json({ ok: true }); // silencioso de propósito
  }

  const validacao = esquemaLead.safeParse(dados);
  if (!validacao.success) {
    return NextResponse.json(
      { erro: 'Confira os campos destacados.', campos: validacao.error.flatten() },
      { status: 400 }
    );
  }

  const { nome, email, whatsapp, origem, consentimento } = validacao.data;

  try {
    await escritor.create({
      _type: 'lead',
      nome,
      email,
      whatsapp,
      origem,
      consentimento,
      recebidoEm: new Date().toISOString(),
    });

    await resend.emails.send({
      from: process.env.EMAIL_REMETENTE!,
      to: process.env.EMAIL_DESTINO!,
      subject: `Novo contato pelo site: ${nome}`,
      text: `Nome: ${nome}\nWhatsApp: ${whatsapp}\nE-mail: ${email}\nOrigem: ${origem}`,
    });

    return NextResponse.json({ ok: true });
  } catch (erro) {
    console.error('Falha ao registrar contato', erro);
    return NextResponse.json(
      { erro: 'Não foi possível enviar agora. Tente de novo em instantes.' },
      { status: 500 }
    );
  }
}
```

**Nota sobre o rate limit em memória:** funciona em instância única, mas se perde entre invocações serverless. Para o volume esperado é suficiente. Se virar problema, trocar por Upstash Redis (camada gratuita) sem alterar a interface da função.

---

## 9. Validações compartilhadas

**`src/lib/schemas.ts`**

```ts
import { z } from 'zod';

const whatsappBR = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

export const esquemaLead = z.object({
  nome: z.string().trim().min(2, 'Digite seu nome completo.'),
  email: z.string().trim().email('Digite um e-mail válido.'),
  whatsapp: z.string().trim().regex(whatsappBR, 'Digite o WhatsApp com DDD.'),
  origem: z.string().default('site'),
  consentimento: z.literal(true, {
    errorMap: () => ({ message: 'É preciso concordar para continuar.' }),
  }),
  website: z.string().max(0).optional(), // honeypot
});

export const esquemaReserva = esquemaLead.extend({
  saidaId: z.string().min(1),
  saidaTitulo: z.string().min(1),
  mensagem: z.string().trim().max(1000).optional(),
});

export type Lead = z.infer<typeof esquemaLead>;
export type Reserva = z.infer<typeof esquemaReserva>;
```

As mensagens de erro seguem a diretriz de escrita: dizem o que fazer, não pedem desculpa e não descrevem o sistema.

---

## 10. Segurança

| Vetor | Mitigação |
|---|---|
| Spam em formulário | Honeypot + rate limit por IP + validação Zod |
| Vazamento de token | Tokens de escrita só em variáveis de servidor. Nada com prefixo `NEXT_PUBLIC_` |
| Webhook forjado | Assinatura HMAC validada por `parseBody` do `next-sanity` |
| Studio exposto | Autenticação do próprio Sanity. Apenas contas convidadas no projeto |
| Área do grupo | Slug com sufixo aleatório de 6 caracteres, `noindex`, fora do sitemap. Não é segurança forte — é obscuridade adequada ao dado, que não é sensível |
| XSS via conteúdo | Portable Text renderiza componentes React, não HTML bruto |
| Cabeçalhos | CSP, `X-Frame-Options`, `Referrer-Policy` em `next.config.ts` |

**`next.config.ts`**

```ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return []; // registrar aqui todo slug que mudar depois de publicado
  },
};

export default config;
```
