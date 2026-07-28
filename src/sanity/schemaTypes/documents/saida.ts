import { defineType, defineField, type SanityDocument } from 'sanity';
import { icons } from '@sanity/icons';

export const saida = defineType({
  name: 'saida',
  title: 'Saída',
  type: 'document',
  icon: icons.calendar,
  groups: [
    { name: 'principal', title: 'Principal', default: true },
    { name: 'roteiro', title: 'Roteiro' },
    { name: 'comercial', title: 'Vagas e valor' },
    { name: 'midia', title: 'Fotos' },
    { name: 'busca', title: 'Google' },
  ],
  fields: [
    defineField({
      name: 'titulo',
      title: 'Nome da saída',
      type: 'string',
      group: 'principal',
      description: 'Ex.: "Saída de Setembro — Águas da Prata"',
      validation: (regra) => regra.required().error('Toda saída precisa de um nome.'),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço da página',
      type: 'slug',
      group: 'principal',
      description: 'Gerado do nome. Não mude depois de publicar — o link antigo para de funcionar.',
      options: {
        source: 'titulo',
        maxLength: 80,
        slugify: (entrada) =>
          entrada
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .slice(0, 80),
      },
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'ramal',
      title: 'Ramal',
      type: 'reference',
      to: [{ type: 'ramal' }],
      group: 'principal',
      description: 'Por qual ramal do Caminho da Fé esse grupo vai.',
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'dataInicio',
      title: 'Data de saída',
      type: 'date',
      group: 'principal',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'dataFim',
      title: 'Data de chegada',
      type: 'date',
      group: 'principal',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (regra) =>
        regra.required().custom((fim, contexto) => {
          const inicio = (contexto.document as { dataInicio?: string } | undefined)?.dataInicio;
          if (!fim || !inicio) return true;
          return new Date(fim) >= new Date(inicio)
            ? true
            : 'A chegada não pode ser antes da saída.';
        }),
    }),
    defineField({
      name: 'cidadeSaida',
      title: 'Cidade de partida',
      type: 'string',
      group: 'principal',
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'resumo',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      group: 'principal',
      description: 'Duas ou três linhas. Aparece no card e no compartilhamento.',
      validation: (regra) => regra.required().max(300),
    }),

    // ── Roteiro ───────────────────────────────────────────
    defineField({
      name: 'distanciaKm',
      title: 'Distância total (km)',
      type: 'number',
      group: 'roteiro',
      validation: (regra) => regra.required().positive(),
    }),
    defineField({
      name: 'nivel',
      title: 'Nível de exigência',
      type: 'string',
      group: 'roteiro',
      options: {
        list: [
          { title: 'Leve — até 18 km por dia', value: 'leve' },
          { title: 'Moderado — 18 a 25 km por dia', value: 'moderado' },
          { title: 'Exigente — acima de 25 km por dia', value: 'exigente' },
        ],
        layout: 'radio',
      },
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'roteiro',
      title: 'Roteiro dia a dia',
      type: 'array',
      of: [{ type: 'diaRoteiro' }],
      group: 'roteiro',
      validation: (regra) => regra.min(1).error('Adicione pelo menos um dia.'),
    }),

    // ── Comercial ─────────────────────────────────────────
    defineField({
      name: 'vagasTotal',
      title: 'Total de vagas',
      type: 'number',
      group: 'comercial',
      validation: (regra) => regra.required().integer().min(1),
    }),
    defineField({
      name: 'vagasDisponiveis',
      title: 'Vagas ainda disponíveis',
      type: 'number',
      group: 'comercial',
      description:
        'Atualize aqui quando fechar uma vaga. O selo do site muda sozinho: em 0, aparece "Esgotada".',
      validation: (regra) =>
        regra.required().integer().min(0).custom((disp, contexto) => {
          const total = (contexto.document as { vagasTotal?: number } | undefined)?.vagasTotal;
          if (disp == null || total == null) return true;
          return disp <= total ? true : 'Não pode haver mais vagas livres que o total.';
        }),
    }),
    defineField({
      name: 'valor',
      title: 'Valor',
      type: 'string',
      group: 'comercial',
      description: 'Escreva como preferir. Ex.: "R$ 2.400 · em até 6x no cartão"',
    }),
    defineField({
      name: 'incluso',
      title: 'Está incluso',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'comercial',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'naoIncluso',
      title: 'Não está incluso',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'comercial',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'destaque',
      title: 'Mostrar em destaque na página inicial',
      type: 'boolean',
      group: 'comercial',
      initialValue: false,
    }),

    // ── Mídia ─────────────────────────────────────────────
    defineField({
      name: 'imagemCapa',
      title: 'Foto de capa',
      type: 'imagemComAlt',
      group: 'midia',
      validation: (regra) => regra.required(),
    }),
    defineField({
      name: 'galeria',
      title: 'Galeria',
      type: 'array',
      of: [{ type: 'imagemComAlt' }],
      group: 'midia',
      options: { layout: 'grid' },
    }),

    // ── Área do grupo ─────────────────────────────────────
    defineField({
      name: 'slugGrupo',
      title: 'Link privado do grupo',
      type: 'slug',
      group: 'comercial',
      description:
        'Endereço secreto da página do grupo. Envie só para quem já confirmou. Não aparece no Google.',
      options: {
        source: (doc: SanityDocument) => {
          const slug = (doc as SanityDocument & { slug?: { current?: string } }).slug?.current;
          return `${slug ?? 'grupo'}-${Math.random().toString(36).slice(2, 8)}`;
        },
      },
    }),
    defineField({
      name: 'orientacoesGrupo',
      title: 'Orientações para o grupo',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'comercial',
      description: 'Só aparece na página privada do grupo.',
    }),

    defineField({ name: 'seo', type: 'seo', group: 'busca' }),
  ],

  orderings: [
    {
      title: 'Data de saída (mais próxima primeiro)',
      name: 'dataAsc',
      by: [{ field: 'dataInicio', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      titulo: 'titulo',
      inicio: 'dataInicio',
      fim: 'dataFim',
      vagas: 'vagasDisponiveis',
      total: 'vagasTotal',
      midia: 'imagemCapa',
    },
    prepare: ({ titulo, inicio, fim, vagas, total, midia }) => {
      const passou = fim && new Date(fim) < new Date();
      const estado = passou
        ? 'Realizada'
        : vagas === 0
          ? 'Esgotada'
          : vagas <= Math.ceil((total ?? 0) * 0.3)
            ? `Últimas ${vagas} vagas`
            : `${vagas} vagas`;
      const data = inicio
        ? new Date(inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'sem data';
      return { title: titulo, subtitle: `${data} · ${estado}`, media: midia };
    },
  },
});
