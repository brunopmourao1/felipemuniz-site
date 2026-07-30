# CLAUDE.md

Contexto permanente deste projeto. Leia antes de qualquer tarefa.

---

## O que é

Site institucional e comercial para **Felipe Muniz**, guia do Caminho da Fé (rota de peregrinação Águas da Prata/SP → Aparecida/SP). Ele conduz grupos em saídas com data fixa e vagas limitadas.

É um **projeto-presente**: o desenvolvedor (Bruno Mourão) constrói sem cobrar e entrega pronto. Depois da entrega, o Felipe atualiza tudo sozinho pelo CMS.

**A documentação completa está em `/docs`.** Consulte-a antes de tomar qualquer decisão de arquitetura, schema, design ou conteúdo. Ela é a fonte de verdade — este arquivo é só o resumo operacional.

| Doc | Assunto |
|---|---|
| `00-VISAO-GERAL.md` | Contexto, decisões fechadas, custos |
| `01-ESCOPO-E-REQUISITOS.md` | Requisitos numerados, critérios de aceite, fora de escopo |
| `02-ARQUITETURA-INFORMACAO.md` | Mapa de páginas, blocos, fluxos, URLs |
| `03-STACK-E-ARQUITETURA.md` | Stack, estrutura de pastas, rotas de API, segurança |
| `04-DESIGN-SYSTEM.md` | Tokens, tipografia, componentes, movimento |
| `05-SANITY-SCHEMAS.md` | Todos os schemas, prontos para colar |
| `06-QUERIES-E-DADOS.md` | GROQ, helpers, componentes de dados |
| `07-SEO-E-CONTEUDO.md` | JSON-LD, sitemap, pauta editorial |
| `08-MANUAL-DO-EDITOR.md` | Manual do Felipe (não técnico) |
| `09-SETUP-E-ROADMAP.md` | Passo a passo e fases |
| `10-DADOS-INICIAIS.md` | Conteúdo fictício e script de seed |

---

## Fase atual

**Construção com conteúdo fictício.** Nada de real ainda: sem domínio, sem fotos do Felipe, sem textos dele, sem depoimentos reais.

Consequências práticas:

- Todo conteúdo vem do seed (`10-DADOS-INICIAIS.md`). Documentos de seed usam `_id` com prefixo `seed.` para poderem ser removidos em bloco depois.
- Imagens de placeholder vêm do `picsum.photos`. **São temporárias e serão trocadas.** Nunca trate uma foto do seed como definitiva.
- O domínio de produção ainda não existe. Use `NEXT_PUBLIC_SITE_URL` da variável de ambiente, nunca uma URL fixa no código.

---

## Stack (fechada, não reabrir)

- Next.js 15, App Router, TypeScript, `src/`
- Tailwind CSS v4 (tokens como CSS custom properties, sem `tailwind.config.js`)
- Sanity v3, Studio embutido em `/studio`, interface em pt-BR
- `next-sanity`, `@sanity/image-url`, `@portabletext/react`
- React Hook Form + Zod
- Resend para e-mail transacional
- Deploy: Vercel na construção, Cloudflare Pages avaliado antes do domínio definitivo

---

## Regras invioláveis

**Português em tudo que o usuário final vê.** Rótulos do Sanity, mensagens de erro, textos de interface, nomes de campo. Nomes de variáveis e funções também em português quando forem do domínio (`saida`, `vagasDisponiveis`, `formatarPeriodo`). Termos técnicos de framework ficam em inglês (`params`, `props`, `revalidate`).

**Nenhuma GROQ inline.** Toda query mora em `src/sanity/queries.ts`.

**Estado derivado, nunca digitado.** O status da saída sai de `statusDaSaida()` em `src/lib/status-saida.ts`. Não existe campo `status` no schema.

**Datas sempre com fuso.** `timeZone: 'America/Sao_Paulo'` em toda formatação. Sem isso, uma saída de 04/09 renderiza 03/09.

**Alt text obrigatório** em toda imagem. O schema valida e o build deve falhar sem ele.

