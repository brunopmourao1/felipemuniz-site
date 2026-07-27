# 05 — Schemas do Sanity

Código pronto para colar. Todos os rótulos, descrições e mensagens de validação em português — o Felipe nunca deve ver um termo técnico no Studio.

---

## 1. Princípios de modelagem

1. **Um documento por conceito real do negócio.** `saida`, `depoimento`, `post`, `faq`, `material`, `ramal`, `lead`.
2. **Todo campo tem `description`.** O Felipe precisa saber para que serve sem perguntar.
3. **Estado derivado, nunca digitado.** O Felipe informa vagas; o site calcula "últimas vagas". Campo redundante é campo que fica errado.
4. **Validação que impede erro publicado**, não que irrita: alt text obrigatório, data de fim posterior à de início, slug único.
5. **`preview` sempre configurado.** A lista precisa mostrar data e status, não só o título.
6. **Singletons trancados.** Configuração e "Quem sou" existem uma vez só e não podem ser apagados por engano.

---

## 2. Objetos reutilizáveis

### `objects/imagemComAlt.ts`

```ts
import { defineType, defineField } from 'sanity';

export const imagemComAlt = defineType({
  name: 'imagemComAlt',
  title: 'Imagem',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Descrição da imagem',
      type: 'string',
      description:
        'Descreva o que aparece na foto para quem não consegue vê-la. Ex.: "Grupo de peregrinos subindo estrada de terra ao amanhecer".',
      validation: (regra) =>
        regra.required().min(10).error('Descreva a imagem em pelo menos 10 caracteres.'),
    }),
    defineField({
      name: 'legenda',
      title: 'Legenda (opcional)',
      type: 'string',
      description: 'Texto exibido abaixo da foto.',
    }),
  ],
});
```

### `objects/seo.ts`

```ts
import { defineType, defineField } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'Google e redes sociais',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  description: 'Deixe em branco para o site preencher sozinho a partir do título e do resumo.',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título no Google',
      type: 'string',
      description: 'Até 60 caracteres. Aparece como o link azul no resultado da busca.',
      validation: (regra) => regra.max(60).warning('Acima de 60 caracteres o Google corta.'),
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição no Google',
      type: 'text',
      rows: 3,
      description: 'Até 155 caracteres. É o texto cinza abaixo do link.',
      validation: (regra) => regra.max(155).warning('Acima de 155 caracteres o Google corta.'),
    }),
    defineField({
      name: 'imagem',
      title: 'Imagem de compartilhamento',
      type: 'image',
      description: 'Aparece quando alguém compartilha o link no WhatsApp ou Instagram. Ideal 1200×630.',
    }),
    defineField({
      name: 'naoIndexar',
      title: 'Esconder do Google',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
```

### `objects/diaRoteiro.ts`

```ts
import { defineType, defineField } from 'sanity';

export const diaRoteiro = defineType({
  name: 'diaRoteiro',
  title: 'Dia do roteiro',
  type: 'object',
  fields: [
    defineField({
      name: 'dia',
      title: 'Dia',
      type: 'number',
      validation: (regra) => regra.required().integer().min(1),
    }),
    defineField({
      name: 'trecho',
      title: 'Trecho',
      type: 'string',
      description: 'Ex.: "Águas da Prata → Andradas"',
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'km',
      title: 'Distância do dia (km)',
      type: 'number',
      validation: (regra) => regra.required().positive(),
    }),
    defineField({
      name: 'altimetria',
      title: 'Subida acumulada (m)',
      type: 'number',
      description: 'Quantos metros o grupo sobe nesse dia. Deixe em branco se não souber.',
    }),
    defineField({
      name: 'pousada',
      title: 'Onde dorme',
      type: 'string',
    }),
    defineField({
      name: 'descricao',
      title: 'Como é o dia',
      type: 'text',
      rows: 4,
      description: 'Fale do terreno, do que se vê, do que exige. Seja honesto sobre a dificuldade.',
    }),
  ],
  preview: {
    select: { dia: 'dia', trecho: 'trecho', km: 'km' },
    prepare: ({ dia, trecho, km }) => ({
      title: `Dia ${dia} · ${trecho}`,
      subtitle: km ? `${km} km` : 'sem distância informada',
    }),
  },
});
```

---

## 3. Documento `saida` — o núcleo

### `documents/saida.ts`

