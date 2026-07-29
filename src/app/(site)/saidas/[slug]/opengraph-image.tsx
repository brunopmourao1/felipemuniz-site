import { ImageResponse } from 'next/og';
import { buscar } from '@/sanity/client';
import { SAIDA_POR_SLUG } from '@/sanity/queries';
import type { SAIDA_POR_SLUG_RESULT } from '@/sanity/types';
import { formatarPeriodo } from '@/lib/datas';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Saída no Caminho da Fé';

type Props = { params: Promise<{ slug: string }> };

export default async function Imagem({ params }: Props) {
  const { slug } = await params;
  const saida = await buscar<SAIDA_POR_SLUG_RESULT>(SAIDA_POR_SLUG, { slug }, ['saida']);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 72,
          background: 'linear-gradient(160deg, #0B2038 0%, #12314F 100%)',
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#C9A227',
            marginBottom: 20,
          }}
        >
          Caminho da Fé
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: '#E4EBF1',
            lineHeight: 1.05,
            marginBottom: 28,
          }}
        >
          {saida?.titulo ?? 'Saída no Caminho da Fé'}
        </div>
        <div style={{ fontSize: 32, color: '#9BB0C4' }}>
          {saida?.dataInicio && saida?.dataFim
            ? formatarPeriodo(saida.dataInicio, saida.dataFim)
            : ''}
          {saida?.distanciaKm ? ` · ${saida.distanciaKm} km` : ''}
        </div>
        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 6, background: '#F5B31E' }} />
          <div style={{ fontSize: 28, color: '#F5B31E' }}>com Felipe Muniz</div>
        </div>
      </div>
    ),
    size
  );
}
