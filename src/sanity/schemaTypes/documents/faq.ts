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
