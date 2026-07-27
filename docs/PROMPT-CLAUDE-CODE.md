# Como iniciar no Claude Code

---

## 1. Preparar a pasta

```bash
mkdir felipemuniz-site && cd felipemuniz-site
mkdir docs
```

Copie para `docs/` os arquivos `00` a `10`.
Copie `CLAUDE.md` para a **raiz** do projeto (não dentro de `docs/`).

```
felipemuniz-site/
├── CLAUDE.md          ← raiz, o Claude Code lê sozinho
└── docs/
    ├── 00-VISAO-GERAL.md
    ├── 01-ESCOPO-E-REQUISITOS.md
    ├── 02-ARQUITETURA-INFORMACAO.md
    ├── 03-STACK-E-ARQUITETURA.md
    ├── 04-DESIGN-SYSTEM.md
    ├── 05-SANITY-SCHEMAS.md
    ├── 06-QUERIES-E-DADOS.md
    ├── 07-SEO-E-CONTEUDO.md
    ├── 08-MANUAL-DO-EDITOR.md
    ├── 09-SETUP-E-ROADMAP.md
    └── 10-DADOS-INICIAIS.md
```

Inicie o git antes de rodar qualquer coisa — você vai querer poder voltar:

```bash
git init && git add . && git commit -m "adiciona documentação do projeto"
```

Depois:

```bash
claude
```

---

## 2. Prompt de abertura

Cole exatamente isto na primeira mensagem:

---

```
Vamos construir o site do Felipe Muniz, guia do Caminho da Fé.

Leia CLAUDE.md e depois todos os arquivos de docs/. Eles são a
especificação completa do projeto — arquitetura, schemas, design
system, queries e roadmap já estão definidos e vários arquivos de
código já estão prontos lá para serem copiados.

Estamos na Fase 1 do roadmap (docs/09-SETUP-E-ROADMAP.md).
O objetivo da Fase 1 é: eu conseguir cadastrar uma saída no Sanity
Studio e ela renderizar corretamente no site.

Contexto importante: é um projeto-presente e o conteúdo ainda é todo
fictício. Nada de real por enquanto — sem domínio, sem fotos do
Felipe, sem textos dele. O seed com dados de exemplo está em
docs/10-DADOS-INICIAIS.md.

Antes de escrever qualquer código, me apresente:

1. O que você entendeu do projeto, em cinco linhas.
2. A lista ordenada de tarefas da Fase 1, com o arquivo que cada
   tarefa cria ou altera.
3. Qualquer contradição ou lacuna que você encontrou na documentação.
4. As decisões que você precisa que eu tome antes de começar.

Não comece a implementar. Espere eu aprovar o plano.
```

---

## 3. Por que este prompt

**Manda ler tudo antes de agir.** O maior desperdício com agente de código é ele começar a escrever antes de conhecer a especificação e depois refazer.

**Fixa a fase.** Sem isso, o agente tenta construir o site inteiro numa sessão, estoura o contexto e entrega uma coisa que não compila.

**Pede as contradições.** A documentação foi escrita antes do código existir. Sempre sobra alguma inconsistência, e é muito mais barato descobri-la agora que no meio da Fase 3.

**Trava a implementação.** Aprovar o plano antes é o que separa uma sessão produtiva de duas horas desfazendo.

---

## 4. Prompts das fases seguintes

Use um por sessão, sempre em conversa nova para não arrastar contexto gasto.

### Fase 2 — Conversão

```
Fase 1 concluída e commitada. Vamos para a Fase 2 (Conversão),
conforme docs/09-SETUP-E-ROADMAP.md.

Releia docs/02-ARQUITETURA-INFORMACAO.md (blocos da home e da página
de saída) e docs/04-DESIGN-SYSTEM.md (Credencial e fita de altimetria).

Me apresente o plano de tarefas antes de implementar.
Prioridade: a home completa e o módulo Credencial.
```

### Fase 3 — Conteúdo e busca

```
Fase 2 concluída. Vamos para a Fase 3 (Conteúdo e busca).

Base: docs/07-SEO-E-CONTEUDO.md.
Entregar: blog completo, páginas institucionais, sitemap, robots,
JSON-LD em todas as páginas e imagem OG dinâmica.

Ao final, valide os dados estruturados e me diga o que testar no
Rich Results Test.

Plano antes de implementar.
```

### Fase 4 — Entrega

```
Fase 3 concluída. Fase 4 (Entrega).

1. Área do grupo em /grupo/[slug], com noindex e fora do sitemap
2. Auditoria completa contra os critérios de aceite do
   docs/01-ESCOPO-E-REQUISITOS.md, seção 4
3. Lighthouse mobile na home e numa página de saída — reportar os
   números e corrigir o que ficar abaixo de 90
4. Revisão de acessibilidade: navegação por teclado, foco visível,
   contraste, alt text
5. Revisão de todos os textos contra a diretriz de escrita do
   docs/04-DESIGN-SYSTEM.md, seção final

Me entregue um relatório do que passou e do que não passou antes
de corrigir.
```

---

## 5. Prompts avulsos que vão ser úteis

**Quando ele sair do padrão visual:**
```
Isso não segue docs/04-DESIGN-SYSTEM.md. Revise contra os tokens
e o uso do amarelo (três lugares e só três). Me diga o que estava
fora antes de corrigir.
```

**Quando quiser conferir sem implementar:**
```
Não altere nada. Só me diga se [X] está de acordo com a
documentação e onde diverge.
```

**Quando ele ampliar o escopo:**
```
Isso está na lista de fora-de-escopo do docs/01, seção 5.
Remova e registre como possibilidade de v2.
```

**Ao final de cada sessão:**
```
Faça o commit do que ficou pronto, com mensagem em português no
imperativo. Depois atualize CLAUDE.md com o que mudou de estado no
projeto e o que ficou pendente para a próxima sessão.
```

Esse último é o que mais rende. `CLAUDE.md` vira o diário do projeto e a próxima sessão começa sabendo onde parou.

---

## 6. Alguns cuidados

**Uma fase por sessão.** Contexto longo degrada a qualidade. Termine, commite, feche, abra de novo.

**Commite com frequência.** Se o agente quebrar algo, `git diff` mostra exatamente o quê.

**Rode `npm run dev` você mesmo.** Não confie no "está funcionando" sem ver a tela.

**Depois de mexer em schema, `npm run typegen`.** Se esquecer, os tipos ficam mentindo e o erro aparece longe da causa.

**O seed sobe imagens de verdade para o Sanity.** Rode uma vez. Rodar de novo duplica assets — se precisar recomeçar, `npm run seed:limpar` antes.
