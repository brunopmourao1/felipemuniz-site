# 09 — Setup passo a passo e roadmap

---

## 1. Situação dos pré-requisitos

Decidido: **construir tudo com conteúdo fictício** e trocar pelo real junto com o Felipe, depois da entrega do presente. Ver `10-DADOS-INICIAIS.md`.

| Item | Situação | Bloqueia? |
|---|---|---|
| Domínio | Registrar só depois de entregar o presente. Até lá, URL de preview | Não |
| E-mail do Studio | `bruno.pmourao1@gmail.com` por enquanto | Não |
| WhatsApp | `5511953215363` (do Bruno, provisório) | Não |
| Acervo de fotos | Placeholder do picsum via seed | Não |
| Texto "Quem sou" | Fictício, marcado `[EXEMPLO]` | Não |
| Dados das saídas | Quatro saídas fictícias, cobrindo os quatro estados | Não |
| Depoimentos | Dez fictícios, marcados `[EXEMPLO]` | Não |
| Operadores Credenciados | Confirmar com o Felipe depois da entrega | Não |
| Assinatura no rodapé | Incluída por padrão: *"Site desenvolvido por Bruno Mourão"*, discreta, com link. Remover se ele preferir | Não |

**Consequência:** nada bloqueia o início do desenvolvimento. Em compensação, o **checklist de troca do fictício pelo real** (documento 10, seção 6) vira condição obrigatória antes de apontar o domínio definitivo. Um site indexado com "[EXEMPLO] Maria Aparecida, Campinas" seria pior que site nenhum.

**O que pedir ao Felipe no dia da entrega:** acervo de fotos em alta, o texto do "Quem sou", os dados reais das próximas saídas, dez depoimentos com autorização de nome e cidade, o CPF para o domínio e o e-mail Google dele.

---

## 2. Setup do projeto

### 2.1 Criar o projeto

```bash
npx create-next-app@latest felipemuniz-site \
  --typescript --tailwind --app --src-dir --import-alias "@/*"

cd felipemuniz-site
```

### 2.2 Dependências

```bash
npm install next-sanity @sanity/image-url @sanity/vision \
  @sanity/icons @sanity/locale-pt-br @portabletext/react \
  react-hook-form @hookform/resolvers zod resend

npm install -D @sanity/cli
```

### 2.3 Criar o projeto no Sanity

```bash
npx sanity@latest init --env
```

Responda: criar projeto novo → nome `felipemuniz` → dataset `production` → template `Clean project`. O `--env` já grava `NEXT_PUBLIC_SANITY_PROJECT_ID` e `NEXT_PUBLIC_SANITY_DATASET` no `.env.local`.

### 2.4 Tokens

