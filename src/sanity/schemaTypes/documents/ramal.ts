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
