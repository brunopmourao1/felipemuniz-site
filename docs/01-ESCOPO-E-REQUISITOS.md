# 01 — Escopo e requisitos funcionais

---

## 1. Personas

### P1 — O peregrino em pesquisa (maior volume)
Descobriu o Caminho da Fé, está a 3–9 meses de decidir. Busca no Google coisas como "o que levar no Caminho da Fé", "quantos dias leva", "dá pra fazer sozinho", "qual ramal escolher". Não quer falar com ninguém ainda.

**O que ele precisa do site:** informação honesta e específica, sem venda. Um jeito de guardar o contato para voltar depois.
**Conversão esperada:** baixar material → entrar na lista.

### P2 — O peregrino decidindo o grupo
Já sabe que quer fazer. Está comparando guias e operadores. Quer saber quem é o Felipe, se é seguro, quem já foi, quanto custa, o que está incluso.

**O que ele precisa:** transparência de preço e roteiro, prova social real, resposta rápida.
**Conversão esperada:** formulário de reserva ou WhatsApp.

### P3 — O peregrino confirmado
Já pagou. Está se preparando. Tem 40 dúvidas operacionais.

**O que ele precisa:** página do grupo com roteiro, lista de itens, pousadas, contatos, o que fazer se passar mal.
**Conversão esperada:** nenhuma — o objetivo é reduzir mensagens no WhatsApp do Felipe.

### P4 — O Felipe (editor)
Publica uma saída nova, atualiza vagas, sobe um depoimento, escreve um post. Sempre pelo celular, muitas vezes na estrada.

**O que ele precisa:** Studio em português, campos óbvios, funcionar bem no celular, publicação sem medo de quebrar o site.

---

## 2. Requisitos funcionais

Notação: **[M]** obrigatório na v1 · **[D]** desejável · **[F]** futuro (v2+)

### RF-01 · Saídas (o núcleo do sistema)

| ID | Requisito | |
|---|---|---|
| 01.1 | Listar todas as saídas abertas ordenadas por data de início | M |
| 01.2 | Cada saída tem página própria com URL amigável (`/saidas/aguas-da-prata-set-2026`) | M |
| 01.3 | Exibir status visual: **Abertas**, **Últimas vagas**, **Esgotada**, **Realizada** | M |
| 01.4 | Campo de vagas disponíveis editável pelo Felipe; status derivado automaticamente | M |
| 01.5 | Roteiro dia a dia: nº do dia, trecho, km previsto, altimetria, pousada, descrição | M |
| 01.6 | Listas de "o que está incluso" e "o que não está incluso" | M |
| 01.7 | Valor com forma de pagamento em texto livre (o Felipe controla a redação) | M |
| 01.8 | Galeria de fotos da saída | M |
| 01.9 | Botão de reserva → formulário e link de WhatsApp com mensagem pré-preenchida contendo o nome da saída | M |
| 01.10 | Saídas realizadas continuam no ar como prova social, com galeria e depoimentos | M |
| 01.11 | Depoimentos vinculados à saída aparecem na página dela | M |
| 01.12 | Marcar uma saída como destaque na home | D |
| 01.13 | Lista de espera quando esgotada | D |
| 01.14 | Pagamento online (Mercado Pago / Asaas) | F |

### RF-02 · Captura de contatos

| ID | Requisito | |
|---|---|---|
| 02.1 | Página de material rico (`/materiais/[slug]`) com formulário nome + WhatsApp + e-mail | M |
| 02.2 | Após envio, entrega do PDF por link direto **e** por e-mail | M |
| 02.3 | Notificação do novo contato para o e-mail do Felipe | M |
| 02.4 | Consentimento LGPD explícito no formulário, com link para a política | M |
| 02.5 | Proteção contra bot (honeypot + rate limit) | M |
| 02.6 | Contatos gravados no Sanity como documento `lead` | D |
| 02.7 | Exportar contatos em CSV | D |
| 02.8 | Integração com ferramenta de e-mail marketing | F |

### RF-03 · Conteúdo e SEO

