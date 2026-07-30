import { defineType, defineField } from 'sanity';
import { icons } from '@sanity/icons';

export const configuracao = defineType({
  name: 'configuracao',
  title: 'Configurações do site',
  type: 'document',
  icon: icons.cog,
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
    defineField({
      name: 'heroCitacao', title: 'Citação devocional do hero', type: 'text', rows: 2,
      group: 'home',
      description:
        'A frase que aparece depois da seta se pintar na tela, na abertura da home. ' +
        'Curta e de voz própria — é o único lugar do site, além de depoimento de peregrino, ' +
        'onde o texto aparece em itálico.',
      validation: (r) => r.required().max(160),
    }),

    defineField({ name: 'peregrinosGuiados', title: 'Peregrinos já guiados', type: 'number',
      group: 'numeros' }),
    defineField({ name: 'saidasRealizadas', title: 'Saídas realizadas', type: 'number',
      group: 'numeros' }),
    defineField({ name: 'anoInicio', title: 'Guiando desde', type: 'number',
      group: 'numeros' }),
  ],
  preview: { prepare: () => ({ title: 'Configurações do site' }) },
});
