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
