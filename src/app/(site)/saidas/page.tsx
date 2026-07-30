import { buscar } from '@/sanity/client';
import { PROXIMAS_SAIDAS, SAIDAS_REALIZADAS } from '@/sanity/queries';
import { CardSaida } from '@/components/saida/CardSaida';
import { Container } from '@/components/ui/Container';
import type { PROXIMAS_SAIDAS_RESULT, SAIDAS_REALIZADAS_RESULT } from '@/sanity/types';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Próximas saídas no Caminho da Fé',
  description:
    'Datas, roteiro dia a dia e vagas disponíveis para caminhar o Caminho da Fé com o guia Felipe Muniz.',
};

export default async function PaginaSaidas() {
  const [proximas, realizadas] = await Promise.all([
    buscar<PROXIMAS_SAIDAS_RESULT>(PROXIMAS_SAIDAS, {}, ['saida']),
    buscar<SAIDAS_REALIZADAS_RESULT>(SAIDAS_REALIZADAS, {}, ['saida']),
  ]);

  return (
    <Container className="py-16">
      <section>
        <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
          Agenda
        </p>
        <h1 className="mt-2 [font-family:var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
          Próximas saídas
        </h1>

        {proximas.length === 0 ? (
          <p className="mt-8 max-w-[var(--largura-conteudo)] text-[var(--nevoa-fraca)]">
            Não há data aberta no momento. Deixe seu contato e você será avisado quando a
            próxima saída for publicada.
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proximas.map((saida) => (
              <li key={saida._id}>
                <CardSaida saida={saida} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {realizadas.length > 0 && (
        <section className="mt-24">
          <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
            Já aconteceram
          </p>
          <h2 className="mt-2 [font-family:var(--fonte-display)] text-[var(--texto-2xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
            Saídas realizadas
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {realizadas.map((saida) => (
              <li key={saida._id}>
                <CardSaida saida={saida} variante="realizada" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
