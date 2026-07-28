# Progresso do projeto — Felipe Muniz / Caminho da Fé

Diário de bordo do desenvolvimento. Atualizado a cada avanço, para retomar o trabalho sem perder contexto entre sessões.

---

## Onde estamos agora

**Fase 1 — Fundação**, quase concluída. Todo o código está escrito, **`npm run build` fecha limpo, sem erro nem aviso**, tokens do Sanity gerados e no `.env.local`, **seed rodado com sucesso** (36 documentos fictícios), e `/saidas` já mostra as 4 saídas de verdade (confirmado por `curl` e pelo build estático gerando as 4 páginas `/saidas/[slug]`). Falta: conferência visual no navegador (Bruno está fazendo agora manualmente) e deploy na Vercel.

Commits desta fase: `6ab5a38` (base), `a9ac756` (diário), `53c14d8` (fix dos scripts de seed + client de leitura).

Projeto Sanity conectado: `sjs9wkjh` ("Felipe Muniz Site"), dataset `production`. Hospedagem definida: Vercel. Resend fica para depois (Fase 2).

---

## Feito

- [x] Repositório git iniciado, remoto `https://github.com/brunopmourao1/felipemuniz-site`, primeiro commit com a documentação (`docs/` + `CLAUDE.md`)
- [x] Projeto Next.js criado na raiz (TypeScript, Tailwind v4, App Router, `src/`), fixado em **Next 15.5.22** (não 16 — decisão do `CLAUDE.md`)
- [x] Dependências instaladas — com ajuste de versão em relação à documentação, ver "Desvios da documentação"
- [x] `.env.local` preenchido com o projeto Sanity real (`sjs9wkjh`) — faltam os tokens (ver "Bloqueios abertos")
- [x] Todos os schemas do documento 05: `imagemComAlt`, `seo`, `diaRoteiro`, `saida`, `ramal`, `depoimento`, `post`, `faq`, `material`, `lead`, `configuracao`, `quemSou`
- [x] Estrutura do Studio em português (`src/sanity/structure.ts`) + página `/studio`
- [x] Tokens de design (`src/styles/tokens.css`) — paleta, tipografia, espaçamento do documento 04
- [x] Fontes baixadas do Google Fonts e auto-hospedadas em `public/fontes/` (Archivo variável, Source Sans 3 variável + itálico, IBM Plex Mono regular/negrito, Newsreader itálico), subconjuntos latin + latin-ext, `@font-face` em `globals.css`
- [x] Componentes base: `Botao`, `Selo`, `Campo`, `Container`
- [x] Layout público: `Cabecalho` (com menu mobile deslizante), `Rodape` (3 colunas + assinatura), `BotaoWhatsApp` flutuante
- [x] `src/lib/status-saida.ts`, `src/lib/datas.ts`, `src/lib/whatsapp.ts`
- [x] Queries GROQ em `src/sanity/queries.ts`: fragmentos `IMAGEM`/`SEO`/`CARTAO_SAIDA`, `PROXIMAS_SAIDAS`, `SAIDAS_HOME`, `SAIDAS_REALIZADAS`, `SAIDA_POR_SLUG`, `SLUGS_SAIDA`, `GRUPO_POR_SLUG`, `CONFIGURACAO`
- [x] Páginas `/saidas` e `/saidas/[slug]` (hero, fita de altimetria, roteiro dia a dia, incluso/não incluso, galeria, depoimentos, FAQ, CTA de reserva via WhatsApp)
- [x] `CardSaida` e `FitaAltimetria`
- [x] Webhook `/api/revalidate`
- [x] Scripts `scripts/seed.ts` e `scripts/limpar-seed.ts`
- [x] `next.config.ts` com `remotePatterns` do CDN do Sanity e headers de segurança
- [x] `sanity-typegen.json` configurado para gerar tipos em `src/sanity/types.ts` (local documentado pelo projeto)

## Em andamento agora (retomar por aqui)

- [ ] Conferência visual no navegador (Bruno faz manualmente — extensão do Chrome não conecta nesta sessão)
- [ ] Deploy na Vercel com domínio provisório
- [ ] Depois do deploy: rodar `npm run seed:limpar` quando o conteúdo real do Felipe estiver pronto (lembrar — está tudo com prefixo `[EXEMPLO]` e fotos do picsum)

