# 04 — Design system e direção visual

---

## 1. Ponto de partida

A marca já existe e é boa. O feed do Felipe tem uma consistência visual que a maioria dos guias de peregrinação não tem: azul-marinho profundo, amarelo-ouro, tipografia condensada em caixa alta com serifas italianas nos momentos devocionais, e a **seta amarela** como símbolo central.

A seta não é uma escolha gráfica arbitrária — é a sinalização oficial da trilha. Todo peregrino associa aquela seta amarela a "você está no caminho certo". O Felipe já se apropriou disso na logo. O site estende esse vocabulário em vez de inventar outro.

**Diretriz:** este projeto não é um rebrand. É a extensão da identidade existente para um meio novo.

---

## 2. Paleta

O site é **escuro por padrão**, como o feed. Isso é escolha, não moda: o amarelo da sinalização só tem a força que tem porque aparece contra escuro — na trilha, contra o tronco e a pedra; no site, contra o azul-noite.

```css
/* src/styles/tokens.css */
:root {
  /* Base — o azul da noite antes de sair caminhando */
  --azul-profundo:  #0B2038;   /* fundo principal */
  --azul-noite:     #12314F;   /* superfícies elevadas, cards */
  --azul-sombra:    #071729;   /* rodapé, recuos, sobreposições */

  /* Acento — o amarelo da seta */
  --amarelo-seta:   #F5B31E;   /* CTA, selos, marcação de caminho */
  --dourado:        #C9A227;   /* filetes, tipografia decorativa, bordas */

  /* Texto */
  --nevoa:          #E4EBF1;   /* texto principal sobre escuro */
  --nevoa-fraca:    #9BB0C4;   /* texto secundário, legendas */

  /* Pergaminho — reservado ao módulo Credencial */
  --pergaminho:     #EFE6D2;
  --tinta-carimbo:  #7A2E2E;

  /* Terra — estados e trilha */
  --terra:          #7A4E24;

  /* Semânticos */
  --sucesso:        #4E9A6B;
  --alerta:         var(--amarelo-seta);
  --erro:           #C25B4A;
}
```

**Regra de uso do amarelo.** Aparece em três lugares e só neles: ações primárias, o selo de "últimas vagas", e a seta de navegação. Se o amarelo estiver em quatro lugares na mesma tela, um deles está errado. O amarelo é o que diz "vá por aqui" — se estiver em tudo, não diz nada.

**Sobre o pergaminho.** Fica trancado no módulo Credencial. Espalhar um bege quente pelo site inteiro produziria exatamente o visual de template que este projeto precisa evitar; contido a um bloco, ele lê como o que é — papel de credencial.

**Contraste verificado:** `--nevoa` sobre `--azul-profundo` = 13,2:1 (AAA). `--nevoa-fraca` sobre `--azul-profundo` = 6,8:1 (AA). `--azul-profundo` sobre `--amarelo-seta` = 11,4:1 (AAA) — texto escuro dentro do botão amarelo.

---

## 3. Tipografia

Três papéis, três famílias, cada uma com função declarada.

| Papel | Família | Uso |
|---|---|---|
| **Display** | **Archivo** (variável, larguras Condensed a Expanded) | Títulos em caixa alta. Ecoa a tipografia condensada bold que o Felipe já usa nas artes |
| **Corpo** | **Source Sans 3** | Texto corrido. Excelente com diacríticos do português, legível em tela pequena e luz forte |
| **Utilitária** | **IBM Plex Mono** | Números, distâncias, datas, altimetria, códigos de carimbo. É a voz dos dados do caminho |
| **Devocional** | **Newsreader Italic** | Uso muito restrito: citações de peregrinos e a linha devocional do hero |

Todas em Google Fonts, todas com licença aberta, todas auto-hospedadas em WOFF2 para não depender de terceiro no carregamento.

```css
:root {
  --fonte-display: 'Archivo', system-ui, sans-serif;
  --fonte-corpo:   'Source Sans 3', system-ui, sans-serif;
  --fonte-dados:   'IBM Plex Mono', ui-monospace, monospace;
  --fonte-citacao: 'Newsreader', Georgia, serif;
}
```

### Escala tipográfica

Fluida, sem quebras entre breakpoints.

```css
:root {
  --texto-xs:  0.75rem;
  --texto-sm:  0.875rem;
  --texto-base: 1rem;
  --texto-lg:  clamp(1.125rem, 1rem + 0.4vw, 1.25rem);
  --texto-xl:  clamp(1.375rem, 1.1rem + 1vw, 1.75rem);
  --texto-2xl: clamp(1.75rem, 1.3rem + 2vw, 2.5rem);
  --texto-3xl: clamp(2.25rem, 1.5rem + 3.5vw, 4rem);
  --texto-4xl: clamp(2.75rem, 1.6rem + 5.5vw, 5.5rem);
}
```

