import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const classeControle =
  'w-full min-h-11 rounded-[var(--raio-m)] border border-[color-mix(in_srgb,var(--dourado)_30%,transparent)] bg-[var(--azul-noite)] px-4 py-2 text-[var(--nevoa)] font-[var(--fonte-corpo)] placeholder:text-[var(--nevoa-fraca)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--amarelo-seta)] focus-visible:border-[var(--amarelo-seta)]';

type PropsBase = {
  label: string;
  id: string;
  erro?: string;
  descricao?: string;
};

type PropsInput = PropsBase & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' };
type PropsTextarea = PropsBase & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' };

export const Campo = forwardRef<HTMLInputElement | HTMLTextAreaElement, PropsInput | PropsTextarea>(
  function Campo(props, ref) {
    const { label, id, erro, descricao, className, ...resto } = props;
    const idErro = erro ? `${id}-erro` : undefined;
    const idDescricao = descricao ? `${id}-descricao` : undefined;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-sm text-[var(--nevoa-fraca)]">
          {label}
        </label>
        {descricao && (
          <p id={idDescricao} className="text-xs text-[var(--nevoa-fraca)]">
            {descricao}
          </p>
        )}
        {props.as === 'textarea' ? (
          <textarea
            id={id}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            aria-invalid={!!erro}
            aria-describedby={[idDescricao, idErro].filter(Boolean).join(' ') || undefined}
            className={`${classeControle} ${className ?? ''}`}
            {...(resto as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={id}
            ref={ref as React.Ref<HTMLInputElement>}
            aria-invalid={!!erro}
            aria-describedby={[idDescricao, idErro].filter(Boolean).join(' ') || undefined}
            className={`${classeControle} ${className ?? ''}`}
            {...(resto as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {erro && (
          <p id={idErro} role="alert" className="text-sm text-[var(--erro)]">
            {erro}
          </p>
        )}
      </div>
    );
  }
);
