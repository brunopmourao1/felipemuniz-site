import type { StructureResolver } from 'sanity/structure';
import { icons } from '@sanity/icons';

export const estrutura: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      S.listItem()
        .title('Saídas')
        .icon(icons.calendar)
        .child(
          S.list().title('Saídas').items([
            S.listItem().title('Próximas').child(
              S.documentList()
                .title('Próximas saídas')
                .filter('_type == "saida" && dataFim >= now()')
                .defaultOrdering([{ field: 'dataInicio', direction: 'asc' }])
            ),
            S.listItem().title('Realizadas').child(
              S.documentList()
                .title('Saídas realizadas')
                .filter('_type == "saida" && dataFim < now()')
                .defaultOrdering([{ field: 'dataInicio', direction: 'desc' }])
            ),
          ])
        ),

      S.divider(),

      S.documentTypeListItem('post').title('Blog').icon(icons['document-text']),
      S.documentTypeListItem('depoimento').title('Depoimentos').icon(icons.comment),
      S.documentTypeListItem('faq').title('Perguntas frequentes').icon(icons['help-circle']),
      S.documentTypeListItem('material').title('Materiais para baixar').icon(icons.download),
      S.documentTypeListItem('ramal').title('Ramais').icon(icons.pin),

      S.divider(),

      S.listItem()
        .title('Contatos recebidos')
        .icon(icons.users)
        .child(
          S.documentList()
            .title('Contatos recebidos')
            .filter('_type == "lead"')
            .defaultOrdering([{ field: 'recebidoEm', direction: 'desc' }])
        ),

      S.divider(),

      S.listItem()
        .title('Quem sou')
        .icon(icons.user)
        .child(S.document().schemaType('quemSou').documentId('quemSou')),

      S.listItem()
        .title('Configurações do site')
        .icon(icons.cog)
        .child(S.document().schemaType('configuracao').documentId('configuracao')),
    ]);
