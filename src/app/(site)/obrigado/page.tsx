import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';

export const metadata = {
  title: 'Recebemos seu contato',
  robots: { index: false, follow: false },
};

export default function PaginaObrigado() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-16">
      <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Recebido
      </p>
      <h1 className="mt-2 font-[var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        Seu contato chegou até o Felipe
      </h1>
      <p className="mt-4 max-w-md text-[var(--nevoa-fraca)]">
        Se você pediu um material, ele chega no seu e-mail em instantes. Se foi um pedido de
        reserva, o Felipe fala com você pelo WhatsApp em breve.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Botao href="/saidas" variante="primario" comSeta>
          Ver próximas saídas
        </Botao>
        <Botao href="/" variante="secundario">
          Voltar para o início
        </Botao>
      </div>
    </Container>
  );
}
