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