### Regras de tratamento

**Título de seção** — Archivo Condensed, peso 700, caixa alta, `letter-spacing: 0.08em`. Precedido de um *eyebrow* em IBM Plex Mono, caixa alta, `--dourado`, `0.15em` de espaçamento.

**Título de página** — Archivo, peso 800, `letter-spacing: -0.02em`, `line-height: 0.95`. Grande e apertado; o contraste com o eyebrow espaçado é o que dá ritmo.

**Corpo** — Source Sans 3 em 400, `line-height: 1.7`, largura máxima de 68 caracteres.

**Números** — sempre IBM Plex Mono com `font-variant-numeric: tabular-nums`. Isso importa de verdade: em tabelas de roteiro, "22 km" e "8 km" precisam alinhar.

**Nada de itálico decorativo.** A Newsreader Italic entra só onde há voz de outra pessoa — depoimento de peregrino — ou na linha devocional do hero. Espalhada, ela vira enfeite e apaga o próprio significado.

---

## 4. Espaçamento e grade

Escala de 4 px. Ritmo vertical baseado em múltiplos de 8.

```css
:root {
  --e-1: 0.25rem;  --e-2: 0.5rem;   --e-3: 0.75rem;  --e-4: 1rem;
  --e-6: 1.5rem;   --e-8: 2rem;     --e-12: 3rem;    --e-16: 4rem;
  --e-24: 6rem;    --e-32: 8rem;

  --largura-conteudo: 68ch;   /* texto corrido */
  --largura-site: 1200px;     /* contêiner geral */
  --largura-larga: 1440px;    /* galerias, hero */

  --raio-p: 2px;
  --raio-m: 4px;
  --raio-g: 8px;
}
```

**Raio de borda quase zero, de propósito.** A marca do Felipe é feita de formas retas e blocos angulares. Cantos arredondados de 12 px transformariam o site em app de startup. Os 2–4 px existem só para tirar a dureza absoluta.

**Espaço entre seções:** `--e-24` no mobile, `--e-32` no desktop. Generoso. O conteúdo é sobre caminhar longe — o site pode respirar.

---

## 5. Elemento assinatura — A Credencial

O peregrino do Caminho da Fé carrega uma **credencial**: uma caderneta que ele apresenta em cada pousada, igreja e ponto de apoio para receber um carimbo. No fim, a credencial cheia é a prova de que ele fez o caminho — e é o objeto que ele guarda a vida inteira.

O Felipe já entendeu o valor disso: um dos posts de melhor desempenho no feed dele é justamente sobre o carimbo, chamado de "o carimbo mais desejado do Brasil".

**A prova social do site é apresentada como uma credencial.**

Cada depoimento é um carimbo numa página de credencial. Cada carimbo traz o nome do peregrino, a cidade de origem, o mês da saída e o ramal — exatamente os dados que um carimbo real registra. Ao passar o cursor (ou tocar, no mobile), o carimbo se expande e revela o depoimento completo.

```
┌─────────────────────────────────────────────┐
│  CREDENCIAL DO PEREGRINO          nº 0247   │  ← IBM Plex Mono
│  ─────────────────────────────────────────  │
│                                             │
│    ╭────────╮    ╭────────╮   ╭────────╮    │
│    │ MARIA  │    │ JOÃO   │   │ ANA    │    │
│    │Campinas│    │ Santos │   │  BH    │    │
│    │ SET/25 │    │NOV/25  │   │ SET/25 │    │
│    ╰────────╯    ╰────────╯   ╰────────╯    │
│         ╭────────╮    ╭────────╮            │
│         │ PEDRO  │    │ LUCIA  │            │
│         │  SP    │    │Ribeirão│            │
│         ╰────────╯    ╰────────╯            │
│                                             │
│  247 peregrinos guiados · 18 saídas         │
└─────────────────────────────────────────────┘
```

**Execução.** Fundo `--pergaminho` com textura sutil de papel. Carimbos em `--tinta-carimbo`, cada um com rotação aleatória entre −8° e +8° e opacidade entre 0,85 e 1 — carimbo real nunca sai reto nem uniforme. A rotação é determinística, derivada do `_id` do depoimento, para não mudar a cada renderização e causar mudança de layout.

```ts
// rotação estável a partir do id
export function anguloDoCarimbo(id: string): number {
  const soma = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ((soma % 160) - 80) / 10; // −8.0° a +8.0°
}
```

