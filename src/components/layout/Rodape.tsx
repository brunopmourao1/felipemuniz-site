import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { formatarData } from '@/lib/datas';
import { linkDoWhatsapp, mensagemGeral } from '@/lib/whatsapp';

type SaidaRodape = { titulo: string; slug: string; dataInicio: string };

export function Rodape({
  proximasSaidas,
  whatsapp,
  email,
  instagram,
}: {
  proximasSaidas: SaidaRodape[];
  whatsapp: string;
  email: string;
  instagram?: string;
}) {
  return (
    <footer className="mt-24 border-t border-[color-mix(in_srgb,var(--dourado)_20%,transparent)] bg-[var(--azul-sombra)] py-16">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
              Saídas
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {proximasSaidas.length === 0 ? (
                <li className="text-sm text-[var(--nevoa-fraca)]">Nenhuma saída aberta no momento.</li>
              ) : (
                proximasSaidas.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/saidas/${s.slug}`} className="text-sm text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]">
                      {s.titulo} · {formatarData(s.dataInicio)}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
              Conteúdo
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              <li><Link href="/preparacao" className="text-sm text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]">Preparação</Link></li>
              <li><Link href="/blog" className="text-sm text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]">Blog</Link></li>
              <li><Link href="/perguntas-frequentes" className="text-sm text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]">Perguntas frequentes</Link></li>
              <li><Link href="/depoimentos" className="text-sm text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]">Depoimentos</Link></li>
            </ul>
          </div>

          <div>
            <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
              Contato
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <a href={linkDoWhatsapp(whatsapp, mensagemGeral())} className="text-sm text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="text-sm text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]">
                  {email}
                </a>
              </li>
              {instagram && (
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]">
                    Instagram
                  </a>
                </li>
              )}
              <li>
                <Link href="/politica-de-privacidade" className="text-sm text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]">
                  Política de privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-xs text-[var(--nevoa-fraca)]">
          Site desenvolvido por{' '}
          <a
            href="https://github.com/brunopmourao1"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--amarelo-seta)]"
          >
            Bruno Mourão
          </a>
        </p>
      </Container>
    </footer>
  );
}
