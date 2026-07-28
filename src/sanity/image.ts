import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { dataset, projectId } from './client';

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlDaImagem = (fonte: SanityImageSource) =>
  builder.image(fonte).auto('format').fit('max');
