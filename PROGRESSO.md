# Progresso do projeto — Felipe Muniz / Caminho da Fé

Diário de bordo do desenvolvimento. Atualizado a cada avanço, para retomar o trabalho sem perder contexto entre sessões.

---

## Onde estamos agora

**Sessão atual: auditoria de código + identidade visual exata da hero, tudo local, ainda sem commit.** Partiu de uma revisão pedida pelo Bruno (rate limit, duplicação de `statusDaSaida`, tokens de raio/sombra, fuso, `prefers-reduced-motion`) e evoluiu para uma rodada de fidelidade total ao protótipo `test_hero/prototipo/cinema-basilica.html`, documentada no documento 04, seção 5.1.1: paleta `--hero-*` própria, fonte Jost, Cormorant Garamond itálico, botões em pílula na hero e no `Cabecalho` (agora sitewide). Achado e corrigido de passagem: `font-[var(--fonte-x)]` nunca aplicou `font-family` em lugar nenhum do site (bug de sintaxe do Tailwind v4, 32 arquivos corrigidos para `[font-family:var(--fonte-x)]`) e a imagem de fundo da cena 1 estava sendo cortada num formato retrato errado. Testado no navegador, comparado lado a lado com o protótipo (servidor estático local), `npm run build` limpo. **Aguardando autorização pra commit.**

Sessão anterior (histórico, já commitada e no ar): trocou a hero da home por uma sequência fixa no scroll com 3 cenas, mais um cabeçalho transparente-no-topo sitewide. Últimos commits em produção antes dela (`2bf8111`) eram das Fases 3/4. O bloqueio de sessões anteriores segue: `RESEND_API_KEY` vazia — ver "Pendências" abaixo.

**URL de produção (ainda com a hero antiga):** https://felipemuniz-site.vercel.app
**Studio de produção:** https://felipemuniz-site.vercel.app/studio

A Fase 1 (fundação) está 100% concluída, testada e no ar — detalhes na seção abaixo, mantidos como histórico.

### Hero cinematográfica (fora do roadmap das fases, feita a pedido do Bruno)

A home ganhou uma hero em três cenas presas ao scroll — **lugar** (foto em Ken Burns) → **citação** (seta se pinta na tela, linha devocional) → **guia** (retrato do Felipe num quadro). Veio de um protótipo isolado (`test_hero/prototipo/cinema-basilica.html`, HTML/CSS/JS puro, várias rodadas de ajuste direto com o Bruno) que depois recriei como componente React de verdade (`src/components/home/HeroCinematico.tsx`), usando os tokens reais do site em vez da paleta ad-hoc do protótipo.

**Isso passou por duas rodadas de conflito com o documento 04, nenhuma decidida sozinho:**
1. Primeira rodada: "sem parallax" e a cena do guia duplicando o bloco "Quem guia" — o Bruno decidiu abrir exceção documentada e cortar a cena do guia (hero ficou só lugar → citação).
2. Segunda rodada: depois de ver as duas versões ao vivo, o Bruno pediu de volta o visual exato do protótipo original — cena do guia de volta, tipografia Cormorant Garamond (não a Archivo do site), barra dourada sob o título, e cabeçalho transparente com a seta ao lado do nome. Perguntei sobre o escopo do cabeçalho (só a home ou o site inteiro) e escolhi a solução tecnicamente mais limpa (ver abaixo) em vez de reabrir pergunta.

O documento 04 (seção 5.1) tem o histórico completo registrado — inclusive a explicação de por que a cena do guia voltou sem duplicar conteúdo no Sanity (reaproveita `quemSou.foto`, não tem imagem própria). **Isso importa pra quem retomar depois:** três cenas é o teto combinado pra este bloco especificamente; qualquer pedido futuro de mais uma cena ou mais um efeito preso ao scroll precisa passar pelo mesmo crivo da Credencial.