**Server Components por padrão.** `'use client'` só onde há estado ou evento: formulários, menu mobile, acordeão, barra de reserva.

**Sem localStorage, sem sessionStorage.** Não há necessidade no projeto.

**Sem biblioteca de animação.** CSS e `IntersectionObserver` dão conta do que o documento 04 pede.

**`prefers-reduced-motion` respeitado** globalmente.

---

## Design — resumo operacional

Ver `04-DESIGN-SYSTEM.md` para o detalhamento. O essencial:

Site **escuro**. Azul-noite (`--azul-profundo: #0B2038`) com amarelo da sinalização da trilha (`--amarelo-seta: #F5B31E`) como único acento forte.

**O amarelo aparece em três lugares e só neles:** ação primária, selo de "últimas vagas", seta de navegação. Se estiver num quarto lugar, está errado. (Exceção registrada: a hero cinematográfica e o cabeçalho usam `--hero-ambar`, uma cor própria — ver documento 04, seção 5.1.1.)

**Raio de borda 2–4 px.** A marca do Felipe é angular. Nada de cantos arredondados de app. (Exceção registrada: os CTAs em pílula da hero e do cabeçalho — mesma seção 5.1.1.)

**Elemento assinatura: A Credencial.** Depoimentos renderizados como carimbos numa página de credencial de peregrino, com rotação determinística derivada do `_id`. É onde a ousadia do projeto é gasta — todo o resto é sóbrio.

**Fontes:** Archivo (display), Source Sans 3 (corpo), IBM Plex Mono (números e dados), Newsreader Italic (só citações de peregrino), mais duas exceções travadas à hero/cabeçalho — Cormorant Garamond e Jost (documento 04, seção 5.1.1). Auto-hospedadas em WOFF2, subconjunto `latin` + `latin-ext`.

---

## Configuração atual

```
E-mail do Studio:  bruno.pmourao1@gmail.com
WhatsApp:          5511953215363
Domínio:           ainda não registrado — usar URL de preview
Assinatura rodapé: "Site desenvolvido por Bruno Mourão" com link,
                   discreta, em --nevoa-fraca
```

---

## Como trabalhar comigo

**Trabalhe por fase.** As fases estão em `09-SETUP-E-ROADMAP.md`. Não comece a Fase 2 antes de a Fase 1 rodar de verdade.

**Antes de criar um arquivo**, confira se a documentação já traz o código dele. Vários arquivos estão prontos nos documentos 03, 05 e 06 — copie de lá em vez de reescrever.

**Rode `npm run build` antes de dizer que terminou.** Erro de tipo que só aparece no build não é "pronto".

**Se um requisito da documentação conflitar com o que eu pedi no chat**, pergunte. Não escolha sozinho.

**Não amplie o escopo.** A lista de fora-de-escopo está no documento 01. Pagamento online, login, multi-idioma e busca interna não entram na v1. Se parecer que faz falta, comente — não implemente.

**Commits em português**, no imperativo: `adiciona schema de saida`, `corrige fuso na formatação de datas`.

---

## Comandos

```bash
npm run dev        # site em :3000, Studio em :3000/studio
npm run build      # gera tipos + build de produção
npm run typegen    # regenera tipos do Sanity após mudar schema
npm run seed       # popula o dataset com conteúdo fictício
npm run seed:limpar # remove tudo que tem _id com prefixo seed.
```

**Depois de qualquer alteração em schema, rode `npm run typegen`.** Os tipos em `src/sanity/types.ts` são gerados — não edite à mão.

---

## Definição de pronto

Uma tarefa só está pronta quando:

- [ ] `npm run build` passa sem erro nem aviso de tipo
- [ ] Funciona em 375 px de largura
- [ ] Navegável por teclado, com foco visível
- [ ] Textos em português, na voz do documento 04 (ativa, direta, sem pedido de desculpa)
- [ ] Nenhuma cor ou tamanho escrito à mão — tudo vem dos tokens
