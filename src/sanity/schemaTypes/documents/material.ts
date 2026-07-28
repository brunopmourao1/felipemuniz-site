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
