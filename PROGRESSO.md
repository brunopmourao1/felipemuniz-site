# Progresso do projeto — Felipe Muniz / Caminho da Fé

Diário de bordo do desenvolvimento. Atualizado a cada avanço, para retomar o trabalho sem perder contexto entre sessões.

---

## Onde estamos agora

**Fase 2 — Conversão, concluída localmente. Falta só o deploy.**

**URL de produção (ainda com o código da Fase 1):** https://felipemuniz-site.vercel.app
**Studio de produção:** https://felipemuniz-site.vercel.app/studio

A Fase 1 (fundação) está 100% concluída, testada e no ar — detalhes na seção abaixo, mantidos como histórico.

### O que entrou na Fase 2

- **Home completa**, os 8 blocos do documento 02: hero (com a segunda ação "Receber o guia de preparação"), próximas saídas, quem guia (foto + história + números), como funciona (4 etapas), **A Credencial**, preparação, captura (formulário de material) e FAQ resumida em acordeão.
- **Módulo Credencial** (`src/components/credencial/`): carimbos com rotação e opacidade determinísticas derivadas do `_id` (`src/lib/credencial.ts`), fundo pergaminho, clique/toque revela o depoimento completo — testado no navegador.
- **Rotas `/api/lead` e `/api/reserva`**: honeypot, rate limit em memória, validação Zod (`src/lib/schemas.ts`), grava documento `lead` no Sanity, envia e-mail pelo Resend só se `RESEND_API_KEY` estiver preenchido (ainda vazio — ver pendências). Testado de ponta a ponta pelo navegador: formulário → API → documento gravado no Sanity (conferido e depois removido, era só teste) → redirecionamento para `/obrigado`.
- **Formulários** (`FormularioLead`, `FormularioReserva`): React Hook Form + Zod, mensagens de erro em português, acessíveis (`aria-invalid`, `aria-describedby`, `role="alert"`).
- **Barra fixa de reserva no mobile** (`BarraReserva`): aparece via `IntersectionObserver` quando o cabeçalho da saída sai da tela, `md:hidden`. O botão flutuante do WhatsApp sobe automaticamente pra não colidir com ela (classe `tem-barra-reserva` no `<body>`).
- **`/materiais/[slug]` e `/obrigado`**: landing de captura com o `FormularioLead`, confirmação genérica pós-envio.
- **`/blog`, `/blog/[slug]` e `/preparacao`** — antecipados da Fase 3 por decisão explícita do Bruno, só para os links da home ("Preparação" → hub, cada post → `/blog/[slug]`) não caírem em 404. Versão mínima: sem paginação, sem `/blog/categoria/[slug]`, sem JSON-LD (isso fica para a Fase 3 de verdade).
- Queries novas em `src/sanity/queries.ts`: `QUEM_SOU`, `DEPOIMENTOS_HOME`, `FAQ_HOME`, `MATERIAL_PRINCIPAL`, `MATERIAL_POR_SLUG`, `POSTS_HOME`, `POSTS`, `POST_POR_SLUG`, `SLUGS_POST`.

### Testado nesta sessão

`npm run build` limpo (typegen + build de produção sem erro nem aviso de tipo). No navegador: os 8 blocos da home, o carimbo da Credencial (clique revela/esconde), envio real do formulário de captura e do formulário de reserva (confirmado o documento `lead` gravado no Sanity com os campos certos, depois apagado por ser só teste), `/blog`, `/blog/[slug]`, `/preparacao`, `/materiais/[slug]`, `/obrigado`, acordeão de FAQ, console sem erros. **Não testado visualmente em 375px** nesta sessão (mesma limitação de sempre — `resize_window` não funciona neste ambiente); o CSS usa os mesmos padrões responsivos já validados na Fase 1, mas vale um teste manual do Bruno na barra fixa de reserva e no formulário de captura em tela pequena antes do deploy.

### Pendências antes de fechar a Fase 2 de verdade

