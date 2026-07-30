import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variante = 'primario' | 'secundario' | 'fantasma';

const baseClasse =
  'inline-flex items-center justify-center gap-2 min-h-11 px-6 [font-family:var(--fonte-display)] font-bold uppercase tracking-[0.05em] text-sm rounded-[var(--raio-m)] transition-[filter,transform,background-color] duration-150';

const classePorVariante: Record<Variante, string> = {
  primario:
    'bg-[var(--amarelo-seta)] text-[var(--azul-profundo)] hover:brightness-[0.92]',
  secundario:
    'bg-transparent text-[var(--nevoa)] border border-[var(--dourado)] hover:bg-[color-mix(in_srgb,var(--dourado)_12%,transparent)]',
  fantasma:
    'bg-transparent text-[var(--nevoa-fraca)] normal-case [font-family:var(--fonte-corpo)] font-normal tracking-normal hover:underline',
};

type PropsComuns = {
  variante?: Variante;
  comSeta?: boolean;
  children: ReactNode;
};

type PropsLink = PropsComuns &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type PropsBotao = PropsComuns &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Botao(props: PropsLink | PropsBotao) {
  const { variante = 'primario', comSeta = false, children, className, ...resto } = props;
  const classe = `group ${baseClasse} ${classePorVariante[variante]} ${className ?? ''}`;

  const conteudo = (
    <>
      {children}
      {comSeta && (
        <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">
          →
        </span>
      )}
    </>
  );

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classe} {...(resto as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {conteudo}
      </Link>
    );
  }

  return (
    <button className={classe} {...(resto as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {conteudo}
    </button>
  );
}
