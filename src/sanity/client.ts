import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from './env';

export { projectId, dataset, apiVersion };

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN para leitura pública
  perspective: 'published',
});

// Wrapper tipado com cache por tag
export async function buscar<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = []
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { tags, revalidate: 3600 },
  });
}