**Isto é onde a ousadia do projeto é gasta.** Todo o resto — cards, listas, roteiro, formulários — é disciplinado e sóbrio. Um site com credencial *e* mapa animado *e* contador *e* parallax não teria assinatura nenhuma, teria só barulho.

---

## 5.1 Segunda exceção — a hero cinematográfica

A home abre com uma sequência de três cenas presa ao scroll: **lugar** (foto da Basílica de Aparecida, zoom lento) → **citação** (a seta se pinta na tela, linha devocional em Newsreader Italic) → **guia** (retrato do Felipe num quadro, mesma foto do bloco "Quem guia" mais abaixo). A página fica "no lugar" enquanto essas três cenas se revezam; só depois de completar a transição o scroll volta a rolar a home normalmente.

Isso é, na prática, o tipo de efeito que a seção 8 abaixo proíbe ("sem parallax"). É uma exceção deliberada, decidida em conversa com o Bruno — não uma brecha. O critério é o mesmo da Credencial: **um objeto de assinatura por vez, com justificativa específica deste projeto, não um padrão pra reaproveitar em qualquer bloco.**

Por que aqui e não em outro lugar:
- É a primeira coisa que todo visitante vê — o único ponto da página em que vale gastar esse orçamento de atenção.
- Usa dispositivos que o documento já sancionava separadamente, só nunca reunidos numa sequência: a seta amarela como indicador de rolagem do hero (seção 6) e a linha devocional em Newsreader Italic (seção 3). A hero cinematográfica não introduz vocabulário novo — organiza no tempo o que já existia no espaço.
- É construída sem biblioteca de animação (JS vanilla via hooks React, suavizado por interpolação, com `IntersectionObserver` decidindo quando rodar) — a mesma restrição técnica do resto do site, só aplicada a um efeito mais elaborado.
- Respeita `prefers-reduced-motion` de verdade: desliga o scroll-pin inteiro e mostra as três cenas empilhadas, roláveis normalmente.

**Histórico da cena 3 (registrado pra não reabrir a discussão à toa).** Na primeira versão desta seção, a cena do guia tinha sido cortada por duplicar o bloco "Quem guia". O Bruno viu as duas versões ao vivo (com e sem a cena 3) e decidiu trazê-la de volta — a repetição intencional funciona como reforço, não como redundância: a cena 3 é só uma virada de página rápida (retrato + nome + cargo), o bloco "Quem guia" é que carrega a história de verdade. Pra não duplicar conteúdo no Sanity, a cena 3 reaproveita a mesma foto do documento `quemSou` — não existe um campo de imagem separado pra ela.

**Tipografia da hero.** O título da cena 1 e o nome na cena 3 usam **Cormorant Garamond** (`--fonte-hero`), não a Archivo — uma segunda exceção de fonte, no mesmo espírito restrito da Newsreader (seção 3): uso travado a este bloco, não é a família de display do site.

**Cabeçalho.** Nesta hero (e em todo o site, por consequência) o `Cabecalho` ficou transparente no topo da página e só fica sólido (fundo `--azul-profundo`/95 + blur) depois de rolar ~40px. Em páginas sem imagem de fundo isso é imperceptível — o corpo já é `--azul-profundo`, então transparente-no-topo e sólido-ao-rolar têm quase a mesma cor. A logo ganhou o ícone da seta ao lado do nome.

**Não é precedente pra mais cenas.** A régua pra qualquer proposta futura de "mais uma cena" ou "mais um efeito preso ao scroll" continua sendo a mesma da Credencial: resolve um problema que nenhum dispositivo existente resolve, ou não entra. Três cenas é o teto combinado com o Bruno pra este bloco especificamente.

### 5.1.1 Terceira rodada — identidade visual própria (paleta, tipografia, cabeçalho)

Pedido do Bruno depois de ver a hero em produção: a cor, a tipografia de corpo e o raio de borda da hero cinematográfica passaram a seguir **exatamente** `test_hero/prototipo/cinema-basilica.html` — não mais uma tradução pros tokens gerais do site. Isso abre uma exceção real às regras deste documento, restrita a dois componentes:

