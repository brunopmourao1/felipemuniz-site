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
