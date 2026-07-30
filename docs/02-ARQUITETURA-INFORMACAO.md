# 02 — Arquitetura de informação e mapa de páginas

---

## 1. Mapa do site

```
/                                  Home
│
├── /saidas                        Todas as saídas (abertas + realizadas)
│   └── /saidas/[slug]             Página da saída
│
├── /o-caminho                     O que é o Caminho da Fé
│   └── /o-caminho/[ramal]         Página por ramal            [D]
│
├── /preparacao                    Hub de preparação (pilar de SEO)
│
├── /blog                          Lista de posts
│   ├── /blog/[slug]               Post
│   └── /blog/categoria/[slug]     Posts por categoria
│
├── /depoimentos                   Todos os depoimentos
├── /quem-sou                      Felipe
├── /perguntas-frequentes          FAQ
├── /contato                       Contato
│
├── /materiais/[slug]              Landing de captura
├── /obrigado                      Confirmação pós-formulário
│
├── /grupo/[slug-secreto]          Área do grupo (noindex, não listada)
│
├── /politica-de-privacidade
├── /studio                        Sanity Studio (noindex)
│
├── /sitemap.xml
├── /robots.txt
└── /rss.xml                                                    [D]
```

### Navegação principal (5 itens, teto rígido)

`Saídas` · `O Caminho` · `Preparação` · `Quem sou` · **`Falar com o Felipe`** (botão destacado)

O blog não entra no menu principal — entra pelo Google e é linkado a partir de `/preparacao`. Menu de guia de peregrinação com 9 itens vira ruído; o visitante veio para uma de duas coisas: entender o Caminho ou reservar uma vaga.

### Rodapé

Três colunas: **Saídas** (as três próximas, geradas dinamicamente) · **Conteúdo** (Preparação, Blog, FAQ, Depoimentos) · **Contato** (WhatsApp, e-mail, Instagram, política de privacidade). Assinatura discreta do desenvolvedor no rodapé, se o Felipe autorizar — é portfólio para o Bruno.

---

## 2. Home — estrutura de blocos

A home tem uma tarefa: fazer o visitante entender em 5 segundos o que o Felipe faz e levá-lo a uma das duas ações (ver saídas / baixar material).

| # | Bloco | Conteúdo | Fonte |
|---|---|---|---|
| 1 | **Hero** *(cinematográfica, ver documento 04 seção 5.1)* | Três cenas presas ao scroll: **lugar** (foto real, zoom lento, título + subtítulo) → **citação** (seta pintada + linha devocional) → **guia** (retrato do Felipe num quadro, mesma foto do bloco 3). Ao final, libera o scroll normal direto para o bloco 2. Duas ações no fim da sequência: *Ver próximas saídas* / *Receber o guia de preparação* | `configuracao` + `quemSou` |
| 2 | **Próximas saídas** | Até 3 cards com data, ramal, dias, vagas restantes, status. Link para todas | `saida` |
| 3 | **Quem guia** | Foto do Felipe + 3 parágrafos + números reais (peregrinos guiados, saídas, anos) | `configuracao` |
| 4 | **Como funciona** | 4 etapas: escolher a saída → conversar com o Felipe → preparar → caminhar. Aqui a numeração se justifica: é sequência real | estático |
| 5 | **A Credencial** *(elemento assinatura)* | Depoimentos apresentados como carimbos numa página de credencial. Ver documento 04 | `depoimento` |
| 6 | **Preparação** | 3 conteúdos utilitários mais fortes, com chamada para o hub | `post` |
| 7 | **Captura** | Faixa com o material principal e formulário de uma linha | `material` |
| 8 | **FAQ resumida** | As 5 perguntas mais frequentes em acordeão + link para a página completa | `faq` |

---

## 3. Página da saída — a mais importante do site

Ordem definida por como a decisão realmente acontece: primeiro *quando e quanto custa*, depois *o que vou viver*, depois *posso confiar*, e só então *reservar*.

```
┌───────────────────────────────────────────────┐
│  ← Voltar para saídas                         │
│                                               │
│  ÁGUAS DA PRATA → APARECIDA                   │  eyebrow, mono
│  Saída de Setembro                            │  display
│  04 a 16 de setembro de 2026 · 13 dias        │  utility
│                                               │
│  [ 4 vagas ]  318 km  Nível moderado          │  selos
│                                               │
│  R$ ____                                      │
│  [ Quero reservar ]  [ Tirar dúvidas ]        │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│  FITA DE ALTIMETRIA — perfil do percurso      │
│  ▁▂▄▆█▆▄▃▅▇█▅▃▂▁                              │
│  cada pico marcado com o nome do trecho       │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│  ROTEIRO DIA A DIA                            │
│  01 │ Águas da Prata → Andradas               │
│     │ 22 km · +640 m · Pousada X              │
│     │ texto do dia                            │
│  02 │ ...                                     │
└───────────────────────────────────────────────┘
┌────────────────────┬──────────────────────────┐
│  ESTÁ INCLUSO      │  NÃO ESTÁ INCLUSO        │
└────────────────────┴──────────────────────────┘
┌───────────────────────────────────────────────┐
│  GALERIA                                      │
├───────────────────────────────────────────────┤
│  QUEM JÁ FOI NESTA SAÍDA (depoimentos)        │
├───────────────────────────────────────────────┤
│  DÚVIDAS SOBRE ESTA SAÍDA (FAQ filtrada)      │
├───────────────────────────────────────────────┤
│  RESERVA — formulário + WhatsApp              │
└───────────────────────────────────────────────┘
```

