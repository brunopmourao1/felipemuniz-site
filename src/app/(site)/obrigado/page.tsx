import { buscar } from '@/sanity/client';
import { MATERIAL_POR_SLUG } from '@/sanity/queries';
import type { MATERIAL_POR_SLUG_RESULT } from '@/sanity/types';
import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';

export const metadata = {
  title: 'Recebemos seu contato',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ material?: string }> };

export default async function PaginaObrigado({ searchParams }: Props) {
  const { material: materialSlug } = await searchParams;
  const material = materialSlug
    ? await buscar<MATERIAL_POR_SLUG_RESULT>(MATERIAL_POR_SLUG, { slug: materialSlug }, ['material'])
    : null;

  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-16">
      <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Recebido
      </p>
      <h1 className="mt-2 [font-family:var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        Seu contato chegou até o Felipe
      </h1>

      {material ? (
        material.arquivoUrl ? (
          <p className="mt-4 max-w-md text-[var(--nevoa-fraca)]">
            Seu material &ldquo;{material.titulo}&rdquo; já está pronto. Também mandamos uma
            cópia para o seu e-mail.
          </p>
        ) : (
          <p className="mt-4 max-w-md text-[var(--nevoa-fraca)]">
            Recebemos seu pedido de &ldquo;{material.titulo}&rdquo;. O Felipe vai te enviar o
            arquivo em breve.
          </p>
        )
      ) : (
        <p className="mt-4 max-w-md text-[var(--nevoa-fraca)]">
          Se você pediu um material, ele chega no seu e-mail em instantes. Se foi um pedido de
          reserva, o Felipe fala com você pelo WhatsApp em breve.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        {material?.arquivoUrl && (
          <Botao href={material.arquivoUrl} variante="primario" comSeta>
            Baixar {material.titulo}
          </Botao>
        )}
        <Botao href="/saidas" variante={material?.arquivoUrl ? 'secundario' : 'primario'} comSeta>
          Ver próximas saídas
        </Botao>
        <Botao href="/" variante="secundario">
          Voltar para o início
        </Botao>
      </div>
    </Container>
  );
}
