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