**Barra fixa no mobile:** quando o hero sai da tela, aparece uma barra inferior com `data · vagas · [Reservar]`. É o padrão de conversão em mobile e resolve a página longa.

---

## 4. Estados da saída

Derivados automaticamente. O Felipe só edita `vagasTotal` e `vagasDisponiveis`.

| Estado | Condição | Selo | Ação |
|---|---|---|---|
| **Abertas** | vagas > 30% do total | verde discreto | Quero reservar |
| **Últimas vagas** | 0 < vagas ≤ 30% | amarelo-seta | Últimas N vagas — reservar |
| **Esgotada** | vagas = 0 e data futura | cinza | Entrar na lista de espera |
| **Realizada** | data de fim no passado | azul-noite | Ver como foi + Avise-me da próxima |

A saída **realizada não sai do ar**. Ela vira prova social e página indexada. Um peregrino que busca "caminho da fé setembro 2025" cai numa página com fotos e depoimentos reais — e um botão para a próxima data.

---

## 5. Estratégia de URLs

| Tipo | Padrão | Exemplo |
|---|---|---|
| Saída | `/saidas/[cidade]-[mes]-[ano]` | `/saidas/aguas-da-prata-set-2026` |
| Post | `/blog/[slug-descritivo]` | `/blog/o-que-levar-na-mochila` |
| Ramal | `/o-caminho/[nome-do-ramal]` | `/o-caminho/ramal-da-luminosa` |
| Material | `/materiais/[slug]` | `/materiais/checklist-do-peregrino` |
| Grupo | `/grupo/[slug]-[hash6]` | `/grupo/setembro-2026-k7m2xq` |

**Regras.** Slug gerado a partir do título, editável, imutável depois de publicado. Sem data na URL de post — post evergreen com ano na URL parece velho. Toda mudança de slug precisa de redirect 301 registrado em `next.config.ts`.

---

## 6. Fluxos de conversão

### F1 — Visitante frio → contato
```
Google ("o que levar caminho da fé")
  → /blog/o-que-levar-na-mochila
  → CTA no meio e no fim do texto
  → /materiais/checklist-do-peregrino
  → formulário (nome, WhatsApp, e-mail)
  → /obrigado + PDF por e-mail
  → Felipe recebe notificação
```

### F2 — Visitante quente → reserva
```
Instagram (link da bio)
  → /saidas
  → /saidas/[slug]
  → [Quero reservar]
  → formulário curto OU WhatsApp com mensagem pronta
  → Felipe responde e fecha
```

### F3 — Confirmado → autoatendimento
```
WhatsApp do grupo
  → /grupo/[slug-secreto]
  → roteiro, pousadas, lista de itens, emergência
```

**Mensagem pré-preenchida do WhatsApp** — montada no cliente, com o nome da saída interpolado:

```ts
const texto = encodeURIComponent(
  `Olá Felipe! Vi o site e quero reservar minha vaga na saída ` +
  `${saida.titulo} (${formatarPeriodo(saida)}). Pode me passar os detalhes?`
);
const href = `https://wa.me/${config.whatsapp}?text=${texto}`;
```

Isso elimina a mensagem "oi" seguida de três trocas para descobrir do que a pessoa está falando. O Felipe já abre a conversa sabendo qual saída interessa.

---

## 7. Regras de conteúdo

**Toda página tem uma ação clara.** Nenhuma página termina sem dizer o que fazer em seguida.

**Preço visível.** Esconder o valor para "forçar o contato" filtra os curiosos e afasta os compradores. O peregrino que está comparando guias precisa do número.

**Honestidade sobre dificuldade.** O post do Felipe sobre a realidade do Ramal da Luminosa é o tipo de conteúdo que constrói confiança justamente por não vender facilidade. Isso é diretriz editorial do site inteiro: a página da saída diz quantos quilômetros por dia e quanto se sobe, não "experiência transformadora".

**Foto real sempre.** Nada de banco de imagens. O acervo do Felipe é o diferencial — grupo suado no meio da estrada de terra vale mais que peregrino de stock ao pôr do sol.