O que mudou no código, além do componente:
- `configuracao` ganhou o campo `heroCitacao` (texto, obrigatório, grupo "Página inicial") — única peça de conteúdo genuinamente nova. `heroTitulo`/`heroSubtitulo`/`heroImagem` reaproveitados sem mudar de significado; a cena do guia reaproveita `quemSou.foto` (mesma foto do bloco "Quem guia" mais abaixo na home).
- `public/marca/seta-amarela.png` — ativo real fornecido pelo cliente (não é placeholder), copiado de dentro de `test_hero/`.
- **Fonte nova, uso restrito**: Cormorant Garamond (`--fonte-hero` em `tokens.css`), auto-hospedada em `public/fontes/` (pesos 500/600, latin + latin-ext, baixada da própria Google Fonts via `curl` e convertida — mesmo padrão das outras 4 fontes do site). Usada só no título da cena 1 e no nome na cena 3, no mesmo espírito restrito da Newsreader.
- **`Cabecalho` virou `'use client'`, `fixed` (não mais `sticky`), transparente no topo e sólido depois de ~40px de scroll.** Isso é sitewide, não só na home — decisão técnica, não só de design: `sticky` reserva espaço no fluxo e nunca fica "por cima" de nada (só gruda no topo depois de rolar), então não tem como flutuar sobre a foto da hero sem virar `fixed`. Como `fixed` tira o cabeçalho do fluxo, `<main>` em `layout.tsx` ganhou `pt-16` de compensação (senão o topo de toda página ficaria escondido atrás do cabeçalho) — e a hero cancela esse `pt-16` com `-mt-16` pra ficar atrás do cabeçalho de propósito. Testado nas outras páginas (saídas, quem-sou): idêntico visualmente a antes, porque o fundo `--azul-profundo` já é a mesma cor da barra sólida.
- Ganhou de volta a barra dourada (`--dourado`, não `--amarelo-seta` — é "filete decorativo", token certo pra isso) sob o título da cena 1.
- Suavização por interpolação (`requestAnimationFrame` + `IntersectionObserver`), `inert` (React 19) em vez de `aria-hidden`+`pointer-events` manual pra tirar a cena inativa do foco de teclado, `prefers-reduced-motion` com fallback via variantes `motion-reduce:` do Tailwind (cenas empilhadas, sem prender o scroll).
- Régua de scroll voltou a `220vh` (era `170vh` na versão de 2 cenas) com os pontos de corte do protótipo original — 3 cenas precisam de mais distância que 2. Documentado dentro do próprio componente.
- **`npm run seed` não foi rodado de novo** — o dataset real ainda não tem `heroCitacao` preenchido (o campo aparece com aviso de obrigatório no Studio). O componente tem um texto de fallback, então o site funciona normalmente enquanto isso; rodar o seed (ou preencher direto no Studio) antes de considerar isso fechado de verdade.

### Testado nesta sessão

Local (`npm run dev`): as três cenas transicionam sem sobra de espaço morto, o cabeçalho fica transparente no topo (foto visível por trás) e sólido depois de rolar um pouco, em todas as páginas testadas (home, saídas, quem-sou) sem regressão visual. O scroll solta sozinho direto pro bloco "Próximas saídas". Teclado: Tab pula os CTAs das cenas inativas e entra neles normalmente (com contorno visível) assim que cada cena assume — `inert` funcionando. Console sem erro em nenhuma página. `npm run build` limpo (typegen + build de produção, sem erro nem aviso de tipo/lint) em todas as rodadas. **Não testado**: `prefers-reduced-motion` ao vivo (mesma limitação de sempre neste ambiente pra emular a media query) — a lógica foi revisada com cuidado, mas vale um teste manual do Bruno antes do deploy.

### Pendências desta hero

- Rodar `npm run seed` (ou preencher manualmente no Studio) pra `heroCitacao` parar de aparecer vazio no dataset real.
- Testar `prefers-reduced-motion` de verdade (SO ou DevTools) antes do deploy.
- Decidir com o Bruno se commita/envia — nada foi commitado ainda.