- **`RESEND_API_KEY` continua vazia.** Sem ela, o lead é gravado no Sanity mas nenhum e-mail sai (a rota detecta a ausência da chave e pula o envio silenciosamente, não quebra). Precisa criar a conta no Resend, verificar o domínio e colar a chave em `.env.local` e na Vercel antes de o marco "formulário chega no e-mail do Felipe" estar realmente cumprido.
- **Deploy pendente**: todo o trabalho acima está só local. Falta commitar, dar push e fazer o deploy na Vercel (com a `RESEND_API_KEY` cadastrada lá também).
- Links do menu principal para `/o-caminho` e `/quem-sou` continuam quebrados (404) — pré-existentes da Fase 1, ficam para a Fase 3.

Commit da Fase 2 (local, sem push ainda): `c8c7b8b`.
Commits da Fase 1: `6ab5a38` (base), `a9ac756` (diário), `53c14d8` (fix dos scripts de seed + client de leitura), `56c55c1` (diário), `14b0bda` (página 404 em português), `dfa47e0` (diário), `448e105` (deploy confirmado), `30061f7` (webhook de revalidação).

**Marco da Fase 1 batido:** o Felipe consegue entrar em `/studio`, cadastrar/editar uma saída, publicar, e ela aparece no site (testado o ciclo completo, inclusive a revalidação de cache).

**Marco da Fase 2 ainda não batido:** falta a `RESEND_API_KEY` para o e-mail realmente chegar na caixa do Felipe (hoje o lead grava no Sanity, mas o e-mail é pulado em silêncio) — ver "Pendências" acima.

### Parada de hoje — retomar amanhã a partir daqui

Sessão pausada a pedido do Bruno logo após o commit `c8c7b8b`. Nada foi enviado pro GitHub nem implantado na Vercel — é só código local commitado. Para retomar: ver "Pendências antes de fechar a Fase 2 de verdade" acima (chave do Resend e decisão sobre push/deploy) antes de considerar a Fase 2 encerrada.

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

**Fase 1 fechada.** Próximos passos são de Fase 2 ou manutenção:

- [x] ~~Webhook de revalidação no Sanity~~ ✅ Criado em `sanity.io/manage` → projeto → API → Webhooks: "Revalidar site (producao)", apontando para `https://felipemuniz-site.vercel.app/api/revalidate`, gatilho em Create/Update/Delete, dataset `production`, mesmo segredo já usado na Vercel. **Testado de ponta a ponta**: editei uma saída no Studio de produção, publiquei, e o site atualizou sozinho em poucos segundos, sem chamada manual — confirma que o Felipe vai ver a mudança quase na hora depois de publicar.
- [ ] Quando o conteúdo real do Felipe estiver pronto: rodar `npm run seed:limpar` (remove os documentos com prefixo `seed.`) e depois preencher os dados reais — lembrar que hoje **o site em produção está com conteúdo 100% fictício** (`[EXEMPLO]`, fotos do picsum). Antes de divulgar o link pra qualquer pessoa de fora, isso precisa estar resolvido.
- [ ] Considerar restringir quem pode logar no Studio de produção (hoje qualquer conta com acesso ao projeto Sanity consegue editar — revisar em Access → Members antes de dar o acesso pro Felipe).

## Falta fazer (Fase 1) — tudo concluído ✅

- [x] Confirmar `npm run build` limpo — fechou sem erro nem aviso, testado múltiplas vezes
- [x] Testar `npm run dev` nas rotas principais — verificado visualmente no navegador
- [x] Commitar o código da Fase 1 — commit `6ab5a38`
- [x] Rodar o seed — 36 documentos gravados
- [x] Olhar `/saidas` e uma `/saidas/[slug]` de verdade — hero, fita de altimetria, roteiro, incluso/não incluso, galeria, depoimentos (Newsreader itálico), FAQ, CTA, tudo renderizando certo
- [x] Testar o Studio de ponta a ponta — login, estrutura em português, edição de um campo, publicação, e o dado aparecendo no site depois de revalidar
- [x] Testar navegação por teclado — foco visível confirmado (contorno no botão via Tab)
- [x] Página 404 em português — corrigida nesta sessão (estava em inglês, violava regra do `CLAUDE.md`)
- [x] **Deploy na Vercel com domínio provisório** — https://felipemuniz-site.vercel.app, testado no ar (home, saídas, detalhe, 404, Studio)

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

