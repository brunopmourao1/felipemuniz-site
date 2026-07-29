import type { MetadataRoute } from 'next';
import { buscar } from '@/sanity/client';
import { SITEMAP } from '@/sanity/queries';
import type { SITEMAP_RESULT } from '@/sanity/types';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dados = await buscar<SITEMAP_RESULT>(SITEMAP, {}, [
    'saida',
    'post',
    'ramal',
    'material',
  ]);

  const fixas = (
    [
      { url: '', prioridade: 1.0, frequencia: 'weekly' },
      { url: '/saidas', prioridade: 0.9, frequencia: 'daily' },
      { url: '/preparacao', prioridade: 0.8, frequencia: 'weekly' },
      { url: '/o-caminho', prioridade: 0.8, frequencia: 'monthly' },
      { url: '/quem-sou', prioridade: 0.7, frequencia: 'monthly' },
      { url: '/blog', prioridade: 0.7, frequencia: 'weekly' },
      { url: '/depoimentos', prioridade: 0.6, frequencia: 'weekly' },
      { url: '/perguntas-frequentes', prioridade: 0.6, frequencia: 'monthly' },
      { url: '/contato', prioridade: 0.5, frequencia: 'yearly' },
      { url: '/politica-de-privacidade', prioridade: 0.3, frequencia: 'yearly' },
    ] as const
  ).map((p) => ({
    url: `${SITE}${p.url}`,
    lastModified: new Date(),
    changeFrequency: p.frequencia,
    priority: p.prioridade,
  }));

  const dinamicas: MetadataRoute.Sitemap = [
    ...dados.saidas
      .filter((s) => s.slug)
      .map((s) => ({
        url: `${SITE}/saidas/${s.slug}`,
        lastModified: new Date(s._updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })),
    ...dados.posts
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${SITE}/blog/${p.slug}`,
        lastModified: new Date(p._updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ...dados.ramais
      .filter((r) => r.slug)
      .map((r) => ({
        url: `${SITE}/o-caminho/${r.slug}`,
        lastModified: new Date(r._updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ...dados.materiais
      .filter((m) => m.slug)
      .map((m) => ({
        url: `${SITE}/materiais/${m.slug}`,
        lastModified: new Date(m._updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
  ];

  return [...fixas, ...dinamicas];
}