### O que entrou nesta sessão (Fases 3 e 4)

Partindo de onde a sessão anterior parou (Fase 2 pronta localmente, sem deploy), esta sessão implementou o restante do roadmap do documento 09:

- **Queries novas** em `src/sanity/queries.ts`: `DEPOIMENTOS`, `FAQ_COMPLETA` (com `respostaTexto` via `pt::text()` para o JSON-LD), `RAMAIS`, `RAMAL_POR_SLUG`, `SLUGS_RAMAL`, `POSTS_POR_CATEGORIA`, `SITEMAP`.
- **`src/lib/seo.ts`**: os quatro helpers de JSON-LD do documento 07 (`jsonLdOrganizacao`, `jsonLdSaida`, `jsonLdFaq`, `jsonLdArtigo`), tipados com os tipos gerados em vez de `any`. Injetados no layout do site (Organização, em toda página), na página da saída (TouristTrip), na home e em `/perguntas-frequentes` (FAQPage) e em `/blog/[slug]` (Article).
- **Páginas institucionais novas**: `/o-caminho` (hub + grade de ramais) e `/o-caminho/[slug]` (página por ramal, com as próximas saídas daquele ramal), `/quem-sou`, `/depoimentos`, `/perguntas-frequentes` (agrupada por categoria), `/contato`, `/politica-de-privacidade`. Todos os links do Cabeçalho/Rodapé que davam 404 desde a Fase 1/2 agora funcionam.
- **`/blog/categoria/[slug]`** — as 4 categorias do post (`preparacao`, `espiritualidade`, `roteiros`, `relatos`).
- **`/grupo/[slug]`** (Fase 4, RF-05) — roteiro completo, incluso/não incluso, orientações do grupo em Portable Text. **De propósito, sem `generateStaticParams`**: o slug é secreto, então a página é sempre renderizada sob demanda, para o slug nunca aparecer em nenhuma lista gerada no build. `robots: { index: false, follow: false }` no `generateMetadata`, além do bloqueio em `robots.ts`.
- **`sitemap.ts` e `robots.ts`** — do documento 07, usando a query `SITEMAP` nova.
- **Imagem OG dinâmica** da saída (`saidas/[slug]/opengraph-image.tsx`) via `ImageResponse`.
- **Link para a política de privacidade** adicionado no texto de consentimento dos dois formulários (`FormularioLead`, `FormularioReserva`) — fechava o requisito 02.4, que dependia da página existir.
- **Auditoria Lighthouse mobile** (critério de aceite do documento 01). Achei que **nenhuma imagem do site usava a prop `sizes`** em `next/image` com `fill` — gap pré-existente das Fases 1/2, não só desta sessão — e que a prop `priority` nesta versão do Next **não** liga `fetchPriority="high"` sozinha (são props independentes no código do `next/image` instalado). Corrigi as duas coisas em todas as imagens `fill` do projeto (cards, heróis, galeria, avatares). Testado três vezes: local sem a correção (home 82), local com a correção (home 89, saída 97) e, depois do deploy, **contra a URL pública real** — home **95**, LCP caiu para 2,8s. Acessibilidade, Boas Práticas e SEO em **100** em todos os três testes. **Critério de aceite batido**: Lighthouse mobile ≥ 90 nas quatro categorias, confirmado em produção.
- **`npm run build` limpo** em todas as rodadas (typegen + build de produção, sem erro nem aviso de tipo).

### Segunda leva: lacuna de RF-02.2 e vídeo de depoimento (RF-04.2)

Depois do primeiro deploy, o Bruno perguntou o que ainda faltava construir. Revisando o documento 01 contra o que estava no ar, achei uma lacuna real, não só pendência externa:

- **RF-02.2 (obrigatório) estava incompleto desde a Fase 2**: o visitante que pedia um material nunca recebia o PDF — nem por e-mail, nem por link direto. Só o Felipe era notificado. Corrigido: `FormularioLead` ganhou a prop `materialSlug`; `/api/lead` busca o material (`MATERIAL_POR_SLUG`) e manda um e-mail ao visitante com o link do arquivo quando a `RESEND_API_KEY` existir; `/obrigado` passou a ler `?material=` e mostrar um botão de download direto. Como o material de seed (`checklist-do-peregrino`) não tem PDF de verdade carregado no Studio (o script de seed nunca subiu um arquivo — comentário no próprio documento 10 já avisava disso), o fallback mostra "o Felipe vai te enviar o arquivo em breve" em vez de link quebrado. **Testado de ponta a ponta no navegador**: preenchi o formulário de `/materiais/checklist-do-peregrino`, confirmei o documento `lead` gravado no Sanity com `origem: "material:checklist-do-peregrino"`, o redirecionamento pra `/obrigado?material=checklist-do-peregrino` e a mensagem de fallback certa — depois apagado por ser só teste.
- **RF-04.2 (desejável)**: o campo `videoUrl` do depoimento já existia no schema e na query, mas não aparecia em nenhuma página. Criado `src/lib/video.ts` (extrai o ID de URLs do YouTube) e `src/components/conteudo/VideoDepoimento.tsx` — embed real (`iframe` do `youtube-nocookie.com`, carregado com `loading="lazy"`) quando a URL é do YouTube, link "Ver depoimento em vídeo" abrindo em nova aba pra qualquer outra URL (Instagram etc., sem carregar o script pesado do widget deles). Usado em `/depoimentos` e na lista de depoimentos da página da saída.

### Testado nesta sessão

No navegador (dev server local): `/o-caminho`, `/o-caminho/aguas-da-prata`, `/quem-sou`, `/depoimentos`, `/perguntas-frequentes` (acordeão abre/fecha, testado por clique), `/contato`, `/politica-de-privacidade`, `/blog/categoria/preparacao`, `/grupo/[slug-real]` (peguei um slug real do dataset via GROQ direto pra conferir — não existe listagem pública desses slugs, é assim mesmo). Todas devolveram 200 e renderizaram sem erro no console. JSON-LD conferido no DOM (`document.querySelectorAll('script[type="application/ld+json"]')`) na home (`LocalBusiness` + `FAQPage`) e por leitura de código nas demais páginas. Navegação por teclado (Tab) com foco visível conferida em `/o-caminho`. **Não testado em 375px** nem em Rich Results Test do Google (esse exige URL pública) — mesma limitação já registrada nas sessões anteriores para o teste de viewport.

### Pendências antes de considerar o site pronto para o domínio definitivo

- **`RESEND_API_KEY` continua vazia** — sem ela, os leads gravam no Sanity mas nenhum e-mail sai. Precisa criar a conta no Resend, verificar o domínio e colar a chave no `.env.local` e nas variáveis de ambiente da Vercel.
- Testar em 375px de verdade (o ambiente de automação não força janela estreita) e em iPhone/Android reais em 4G — Fase 4, item "Teste real em iPhone e Android".
- Rich Results Test do Google para `TouristTrip` e `FAQPage` — agora dá pra fazer, já que existe URL pública (`search.google.com/test/rich-results`).
- Revisão de todo o texto do site, domínio definitivo, migração pra Cloudflare (se for a decisão), treinamento do Felipe, vídeo de 10 min, entrega dos acessos — todos são itens do documento 09 seção 3 (Fase 4) que dependem do Bruno e do Felipe, não são coisa que eu resolvo sozinho no código.
- Google Search Console ainda não instalado (documento 07, seção 10) — depende de domínio definitivo ou, ao menos, de decidir verificar a URL de preview da Vercel.

Todos os commits até `18890ff` já estão no GitHub e no ar na Vercel.

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