- **Paleta própria**, tokens `--hero-*` em `tokens.css`, à parte da paleta geral (`--amarelo-seta`, `--azul-profundo` etc.): `--hero-ambar` (`#e8b34b`), `--hero-ambar-hover` (`#f2c96d`), `--hero-sobre-ambar` (`#10100c`), `--hero-fundo-base` (`#141a14`), `--hero-fundo-escuro` (`#0c0a08`).
- **Fonte Jost** (`--fonte-hero-corpo`), auto-hospedada como as demais, pro corpo/rótulos da hero e do cabeçalho — terceira exceção de fonte, no mesmo espírito da Newsreader e da Cormorant Garamond (seção 3): uso travado a esses dois blocos, não é a família de corpo do site (que continua Source Sans 3).
- **Cormorant Garamond ganhou o corte itálico peso 500** (além do 500/600 normal já existente) — a citação da cena 2 passou a usar Cormorant Garamond itálico, não mais Newsreader, pra bater com o protótipo.
- **Botões em pílula** (`rounded-full`, 999px) nos dois CTAs da cena do guia e no CTA do cabeçalho — os únicos lugares do site com esse raio; em todo o resto continua valendo a regra de 2–4px (seção 8).
- **Cabeçalho** (`Cabecalho.tsx`, sitewide): logo em Cormorant Garamond, links de menu em Jost caixa normal (não mais Archivo maiúsculo), CTA "Falar com o Felipe" em pílula com `--hero-ambar`. Visível em toda página do site, não só na home — decisão consciente do Bruno, não vazamento de escopo.

**Por que é exceção e não correção:** as regras gerais deste documento (tokens únicos de cor, raio 2–4px, lista fechada de fontes) continuam valendo pro resto do site. Essa rodada não as revoga — abre uma segunda paleta/raio/fonte, isolada nesses dois componentes, do mesmo jeito que a Credencial já é uma ilha de pergaminho/carimbo dentro de um site que por padrão é `--azul-profundo`/anguloso.

Junto com essa mudança, dois bugs reais foram corrigidos (não fazem parte da exceção, eram defeitos pré-existentes):
- `font-[var(--fonte-x)]` não aplicava `font-family` em lugar nenhum do site — no Tailwind v4 essa sintaxe é a utilidade de *peso* da fonte, não de família. A forma certa é a propriedade arbitrária `[font-family:var(--fonte-x)]`. Corrigido nos ~32 arquivos que usavam o padrão errado — Archivo, IBM Plex Mono e Newsreader agora realmente renderizam (antes, tudo caía pra Source Sans 3 herdada do `body`).
- A imagem de fundo da cena 1 pedia à Sanity um recorte fixo em retrato (`1920×2560`) de uma foto paisagem (`4727×2659`), cortando a fachada da Basílica. Corrigido pedindo só a largura (sem forçar altura), deixando o `object-fit: cover` do CSS recortar de verdade conforme a tela — igual o protótipo faz com a `<img>` crua.

---

## 6. Dispositivos estruturais

Cada um codifica informação real. Nenhum é decoração.

### A seta de percurso
Divisor entre seções: uma seta amarela apontando para baixo, igual à marcação de trilha. Não é ornamento — sinaliza "continue". No mobile, ela também serve como indicador de rolagem no hero.

### A fita de altimetria
Na página da saída, o perfil real de elevação do percurso renderizado como SVG. Cada pico marcado com o nome do trecho. Esta é a informação que mais falta nos sites de guia e a que o peregrino mais procura: onde dói.

```
   Ramal Águas da Prata — 318 km
   1400m ┤        ╱╲    ╱╲
         │    ╱╲ ╱  ╲  ╱  ╲    ╱╲
    800m ┤  ╱╯  ╰╯    ╰╯    ╲╱╯  ╰╲
         │╱                        ╰──
    400m ┴────┬────┬────┬────┬────┬────
         D1   D3   D5   D7   D9   D11
```

### A numeração do roteiro
`01 · 02 · 03` em IBM Plex Mono, grandes, em `--dourado`. Aqui a numeração é legítima: é uma sequência real de dias, e a ordem carrega informação que o leitor precisa. (No bloco "Como funciona" da home ela também se justifica — são etapas em sequência. Em nenhum outro lugar do site se usa numeração.)

### O filete dourado
Régua de 1 px em `--dourado` a 30% de opacidade, separando blocos internos. Referência aos filetes das artes devocionais que o Felipe já produz.

---

## 7. Componentes base

### Botão

```
Primário    fundo --amarelo-seta · texto --azul-profundo · Archivo 700 caps · 0.05em
            hover: brilho −8% e deslocamento de 2px para a direita (a seta avança)

Secundário  transparente · borda 1px --dourado · texto --nevoa
            hover: fundo --dourado a 12%

Fantasma    só texto --nevoa-fraca com sublinhado no hover
```

Altura mínima de 44 px em todos — alvo de toque confortável para quem usa o site no celular com a mão suada no meio da estrada.

### Selo de status

Retângulo sem raio, IBM Plex Mono, caixa alta, 11 px, `0.1em`.