| ID | Requisito | |
|---|---|---|
| 03.1 | Blog com posts em Portable Text (texto rico, imagens, listas, citações) | M |
| 03.2 | Categorias de post: Preparação, Espiritualidade, Roteiros, Relatos | M |
| 03.3 | Campos de SEO por página (title, description, imagem OG) com fallback automático | M |
| 03.4 | `sitemap.xml` e `robots.txt` gerados dinamicamente | M |
| 03.5 | Dados estruturados schema.org (ver documento 07) | M |
| 03.6 | Página de FAQ com dados estruturados `FAQPage` | M |
| 03.7 | Página por ramal (Águas da Prata, Estiva, Paraisópolis, Tambaú, Luminosa…) | D |
| 03.8 | Busca interna | F |

### RF-04 · Prova social

| ID | Requisito | |
|---|---|---|
| 04.1 | Depoimentos com nome, cidade, foto, texto e saída de origem | M |
| 04.2 | Depoimento em vídeo (embed YouTube/Instagram) | D |
| 04.3 | Página `/depoimentos` com todos, filtrável por saída | D |
| 04.4 | Contador real: nº de peregrinos guiados, nº de saídas realizadas, km percorridos | D |

### RF-05 · Área do grupo

| ID | Requisito | |
|---|---|---|
| 05.1 | Página não listada por saída (`/grupo/[slug-secreto]`), fora do sitemap e com `noindex` | M |
| 05.2 | Roteiro completo, lista de pousadas com contato, lista de itens, orientações de emergência | M |
| 05.3 | Anexos para download (PDF do roteiro, GPX se houver) | D |
| 05.4 | Área com login real | F |

### RF-06 · Institucional

| ID | Requisito | |
|---|---|---|
| 06.1 | Página "Quem sou" — história do Felipe, credenciais, por que guia | M |
| 06.2 | Página "O Caminho da Fé" — o que é, ramais, distâncias, quando ir | M |
| 06.3 | Página de contato com WhatsApp, e-mail e Instagram | M |
| 06.4 | Política de privacidade (LGPD) | M |
| 06.5 | Botão flutuante de WhatsApp em todas as páginas | M |

---

## 3. Requisitos não funcionais

| Área | Requisito |
|---|---|
| **Performance** | LCP < 2,0 s em 4G. Lighthouse mobile ≥ 90 em todas as categorias. |
| **Mobile** | Mobile-first. O público acessa quase todo pelo celular, em rede instável. |
| **Acessibilidade** | Contraste mínimo AA. Navegação por teclado com foco visível. `prefers-reduced-motion` respeitado. Alt text obrigatório nas imagens do Sanity. |
| **Disponibilidade** | Site estático servido por CDN. Uma queda do Sanity não derruba o site — só impede novas publicações. |
| **Segurança** | Sem banco de dados próprio. Tokens de escrita apenas em variáveis de ambiente do servidor. Formulários com rate limit. |
| **Idioma** | Português do Brasil apenas. (Inglês/espanhol ficam como possibilidade futura — o Caminho recebe estrangeiros.) |
| **Navegadores** | Duas últimas versões de Chrome, Safari, Firefox e Edge. Safari iOS é prioridade. |
| **LGPD** | Consentimento explícito, finalidade declarada, canal de exclusão de dados na política de privacidade. |

---

## 4. Critérios de aceite da v1

O site pode ser entregue quando **todos** forem verdadeiros:

- [ ] O Felipe cria uma saída nova do zero no Studio, sozinho, sem consultar ninguém, e ela aparece no site em menos de 60 segundos.
- [ ] O Felipe altera o número de vagas pelo celular e o selo muda de "Abertas" para "Últimas vagas" automaticamente.
- [ ] Um visitante preenche o formulário de material e recebe o PDF por e-mail; o Felipe recebe o aviso do contato novo.
- [ ] Botão de reserva abre o WhatsApp do Felipe com o nome e a data da saída já escritos na mensagem.
- [ ] Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Boas Práticas e SEO na home e numa página de saída.
- [ ] `sitemap.xml` lista todas as páginas públicas e nenhuma página de grupo.
- [ ] Rich Results Test do Google valida os dados estruturados de FAQ e de saída.
- [ ] Todo o site navegável só pelo teclado, com foco sempre visível.
- [ ] O Felipe leu o documento 08 e conseguiu executar as cinco tarefas do checklist final sem ajuda.

---

## 5. Fora de escopo (registrado para evitar ampliação silenciosa)

Pagamento online · área logada · app nativo · reserva de pousada · rastreamento GPS ao vivo · multi-idioma · integração com o sistema da associação · CRM · emissão de nota fiscal · chat ao vivo com atendente.

Todos são possíveis depois. Nenhum entra na v1.
