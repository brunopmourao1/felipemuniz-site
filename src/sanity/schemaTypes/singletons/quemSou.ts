import { defineType, defineField } from 'sanity';
import { icons } from '@sanity/icons';

export const quemSou = defineType({
  name: 'quemSou',
  title: 'Quem sou',
  type: 'document',
  icon: icons.user,
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