| Estado | Fundo | Texto |
|---|---|---|
| Abertas | `--sucesso` 15% | `--sucesso` |
| Últimas vagas | `--amarelo-seta` | `--azul-profundo` |
| Esgotada | `--nevoa-fraca` 15% | `--nevoa-fraca` |
| Realizada | `--azul-noite` | `--dourado` |

### Card de saída

```
┌──────────────────────────────┐
│ [imagem 3:2]                 │
│                    [ selo ]  │  ← selo sobreposto, canto superior direito
├──────────────────────────────┤
│ SET/2026            ← mono, --dourado
│ Águas da Prata      ← Archivo 700, --nevoa
│ 04 a 16 · 13 dias · 318 km   ← mono, --nevoa-fraca
│ ──────────────────  ← filete dourado
│ 4 vagas             R$ ____  │
│ [ Ver a saída → ]            │
└──────────────────────────────┘
```

Hover: a imagem escala 1,03 com `overflow: hidden`, e a seta do botão desliza 4 px. Nada além disso.

---

## 8. Movimento

Contido e com propósito único: reforçar a ideia de avanço.

| Momento | Comportamento | Duração |
|---|---|---|
| Entrada de seção | Fade + subida de 16 px, uma vez, via `IntersectionObserver` | 500 ms, `ease-out` |
| Hover de botão | Seta desliza para a direita | 150 ms |
| Carimbo | Escala de 1 para 1,05 e revela o texto | 200 ms |
| Fita de altimetria | Traço desenhado da esquerda para a direita ao entrar na tela | 1200 ms, uma vez |
| Abertura do menu mobile | Deslize a partir da direita | 250 ms |

**Sem parallax. Sem contador animado. Sem partículas. Sem carrossel automático.** A única exceção é a hero cinematográfica (seção 5.1) — documentada e justificada ali, não um precedente pro resto do site.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Obrigatório, não opcional. Parte do público do Felipe é mais velho e parte acessa em rede ruim na estrada.

---

## 9. Imagens

**Proporções:** hero 21:9 no desktop e 4:5 no mobile · card 3:2 · galeria 1:1 · retrato 4:5.

**Tratamento:** sobreposição em gradiente de `--azul-profundo` (de 0% no topo a 70% na base) sob qualquer texto sobre foto. Sem filtro de cor, sem preto e branco — as fotos do Felipe são coloridas, com céu, terra vermelha e camiseta laranja de grupo. Esse contraste com o azul do site é o que dá vida à página.

**Alt text obrigatório.** O schema do Sanity marca o campo como obrigatório e o build falha sem ele. Isso é acessibilidade e é SEO.

---

## 10. Autocrítica do plano

Antes de codificar, o teste: cada decisão é específica deste projeto ou seria a mesma para qualquer cliente?

| Decisão | Veredito |
|---|---|
| Azul + amarelo | Vem da marca existente do Felipe e da sinalização real da trilha. **Específica.** |
| Site escuro | Justificada — o feed dele é escuro e o amarelo depende do escuro para funcionar. **Específica.** |
| Archivo + Source Sans 3 + IBM Plex Mono | Escolhidas para ecoar o condensado bold das artes dele e para dar voz própria aos dados do caminho. Não são a dupla serif-display + sans que sai por padrão. **Específica.** |
| Credencial com carimbos | Vem de um objeto real do Caminho da Fé, sobre o qual o Felipe já produziu conteúdo de sucesso. **Muito específica.** |
| Fita de altimetria | Informação que o peregrino realmente procura, e que o site oficial publica em página própria. **Específica.** |
| Raio de borda quase zero | Deriva das formas angulares da marca. **Específica.** |
| Numeração 01/02/03 | Só onde há sequência real. Passou no teste. |
| Fade de entrada de seção | Genérico. **Mantido** porque é o mínimo funcional, mas limitado a uma ocorrência por seção e desativado com `prefers-reduced-motion`. |
| Hero cinematográfica (scroll-pin, 3 cenas) | Reúne dispositivos já específicos do projeto (seta amarela, linha devocional) numa sequência, só no primeiro bloco da home. A cena 3 reaproveita a foto de `quemSou`, sem duplicar conteúdo no Sanity. Decidida com o Bruno como segunda exceção, ao lado da Credencial — não é padrão pro resto do site. **Específica, com ressalva registrada.** |

O acessório removido: havia um mapa interativo do trajeto planejado para a home. Foi cortado. Ele competia com a credencial pela atenção, custava peso de JavaScript numa página que precisa carregar rápido em 4G, e a informação de trajeto pertence à página do ramal — não à home.
