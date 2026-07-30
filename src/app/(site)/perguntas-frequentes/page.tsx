import { buscar } from '@/sanity/client';
import { FAQ_COMPLETA } from '@/sanity/queries';
import type { FAQ_COMPLETA_RESULT } from '@/sanity/types';
import { jsonLdFaq } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Acordeao } from '@/components/ui/Acordeao';

export const revalidate = 3600;

export const metadata = {
  title: 'Perguntas frequentes',
  description: 'Dúvidas comuns sobre o Caminho da Fé: decisão, preparo físico, equipamento e valores.',
};

const CATEGORIA_ORDEM = ['decisao', 'fisico', 'equipamento', 'caminho', 'valores'] as const;

const CATEGORIA_ROTULO: Record<(typeof CATEGORIA_ORDEM)[number], string> = {
  decisao: 'Antes de decidir',
  fisico: 'Preparação física',
  equipamento: 'O que levar',
  caminho: 'Durante o caminho',
  valores: 'Valores e pagamento',
};

export default async function PaginaFAQ() {
  const perguntas = await buscar<FAQ_COMPLETA_RESULT>(FAQ_COMPLETA, {}, ['faq']);

  const grupos = CATEGORIA_ORDEM.map((categoria) => ({
    categoria,
    itens: perguntas.filter((p) => p.categoria === categoria),
  })).filter((grupo) => grupo.itens.length > 0);

  return (
    <Container className="py-16">
      {perguntas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq(perguntas)) }}
        />
      )}

      <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Dúvidas
      </p>
      <h1 className="mt-2 max-w-2xl [font-family:var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        Perguntas frequentes
      </h1>

      {grupos.length === 0 ? (
        <p className="mt-10 max-w-md text-[var(--nevoa-fraca)]">
          Ainda não publicamos nenhuma pergunta. Volte em breve.
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-12">
          {grupos.map((grupo) => (
            <section key={grupo.categoria}>
              <h2 className="[font-family:var(--fonte-display)] text-lg font-bold text-[var(--nevoa)]">
                {CATEGORIA_ROTULO[grupo.categoria]}
              </h2>
              <div className="mt-4">
                <Acordeao itens={grupo.itens} />
              </div>
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}
