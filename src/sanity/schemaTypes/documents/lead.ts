import { defineType, defineField } from 'sanity';

export const lead = defineType({
  name: 'lead',
  title: 'Contato recebido',
  type: 'document',
  // Somente leitura no Studio: quem grava é a API do site
  readOnly: true,
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp', type: 'string' }),
    defineField({ name: 'email', title: 'E-mail', type: 'string' }),
    defineField({ name: 'origem', title: 'De onde veio', type: 'string' }),
    defineField({ name: 'saidaInteresse', title: 'Saída de interesse', type: 'string' }),
    defineField({ name: 'mensagem', title: 'Mensagem', type: 'text' }),
    defineField({ name: 'consentimento', title: 'Autorizou o contato', type: 'boolean' }),
    defineField({ name: 'recebidoEm', title: 'Recebido em', type: 'datetime' }),
  ],
  orderings: [
    { title: 'Mais recentes', name: 'recente',
      by: [{ field: 'recebidoEm', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'nome', origem: 'origem', quando: 'recebidoEm' },
    prepare: ({ title, origem, quando }) => ({
      title,
      subtitle: `${origem ?? 'site'} · ${
        quando
          ? new Date(quando).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
          : ''
      }`,
    }),
  },
});
