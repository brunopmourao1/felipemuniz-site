import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { ptBRLocale } from '@sanity/locale-pt-br';
import { schemaTypes } from './src/sanity/schemaTypes';
import { estrutura } from './src/sanity/structure';
import { apiVersion, dataset, projectId } from './src/sanity/env';

const singletons = ['configuracao', 'quemSou'];

export default defineConfig({
  name: 'felipemuniz',
  title: 'Site do Felipe Muniz',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure: estrutura }),
    visionTool({ defaultApiVersion: apiVersion }),
    ptBRLocale(),   // interface do Studio em português
  ],
  schema: {
    types: schemaTypes,
    // Esconde singletons e leads do botão "criar novo"
    templates: (prev) =>
      prev.filter((t) => ![...singletons, 'lead'].includes(t.schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletons.includes(schemaType)
        ? prev.filter(({ action }) =>
            ['publish', 'discardChanges', 'restore'].includes(action!))
        : prev,
  },
});