```ts
import { defineType, defineField } from 'sanity';
import { CalendarIcon } from '@sanity/icons';

export const saida = defineType({
  name: 'saida',
  title: 'Saída',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: 'principal', title: 'Principal', default: true },
    { name: 'roteiro', title: 'Roteiro' },
    { name: 'comercial', title: 'Vagas e valor' },
    { name: 'midia', title: 'Fotos' },
    { name: 'busca', title: 'Google' },
  ],
  fields: [
    defineField({
      name: 'titulo',
      title: 'Nome da saída',
      type: 'string',
      group: 'principal',
      description: 'Ex.: "Saída de Setembro — Águas da Prata"',
      validation: (regra) => regra.required().error('Toda saída precisa de um nome.'),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço da página',
      type: 'slug',
      group: 'principal',
      description: 'Gerado do nome. Não mude depois de publicar — o link antigo para de funcionar.',
      options: {
        source: 'titulo',
        maxLength: 80,
        slugify: (entrada) =>
          entrada
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .slice(0, 80),
      },
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'ramal',
      title: 'Ramal',
      type: 'reference',
      to: [{ type: 'ramal' }],
      group: 'principal',
      description: 'Por qual ramal do Caminho da Fé esse grupo vai.',
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'dataInicio',
      title: 'Data de saída',
      type: 'date',
      group: 'principal',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'dataFim',
      title: 'Data de chegada',
      type: 'date',
      group: 'principal',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (regra) =>
        regra.required().custom((fim, contexto) => {
          const inicio = (contexto.document as any)?.dataInicio;
          if (!fim || !inicio) return true;
          return new Date(fim) >= new Date(inicio)
            ? true
            : 'A chegada não pode ser antes da saída.';
        }),
    }),
    defineField({
      name: 'cidadeSaida',
      title: 'Cidade de partida',
      type: 'string',
      group: 'principal',
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'resumo',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      group: 'principal',
      description: 'Duas ou três linhas. Aparece no card e no compartilhamento.',
      validation: (regra) => regra.required().max(300),
    }),

    // ── Roteiro ───────────────────────────────────────────
    defineField({
      name: 'distanciaKm',
      title: 'Distância total (km)',
      type: 'number',
      group: 'roteiro',
      validation: (regra) => regra.required().positive(),
    }),
    defineField({
      name: 'nivel',
      title: 'Nível de exigência',
      type: 'string',
      group: 'roteiro',
      options: {
        list: [
          { title: 'Leve — até 18 km por dia', value: 'leve' },
          { title: 'Moderado — 18 a 25 km por dia', value: 'moderado' },
          { title: 'Exigente — acima de 25 km por dia', value: 'exigente' },
        ],
        layout: 'radio',
      },
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'roteiro',
      title: 'Roteiro dia a dia',
      type: 'array',
      of: [{ type: 'diaRoteiro' }],
      group: 'roteiro',
      validation: (regra) => regra.min(1).error('Adicione pelo menos um dia.'),
    }),

    // ── Comercial ─────────────────────────────────────────
    defineField({
      name: 'vagasTotal',
      title: 'Total de vagas',
      type: 'number',
      group: 'comercial',
      validation: (regra) => regra.required().integer().min(1),
    }),
    defineField({
      name: 'vagasDisponiveis',
      title: 'Vagas ainda disponíveis',
      type: 'number',
      group: 'comercial',
      description:
        'Atualize aqui quando fechar uma vaga. O selo do site muda sozinho: em 0, aparece "Esgotada".',
      validation: (regra) =>
        regra.required().integer().min(0).custom((disp, contexto) => {
          const total = (contexto.document as any)?.vagasTotal;
          if (disp == null || total == null) return true;
          return disp <= total ? true : 'Não pode haver mais vagas livres que o total.';
        }),
    }),
    defineField({
      name: 'valor',
      title: 'Valor',
      type: 'string',
      group: 'comercial',
      description: 'Escreva como preferir. Ex.: "R$ 2.400 · em até 6x no cartão"',
    }),
    defineField({
      name: 'incluso',
      title: 'Está incluso',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'comercial',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'naoIncluso',
      title: 'Não está incluso',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'comercial',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'destaque',
      title: 'Mostrar em destaque na página inicial',
      type: 'boolean',
      group: 'comercial',
      initialValue: false,
    }),

    // ── Mídia ─────────────────────────────────────────────
    defineField({
      name: 'imagemCapa',
      title: 'Foto de capa',
      type: 'imagemComAlt',
      group: 'midia',
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'galeria',
      title: 'Galeria',
      type: 'array',
      of: [{ type: 'imagemComAlt' }],
      group: 'midia',
      options: { layout: 'grid' },
    }),

    // ── Área do grupo ─────────────────────────────────────
    defineField({
      name: 'slugGrupo',
      title: 'Link privado do grupo',
      type: 'slug',
      group: 'comercial',
      description:
        'Endereço secreto da página do grupo. Envie só para quem já confirmou. Não aparece no Google.',
      options: {
        source: (doc: any) => `${doc.slug?.current ?? 'grupo'}-${Math.random().toString(36).slice(2, 8)}`,
      },
    }),
    defineField({
      name: 'orientacoesGrupo',
      title: 'Orientações para o grupo',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'comercial',
      description: 'Só aparece na página privada do grupo.',
    }),

    defineField({ name: 'seo', type: 'seo', group: 'busca' }),
  ],

  orderings: [
    {
      title: 'Data de saída (mais próxima primeiro)',
      name: 'dataAsc',
      by: [{ field: 'dataInicio', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      titulo: 'titulo',
      inicio: 'dataInicio',
      fim: 'dataFim',
      vagas: 'vagasDisponiveis',
      total: 'vagasTotal',
      midia: 'imagemCapa',
    },
    prepare: ({ titulo, inicio, fim, vagas, total, midia }) => {
      const passou = fim && new Date(fim) < new Date();
      const estado = passou
        ? 'Realizada'
        : vagas === 0
          ? 'Esgotada'
          : vagas <= Math.ceil((total ?? 0) * 0.3)
            ? `Últimas ${vagas} vagas`
            : `${vagas} vagas`;
      const data = inicio
        ? new Date(inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'sem data';
      return { title: titulo, subtitle: `${data} · ${estado}`, media: midia };
    },
  },
});
```