## Falta fazer (Fase 1)

- [x] ~~Confirmar `npm run build` limpo~~ ✅ fechou sem erro nem aviso
- [x] ~~Testar `npm run dev` nas rotas principais~~ ✅ verificado por `curl` (`/`, `/saidas`, `/studio`, 404 de saída inexistente)
- [x] ~~Commitar o código da Fase 1~~ ✅ commit `6ab5a38`
- [x] ~~Rodar o seed~~ ✅ 36 documentos gravados
- [x] ~~Olhar `/saidas` e uma `/saidas/[slug]` de verdade~~ ✅ confirmado por `curl` e pelo build estático (4 páginas geradas) — **falta a conferida visual real no navegador**, em andamento pelo Bruno
- [ ] Deploy na Vercel com domínio provisório

---

## Bloqueios resolvidos nesta sessão

Corrigidos na ordem em que apareceram, durante `npm run build`, até fechar 100% limpo:

1. `next-sanity`/`sanity` mais recentes exigem Next 16 → fixado `next-sanity@11.6.13` + `sanity@5.x` (linha compatível com Next 15)
2. `useEffectEvent` não exportado de `react` → baixado `sanity`/`@sanity/vision` de `5.31.1` para `5.0.0` (a partir da `5.5.0` o pacote troca o polyfill `use-effect-event` pelo `React.useEffectEvent` nativo, que não existe estável em React 19.2.4 — `5.0.0` é a única versão estável da linha 5.x compatível)
3. Ícones nomeados (`CalendarIcon`, `CogIcon` etc.) não existem mais em `@sanity/icons` → trocado para o mapa `icons.calendar`, `icons.cog` etc.
4. Erro de resolução do ESLint (`eslint-config-next/core-web-vitals`) → reescrito `eslint.config.mjs` com `FlatCompat` (o `eslint-config-next@15.5.22` instalado ainda só publica config no formato antigo, não flat config nativo)
5. Erro de tipo em `urlDaImagem` (`Image` do pacote `sanity` incompatível com o resultado do GROQ) → trocado o tipo do parâmetro para `SanityImageSource` do `@sanity/image-url`
6. `@typescript-eslint/no-explicit-any` em `saida.ts` (3 ocorrências) e import não usado em `CardSaida.tsx` → tipados `contexto.document`/`doc` com formas mínimas (`SanityDocument` + cast estreito) em vez de `any`, removido o import de `Link` que não era usado
7. `Failed to collect configuration for /studio/[[...tool]]` → `TypeError: (0, d.createContext) is not a function` — causa raiz: o build de React usado em Server Components (`react.react-server.js`) **não exporta `createContext`** (é uma limitação proposital do React), e o pacote `sanity` chama isso no topo do módulo. Como a página do Studio não tinha isolamento de cliente explícito, o Next tentava avaliar esse módulo no "mundo" de Server Components durante o build. **Corrigido** criando `src/components/EstudioCliente.tsx`, um Client Component que carrega o `NextStudio` via `next/dynamic` com `{ ssr: false }` — isso garante que todo o pacote `sanity` só é avaliado no navegador, nunca no servidor/build.
   - Também corrigido de passagem: aviso de depreciação do `@sanity/image-url` (`import createImageUrlBuilder from ...` → `import { createImageUrlBuilder } from ...`, export nomeado).
   - **Cuidado para não reabrir:** `package.json` fixa `sanity` e `@sanity/vision` em `"5.0.0"` **exato** (sem `^`). Rodar `npm install <algumpacote>` sem cuidado, ou apagar o `package-lock.json` e reinstalar, pode fazer o `^5.0.0` antigo voltar a flutuar para a versão mais nova — foi exatamente isso que aconteceu no meio desta sessão e trouxe o erro do `useEffectEvent` de volta. Se for atualizar o Sanity no futuro, primeiro checar se `npm view sanity@<versao> dependencies.use-effect-event` retorna algo — se vier vazio, a versão já depende do hook nativo do React e vai quebrar até o React estabilizar `useEffectEvent`.

## Bloqueios resolvidos nesta sessão (seed e leitura)