10. Ao abrir o site na conferência visual, a página vinha **sem estilo nenhum** — sem cores, sem fonte, o CSS (`layout.css`) e os chunks JS voltando `503` do servidor de dev. Causa: havia **dois `next dev` rodando ao mesmo tempo** (um antigo, esquecido de uma sessão anterior, na porta 3000; outro novo, iniciado nesta sessão, que caiu na 3001 porque a 3000 já estava ocupada) — os dois escrevendo simultaneamente na mesma pasta `.next/`, corrompendo o cache de build (`Cannot find module './1331.js'`, `Cannot find module './vendor-chunks/@sanity.js'` no log do servidor). **Corrigido** matando todos os processos `node.exe`, apagando `.next/` e subindo um único `npm run dev` limpo. **Cuidado para não reabrir:** antes de rodar `npm run dev`, checar se já não tem um servidor de outra sessão rodando (`tasklist | grep node` no Git Bash) — nunca depender da porta trocar sozinha (3001, 3002...) como sinal de "tá tudo bem", isso é sintoma do problema, não solução.

11. **`.next/` corrompeu de novo**, desta vez porque rodei `npm run build` (produção) enquanto o `npm run dev` ainda estava de pé — os dois usam formatos de cache incompatíveis na mesma pasta `.next/`. **Regra para não reabrir: nunca rodar `npm run build` com o `npm run dev` ligado.** Sempre `taskkill //F //IM node.exe` (mata todo node — cuidado se houver outro projeto node rodando) antes de trocar entre os dois, e `rm -rf .next` se already corrompeu.
12. **O Studio pedia "Connect this studio to your project"** ao abrir `/studio` pela primeira vez nesta sessão — comportamento novo do Sanity, que exige ou registrar o Studio (produção) ou autorizar `localhost` como "development host". **Resolvido** clicando em "Add development host", que abre uma janela de login no `sanity.io/manage` (conta do Bruno) e cadastra `http://localhost:3000` em **API → CORS origins** com credenciais permitidas. Depois disso, o Studio ainda pediu login próprio (Google/GitHub/e-mail) — é o login normal de quem vai editar (Felipe também vai precisar disso). Ambos os logins já estão feitos nesta máquina.
13. **`SANITY_API_WRITE_TOKEN`/`SANITY_REVALIDATE_SECRET` vazio** impedia testar o webhook de revalidação. Gerado com `openssl rand -base64 32` e salvo no `.env.local`. Testado manualmente simulando uma chamada assinada do Sanity (script descartável, não commitado) contra `/api/revalidate` — funcionou: `revalidateTag` limpou o cache e a mudança feita no Studio (vagas disponíveis) apareceu em `/saidas` depois da chamada. **Falta só** cadastrar o webhook de verdade no painel do Sanity (Fase 2, depois que existir uma URL de produção).
14. **A página 404 vinha em inglês** ("This page could not be found") — o `not-found` padrão do Next, nunca sobrescrito. Violava a regra inviolável do `CLAUDE.md` ("português em tudo que o usuário final vê"). **Corrigido** com `src/components/PaginaNaoEncontrada.tsx` (compartilhado) usado em `src/app/(site)/not-found.tsx` (rotas dentro do site, com cabeçalho/rodapé) e `src/app/not-found.tsx` (rotas totalmente fora dos grupos existentes, ex. `/blog` antes de a Fase 3 criar a página — sem cabeçalho/rodapé, mas ainda em português).

## Teste em 375px (mobile)

A extensão do Chrome não conseguiu forçar uma janela estreita neste ambiente (`resize_window` não teve efeito — tela virtual fixa em ~2560px). Ficou confirmado por leitura de código que `Cabecalho.tsx`/`MenuMobil.tsx` usam os breakpoints certos do Tailwind (`hidden md:flex` / `md:hidden`) e que o menu mobile tem ARIA, fecha com Esc e respeita `prefers-reduced-motion`. **O Bruno testou manualmente no próprio navegador nesta sessão e confirmou que está funcionando.**

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
3. Se a Fase 2 ainda não foi implantada: conferir as "Pendências antes de fechar a Fase 2 de verdade" no topo deste arquivo (chave do Resend, deploy) antes de seguir para a Fase 3.