---

## 4. Demais documentos

### `documents/ramal.ts`

```ts
import { defineType, defineField } from 'sanity';

export const ramal = defineType({
  name: 'ramal',
  title: 'Ramal',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome do ramal', type: 'string',
      validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Endereço da página', type: 'slug',
      options: { source: 'nome' }, validation: (r) => r.required() }),
    defineField({ name: 'cidadeInicio', title: 'Cidade de início', type: 'string' }),
    defineField({ name: 'km', title: 'Extensão (km)', type: 'number' }),
    defineField({ name: 'diasSugeridos', title: 'Dias sugeridos', type: 'number' }),
    defineField({
      name: 'dificuldade', title: 'Dificuldade', type: 'string',
      options: { list: ['leve', 'moderado', 'exigente'], layout: 'radio' },
    }),
    defineField({ name: 'descricao', title: 'Sobre o ramal', type: 'array',
      of: [{ type: 'block' }] }),
    defineField({ name: 'imagem', title: 'Foto', type: 'imagemComAlt' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: {
    select: { title: 'nome', km: 'km' },
    prepare: ({ title, km }) => ({ title, subtitle: km ? `${km} km` : '' }),
  },
});
```

### `documents/depoimento.ts`

```ts
import { defineType, defineField } from 'sanity';

export const depoimento = defineType({
  name: 'depoimento',
  title: 'Depoimento',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome do peregrino', type: 'string',
      validation: (r) => r.required() }),
    defineField({ name: 'cidade', title: 'Cidade', type: 'string',
      description: 'Ex.: "Campinas — SP". Aparece no carimbo.' }),
    defineField({
      name: 'saida', title: 'De qual saída participou', type: 'reference',
      to: [{ type: 'saida' }],
      description: 'O depoimento também aparece na página dessa saída.',
    }),
    defineField({ name: 'texto', title: 'Depoimento', type: 'text', rows: 6,
      validation: (r) => r.required().min(30) }),
    defineField({ name: 'foto', title: 'Foto do peregrino', type: 'imagemComAlt' }),
    defineField({ name: 'videoUrl', title: 'Link do vídeo (opcional)', type: 'url',
      description: 'YouTube ou Instagram.' }),
    defineField({ name: 'publicado', title: 'Publicar no site', type: 'boolean',
      initialValue: true }),
    defineField({ name: 'destaque', title: 'Destacar na página inicial', type: 'boolean',
      initialValue: false }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'cidade', media: 'foto' },
  },
});
```

### `documents/post.ts`

