import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';

export function PaginaNaoEncontrada() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-16">
      <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Erro 404
      </p>
      <h1 className="mt-2 font-[var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        Essa página não existe
      </h1>
      <p className="mt-4 max-w-md text-[var(--nevoa-fraca)]">
        O endereço pode ter mudado ou a saída que você procura já não está mais disponível.
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