No [sanity.io/manage](https://sanity.io/manage), projeto → **API** → **Tokens**:

- `escrita-site` com permissão **Editor** → vai em `SANITY_API_WRITE_TOKEN`

Gerar o segredo do webhook:

```bash
openssl rand -base64 32   # → SANITY_REVALIDATE_SECRET
```

Conta na [resend.com](https://resend.com), verificar o domínio e pegar a chave → `RESEND_API_KEY`.

### 2.5 Montar a estrutura

Criar as pastas e colar os arquivos dos documentos 03, 05 e 06:

```bash
mkdir -p src/sanity/schemaTypes/{documents,singletons,objects}
mkdir -p src/components/{ui,saida,credencial,layout,conteudo}
mkdir -p src/lib src/styles
mkdir -p src/app/studio/\[\[...tool\]\]
mkdir -p src/app/api/{lead,reserva,revalidate}
```

**`src/app/studio/[[...tool]]/page.tsx`**

```tsx
import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export const dynamic = 'force-static';
export const metadata = { robots: { index: false, follow: false } };

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

### 2.6 Verificar

```bash
npm run dev
```

- `localhost:3000` → site
- `localhost:3000/studio` → Studio, em português, com o menu do documento 05

### 2.7 Fontes

Baixar de [fonts.google.com](https://fonts.google.com): Archivo (variável), Source Sans 3, IBM Plex Mono, Newsreader Italic. Converter para WOFF2 (subconjunto `latin` + `latin-ext` — o português precisa de `latin-ext` para ã, õ, ç) e colocar em `public/fontes/`.

---

## 3. Roadmap

### Fase 1 — Fundação (~15 h)

Objetivo: o Felipe consegue cadastrar uma saída e ela aparece no site.

- [ ] Setup completo da seção 2
- [ ] Todos os schemas do documento 05
- [ ] Estrutura do Studio em português
- [ ] Tokens de design em `globals.css`, fontes carregando
- [ ] Componentes base: Botao, Selo, Campo, Container
- [ ] Layout: Cabecalho, Rodape, BotaoWhatsApp
- [ ] Página `/saidas` e `/saidas/[slug]` funcionais
- [ ] Deploy na Vercel com domínio provisório

**Marco:** o Bruno cadastra uma saída real e ela renderiza corretamente.

### Fase 2 — Conversão (~12 h)

Objetivo: o site começa a gerar contato.

- [ ] Home completa, com todos os blocos do documento 02
- [ ] Módulo Credencial (elemento assinatura)
- [ ] Fita de altimetria
- [ ] Rotas `/api/lead` e `/api/reserva`
- [ ] Página `/materiais/[slug]` e `/obrigado`
- [ ] Link de WhatsApp com mensagem pré-preenchida
- [ ] Barra fixa de reserva no mobile
- [ ] Webhook de revalidação configurado no Sanity

**Marco:** um formulário preenchido chega no e-mail do Felipe e grava o contato.

### Fase 3 — Conteúdo e busca (~10 h)

Objetivo: o site começa a aparecer no Google.

- [ ] `/blog`, `/blog/[slug]`, `/blog/categoria/[slug]`
- [ ] Página pilar `/preparacao`
- [ ] `/quem-sou`, `/o-caminho`, `/depoimentos`, `/perguntas-frequentes`, `/contato`
- [ ] Política de privacidade
- [ ] `sitemap.ts`, `robots.ts`, JSON-LD em todas as páginas
- [ ] Imagem OG dinâmica
- [ ] Search Console instalado e sitemap submetido
- [ ] Os 5 primeiros artigos publicados

**Marco:** Rich Results Test aprovado e primeiras páginas indexadas.

### Fase 4 — Entrega (~8 h)

- [ ] Área do grupo `/grupo/[slug]`
- [ ] Auditoria Lighthouse ≥ 90 nas quatro categorias
- [ ] Teste de navegação só por teclado
- [ ] Teste real em iPhone e Android, em 4G
- [ ] Revisão de todo o texto do site
- [ ] Domínio definitivo apontado, HTTPS ativo
- [ ] Migração para Cloudflare Pages, se essa for a decisão
- [ ] **Treinamento do Felipe:** uma chamada de 40 minutos executando as cinco tarefas do documento 08
- [ ] Vídeo de 10 minutos gravado com a tela, para ele rever depois
- [ ] Entrega dos acessos: Sanity, Vercel/Cloudflare, Registro.br, Resend, Search Console

**Estimativa total: 45 horas.**

---

## 4. Transferência de titularidade

Um presente que fica no nome do Bruno não é um presente — é uma dependência.

| Serviço | Titular | Ação |
|---|---|---|
| Domínio | **Felipe** (CPF dele) | Registrar já no nome dele |
| Sanity | **Felipe** como Administrator | Bruno fica como Developer |
| Vercel / Cloudflare | Conta do Felipe, ou do Bruno com acesso dele | Definir na entrega |
| Resend | Felipe | E-mail dele |
| Search Console | Felipe como proprietário | Bruno como usuário |
| Repositório Git | Bruno, com o Felipe adicionado | Ou transferir |

Deixar um documento com todos os acessos, num gerenciador de senhas ou em papel.

---

## 5. Combinado de manutenção

Registrar por escrito antes da entrega, para não virar mal-entendido depois:

**Incluso no presente:**
- 30 dias de correção de defeito após a entrega
- O site continua funcionando indefinidamente sem intervenção

**Não incluso:**
- Conteúdo novo (é o Felipe quem publica)
- Funcionalidades novas
- Atualização de framework
- Suporte com prazo de resposta

**Sugestão de conversa:** deixar claro que ampliações futuras (pagamento online, área logada, multi-idioma) são bem-vindas, mas viram projeto novo. Isso protege a amizade e abre a possibilidade de o primeiro trabalho pago vir do mesmo cliente.

---

## 6. Riscos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Felipe não alimenta o site | **Alta** | Manual do documento 08 + treinamento ao vivo + checklist mensal. Se ele não publicar, o site vira folheto estático — o que ainda é melhor que nada, mas perde o SEO |
| Fotos insuficientes ou ruins | Média | Levantar o acervo na Fase 1, antes de projetar as telas |
| Vercel questionar uso comercial | Baixa | Cloudflare Pages como alternativa já documentada |
| Escopo crescendo durante a obra | **Alta** | Lista de fora-de-escopo do documento 01, revisada a cada fase |
| Bruno sem tempo, projeto parado no meio | Média | Fases fechadas. Cada fase entrega algo que funciona sozinho: a Fase 1 já é um site publicável |
| Felipe pedir pagamento online depois | Média | Arquitetura preparada. Vira projeto v2, com escopo próprio |

---

## 7. O que este projeto vale para o Bruno

Além do presente:

**Peça de portfólio real.** Um site com CMS, SEO estruturado, design próprio e cliente satisfeito vale mais em proposta comercial que dez layouts de demonstração. Este é o terceiro site de portfólio dele, e o mais completo em profundidade técnica.

**Um caso replicável.** Guias de peregrinação, operadores de turismo de aventura, condutores de trilha — todos têm o mesmo problema: saídas com data, vagas, roteiro e prova social, vendidos por WhatsApp. Este projeto é o molde. O segundo cliente do mesmo tipo custa um terço do esforço.

**Nicho concreto para prospectar.** A página de Operadores Credenciados do site da associação é uma lista pública de empresas que atuam no Caminho da Fé — todas com a mesma carência. E o site oficial estar com spam injetado no rodapé diz o quanto esse ecossistema é mal atendido tecnicamente.

**Um depoimento.** Peça ao Felipe, na entrega. Vale para o site do Bruno.