```ts
import { defineType, defineField } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Post do blog',
  type: 'document',
  groups: [
    { name: 'conteudo', title: 'Conteúdo', default: true },
    { name: 'busca', title: 'Google' },
  ],
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', group: 'conteudo',
      validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Endereço da página', type: 'slug', group: 'conteudo',
      options: { source: 'titulo', maxLength: 80 }, validation: (r) => r.required() }),
    defineField({
      name: 'categoria', title: 'Categoria', type: 'string', group: 'conteudo',
      options: {
        list: [
          { title: 'Preparação', value: 'preparacao' },
          { title: 'Espiritualidade', value: 'espiritualidade' },
          { title: 'Roteiros', value: 'roteiros' },
          { title: 'Relatos', value: 'relatos' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'resumo', title: 'Resumo', type: 'text', rows: 3, group: 'conteudo',
      description: 'Duas linhas. Aparece na lista e no Google.',
      validation: (r) => r.required().max(200) }),
    defineField({ name: 'capa', title: 'Imagem de capa', type: 'imagemComAlt', group: 'conteudo',
      validation: (r) => r.required() }),
    defineField({ name: 'publicadoEm', title: 'Data de publicação', type: 'datetime',
      group: 'conteudo', initialValue: () => new Date().toISOString(),
      validation: (r) => r.required() }),
    defineField({
      name: 'corpo', title: 'Texto', type: 'array', group: 'conteudo',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Parágrafo', value: 'normal' },
            { title: 'Subtítulo', value: 'h2' },
            { title: 'Subtítulo menor', value: 'h3' },
            { title: 'Citação', value: 'blockquote' },
          ],
          lists: [
            { title: 'Lista', value: 'bullet' },
            { title: 'Lista numerada', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Negrito', value: 'strong' },
              { title: 'Itálico', value: 'em' },
            ],
            annotations: [
              {
                name: 'link', type: 'object', title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'Endereço' }],
              },
            ],
          },
        },
        { type: 'imagemComAlt' },
        {
          name: 'destaque', type: 'object', title: 'Caixa de destaque',
          fields: [{ name: 'texto', type: 'text', title: 'Texto' }],
        },
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'saidasRelacionadas', title: 'Saídas relacionadas', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'saida' }] }], group: 'conteudo',
      description: 'Aparecem como chamada no fim do post.',
    }),
    defineField({ name: 'seo', type: 'seo', group: 'busca' }),
  ],
  orderings: [
    { title: 'Mais recentes', name: 'dataDesc',
      by: [{ field: 'publicadoEm', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'categoria', media: 'capa' },
  },
});
```

### `documents/faq.ts`

```ts
import { defineType, defineField } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'Pergunta frequente',
  type: 'document',
  fields: [
    defineField({ name: 'pergunta', title: 'Pergunta', type: 'string',
      validation: (r) => r.required() }),
    defineField({ name: 'resposta', title: 'Resposta', type: 'array',
      of: [{ type: 'block' }], validation: (r) => r.required() }),
    defineField({
      name: 'categoria', title: 'Categoria', type: 'string',
      options: {
        list: [
          { title: 'Antes de decidir', value: 'decisao' },
          { title: 'Preparação física', value: 'fisico' },
          { title: 'O que levar', value: 'equipamento' },
          { title: 'Durante o caminho', value: 'caminho' },
          { title: 'Valores e pagamento', value: 'valores' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'ordem', title: 'Ordem', type: 'number', initialValue: 100,
      description: 'Menor número aparece primeiro.' }),
    defineField({ name: 'naHome', title: 'Mostrar na página inicial', type: 'boolean',
      initialValue: false }),
  ],
  orderings: [{ title: 'Ordem', name: 'ordem', by: [{ field: 'ordem', direction: 'asc' }] }],
  preview: { select: { title: 'pergunta', subtitle: 'categoria' } },
});
```

### `documents/material.ts`

```ts
import { defineType, defineField } from 'sanity';

export const material = defineType({
  name: 'material',
  title: 'Material para baixar',
  type: 'document',
  description: 'PDFs entregues em troca do contato do visitante.',
  fields: [
    defineField({ name: 'titulo', title: 'Nome do material', type: 'string',
      validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Endereço da página', type: 'slug',
      options: { source: 'titulo' }, validation: (r) => r.required() }),
    defineField({ name: 'promessa', title: 'O que a pessoa ganha', type: 'text', rows: 3,
      description: 'Uma frase concreta. Ex.: "A lista completa do que levar, item por item, com peso de cada um."',
      validation: (r) => r.required() }),
    defineField({ name: 'topicos', title: 'O que tem dentro', type: 'array',
      of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'capa', title: 'Imagem', type: 'imagemComAlt',
      validation: (r) => r.required() }),
    defineField({ name: 'arquivo', title: 'Arquivo PDF', type: 'file',
      options: { accept: '.pdf' }, validation: (r) => r.required() }),
    defineField({ name: 'ativo', title: 'Disponível', type: 'boolean', initialValue: true }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'titulo', media: 'capa' } },
});
```