8. `npm run seed` falhava com `Error: Configuration must contain projectId` → os scripts (`scripts/seed.ts`, `scripts/limpar-seed.ts`) usavam `import 'dotenv/config'` puro, que carrega `.env` — mas o projeto só tem `.env.local` (convenção do Next.js). **Corrigido** trocando para `config({ path: '.env.local' })` do pacote `dotenv` nos dois scripts.
9. Depois do seed rodar certo, `/saidas` continuava mostrando "Nenhuma saída aberta" mesmo com os 4 documentos gravados no Sanity. Causa: **o dataset não devolve documentos dos tipos de conteúdo (`saida`, `ramal`, `depoimento`, `post`, `faq`, `material`, `lead`) para requisições sem token** — só `configuracao`, `quemSou` e imagens ficam visíveis anonimamente (confirmado testando a API do Sanity direto com e sem `Authorization: Bearer`, resposta anônima vinha com `"omitted":[{"reason":"permission"}]`). Isso contraria o que a documentação (`06-QUERIES-E-DADOS.md`) assume — que o dataset é público e não precisa de token pra leitura normal, só pra preview de rascunho. **Corrigido** passando `token: process.env.SANITY_API_READ_TOKEN` no client público (`src/sanity/client.ts`). Isso é na verdade mais seguro do que a doc sugeria: o tipo `lead` guarda contato de gente que preencheu formulário, e isso nunca deveria ser publicamente consultável via GROQ sem autenticação.
   - **Cuidado para não reabrir:** se o `SANITY_API_READ_TOKEN` for revogado/expirar, `/saidas` e as páginas de detalhe voltam a aparecer vazias silenciosamente (sem erro no build, já que o client só retorna array vazio) — se isso acontecer, gerar um novo token Viewer e atualizar `.env.local` e a env var na Vercel.

## Desvios da documentação (registrados para não reabrir decisão à toa)

- **`Docs/` → `docs/`**: pasta renomeada para minúsculo a pedido do Bruno (evita 404 em deploy Linux/Vercel, case-sensitive).
- **Next.js pinado em `15.5.22`**: `create-next-app@latest` instala Next 16 por padrão; `CLAUDE.md` fecha a stack em Next 15, então a versão foi forçada de volta.
- **`next-sanity` pinado em `11.6.13`** (não a última, `13.x`): a partir da v12 o pacote exige Next 16. A doc original menciona "next-sanity 9.x", mas essa versão está descontinuada há muito tempo no registro do npm — a documentação foi escrita antes do código existir (como o próprio `CLAUDE.md` alerta) e o ecossistema Sanity andou bastante desde então.
- **`sanity` e `@sanity/vision` pinados em `5.0.0` exato** (sem `^`, não a última `6.x` nem a mais recente da própria linha 5, `5.31.1`): a partir de `5.5.0` a linha 5.x passa a exigir `React.useEffectEvent` nativo, que não existe estável em React 19.2.4. `5.0.0` é a versão estável mais recente que ainda usa o polyfill `use-effect-event`. **Não usar `^` nessas duas dependências.**
- **`package.json` ganhou um bloco `overrides`** fixando `react`/`react-dom` em `19.2.4` — necessário porque `@sanity/cli` (ferramenta de linha de comando, não entra no bundle do site) instalava uma cópia `19.2.8` que gerava duas versões de React na árvore.
- **`src/components/EstudioCliente.tsx` é um arquivo novo, fora da documentação original**: um Client Component que carrega o Studio via `next/dynamic({ ssr: false })`. Necessário porque o pacote `sanity` chama `React.createContext` no topo do módulo, e o build de React para Server Components não tem essa função. `src/app/studio/[[...tool]]/page.tsx` agora renderiza `<EstudioCliente />` em vez de `<NextStudio config={config} />` diretamente.
- **`@sanity/icons` mudou de API**: não exporta mais ícones nomeados (`CalendarIcon` etc.), agora usa um mapa `icons.nome-do-icone`. Todos os schemas e a estrutura do Studio foram ajustados.
- Home (`/`) recebeu uma versão **mínima** (hero + CTA para `/saidas`) — a home completa de 8 blocos do documento 02 é escopo da Fase 2, conforme o roadmap.

---

## Como retomar

1. Ler este arquivo primeiro.
2. Rodar `npm run build` e ver se os bloqueios acima já foram resolvidos ou se sobrou algum novo.
3. Seguir a lista "Falta fazer (Fase 1)" na ordem.
