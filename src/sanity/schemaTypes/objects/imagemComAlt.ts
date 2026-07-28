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