### `documents/lead.ts`

```ts
import { defineType, defineField } from 'sanity';

export const lead = defineType({
  name: 'lead',
  title: 'Contato recebido',
  type: 'document',
  // Somente leitura no Studio: quem grava é a API do site
  readOnly: true,
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp', type: 'string' }),
    defineField({ name: 'email', title: 'E-mail', type: 'string' }),
    defineField({ name: 'origem', title: 'De onde veio', type: 'string' }),
    defineField({ name: 'saidaInteresse', title: 'Saída de interesse', type: 'string' }),
    defineField({ name: 'mensagem', title: 'Mensagem', type: 'text' }),
    defineField({ name: 'consentimento', title: 'Autorizou o contato', type: 'boolean' }),
    defineField({ name: 'recebidoEm', title: 'Recebido em', type: 'datetime' }),
  ],
  orderings: [
    { title: 'Mais recentes', name: 'recente',
      by: [{ field: 'recebidoEm', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'nome', origem: 'origem', quando: 'recebidoEm' },
    prepare: ({ title, origem, quando }) => ({
      title,
      subtitle: `${origem ?? 'site'} · ${quando ? new Date(quando).toLocaleDateString('pt-BR') : ''}`,
    }),
  },
});
```

---

## 5. Singletons

### `singletons/configuracao.ts`

```ts
import { defineType, defineField } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const configuracao = defineType({
  name: 'configuracao',
  title: 'Configurações do site',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'contato', title: 'Contato', default: true },
    { name: 'home', title: 'Página inicial' },
    { name: 'numeros', title: 'Números' },
  ],
  fields: [
    defineField({
      name: 'whatsapp', title: 'WhatsApp', type: 'string', group: 'contato',
      description: 'Com DDI e DDD, só números. Ex.: 5519998765432',
      validation: (r) => r.required().regex(/^\d{12,13}$/,
        { name: 'whatsapp', invert: false }).error('Digite só números, com DDI e DDD.'),
    }),
    defineField({ name: 'email', title: 'E-mail', type: 'string', group: 'contato',
      validation: (r) => r.required().email() }),
    defineField({ name: 'instagram', title: 'Instagram', type: 'url', group: 'contato' }),

    defineField({ name: 'heroTitulo', title: 'Título da página inicial', type: 'string',
      group: 'home', validation: (r) => r.required().max(70) }),
    defineField({ name: 'heroSubtitulo', title: 'Subtítulo', type: 'text', rows: 2,
      group: 'home', validation: (r) => r.max(180) }),
    defineField({ name: 'heroImagem', title: 'Foto principal', type: 'imagemComAlt',
      group: 'home', validation: (r) => r.required() }),

    defineField({ name: 'peregrinosGuiados', title: 'Peregrinos já guiados', type: 'number',
      group: 'numeros' }),
    defineField({ name: 'saidasRealizadas', title: 'Saídas realizadas', type: 'number',
      group: 'numeros' }),
    defineField({ name: 'anoInicio', title: 'Guiando desde', type: 'number',
      group: 'numeros' }),
  ],
  preview: { prepare: () => ({ title: 'Configurações do site' }) },
});
```

### `singletons/quemSou.ts`

```ts
import { defineType, defineField } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const quemSou = defineType({
  name: 'quemSou',
  title: 'Quem sou',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({ name: 'titulo', title: 'Título da página', type: 'string',
      initialValue: 'Quem caminha com você' }),
    defineField({ name: 'foto', title: 'Sua foto', type: 'imagemComAlt',
      validation: (r) => r.required() }),
    defineField({ name: 'historia', title: 'Sua história', type: 'array',
      of: [{ type: 'block' }, { type: 'imagemComAlt' }],
      description: 'Conte por que você guia. É a página que decide a confiança de quem vai contratar.',
      validation: (r) => r.required() }),
    defineField({ name: 'credenciais', title: 'Formação e credenciais', type: 'array',
      of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Quem sou' }) },
});
```

---

## 6. Registro dos schemas

### `schemaTypes/index.ts`

