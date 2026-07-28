import { imagemComAlt } from './objects/imagemComAlt';
import { seo } from './objects/seo';
import { diaRoteiro } from './objects/diaRoteiro';

import { saida } from './documents/saida';
import { ramal } from './documents/ramal';
import { depoimento } from './documents/depoimento';
import { post } from './documents/post';
import { faq } from './documents/faq';
import { material } from './documents/material';
import { lead } from './documents/lead';

import { configuracao } from './singletons/configuracao';
import { quemSou } from './singletons/quemSou';

export const schemaTypes = [
  imagemComAlt, seo, diaRoteiro,
  saida, ramal, depoimento, post, faq, material, lead,
  configuracao, quemSou,
];