```ts
import { imagemComAlt } from './objects/imagemComAlt';
import { seo } from './objects/seo';
import { diaRoteiro } from './objects/diaRoteiro';

import { saida } from './documents/saida';
import { ramal } from './documents/ramal';
import { depoimento } from './documents/depoimento';
import { post } from './documents/post';
import { faq } from './documents/faq';
import { material } from './documents/material';
import { lead } from './documents/lead';

import { configuracao } from './singletons/configuracao';
import { quemSou } from './singletons/quemSou';

export const schemaTypes = [
  imagemComAlt, seo, diaRoteiro,
  saida, ramal, depoimento, post, faq, material, lead,
  configuracao, quemSou,
];
```

---

## 7. Estrutura do Studio em português

O menu lateral que o Felipe vê. Singletons trancados como item único, `lead` numa seção separada.

### `sanity/structure.ts`

```ts
import type { StructureResolver } from 'sanity/structure';
import {
  CalendarIcon, DocumentTextIcon, CommentIcon, HelpCircleIcon,
  DownloadIcon, UsersIcon, CogIcon, UserIcon, PinIcon,
} from '@sanity/icons';

export const estrutura: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      S.listItem()
        .title('Saídas')
        .icon(CalendarIcon)
        .child(
          S.list().title('Saídas').items([
            S.listItem().title('Próximas').child(
              S.documentList()
                .title('Próximas saídas')
                .filter('_type == "saida" && dataFim >= now()')
                .defaultOrdering([{ field: 'dataInicio', direction: 'asc' }])
            ),
            S.listItem().title('Realizadas').child(
              S.documentList()
                .title('Saídas realizadas')
                .filter('_type == "saida" && dataFim < now()')
                .defaultOrdering([{ field: 'dataInicio', direction: 'desc' }])
            ),
          ])
        ),

      S.divider(),

      S.documentTypeListItem('post').title('Blog').icon(DocumentTextIcon),
      S.documentTypeListItem('depoimento').title('Depoimentos').icon(CommentIcon),
      S.documentTypeListItem('faq').title('Perguntas frequentes').icon(HelpCircleIcon),
      S.documentTypeListItem('material').title('Materiais para baixar').icon(DownloadIcon),
      S.documentTypeListItem('ramal').title('Ramais').icon(PinIcon),

      S.divider(),

      S.listItem()
        .title('Contatos recebidos')
        .icon(UsersIcon)
        .child(
          S.documentList()
            .title('Contatos recebidos')
            .filter('_type == "lead"')
            .defaultOrdering([{ field: 'recebidoEm', direction: 'desc' }])
        ),

      S.divider(),

      S.listItem()
        .title('Quem sou')
        .icon(UserIcon)
        .child(S.document().schemaType('quemSou').documentId('quemSou')),

      S.listItem()
        .title('Configurações do site')
        .icon(CogIcon)
        .child(S.document().schemaType('configuracao').documentId('configuracao')),
    ]);
```

### `sanity.config.ts`

```ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { ptBRLocale } from '@sanity/locale-pt-br';
import { schemaTypes } from './src/sanity/schemaTypes';
import { estrutura } from './src/sanity/structure';

const singletons = ['configuracao', 'quemSou'];

export default defineConfig({
  name: 'felipemuniz',
  title: 'Site do Felipe Muniz',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    structureTool({ structure: estrutura }),
    visionTool(),
    ptBRLocale(),   // interface do Studio em português
  ],
  schema: {
    types: schemaTypes,
    // Esconde singletons e leads do botão "criar novo"
    templates: (prev) =>
      prev.filter((t) => ![...singletons, 'lead'].includes(t.schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletons.includes(schemaType)
        ? prev.filter(({ action }) =>
            ['publish', 'discardChanges', 'restore'].includes(action!))
        : prev,
  },
});
```

`@sanity/locale-pt-br` traduz a interface do Studio. Com ele mais os rótulos em português dos schemas, o Felipe não encontra uma palavra em inglês em lugar nenhum.

---

## 8. Tipos gerados

```bash
npx sanity@latest schema extract --path=./schema.json
npx sanity@latest typegen generate
```

Gera `src/sanity/types.ts` com todos os tipos derivados dos schemas e das queries GROQ. Adicionar ao `package.json`:

```json
{
  "scripts": {
    "typegen": "sanity schema extract --path=./schema.json && sanity typegen generate",
    "build": "npm run typegen && next build"
  }
}
```

Assim, se o Felipe pedir um campo novo e o Bruno alterar o schema sem atualizar o componente, o build quebra na hora — não no ar.
