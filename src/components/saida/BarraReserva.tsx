'use client';

import { useEffect, useState } from 'react';
import { Botao } from '@/components/ui/Botao';

export function BarraReserva({
  alvoId,
  periodo,
  vagasTexto,
  href,
  textoBotao,
}: {
  alvoId: string;
  periodo: string;
  vagasTexto: string;
  href: string;
  textoBotao: string;
}) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = document.getElementById(alvoId);
    if (!alvo) return;

    const observador = new IntersectionObserver(([entrada]) => setVisivel(!entrada.isIntersecting));
    observador.observe(alvo);
    return () => observador.disconnect();
  }, [alvoId]);

  useEffect(() => {
    document.body.classList.toggle('tem-barra-reserva', visivel);
    return () => document.body.classList.remove('tem-barra-reserva');
  }, [visivel]);

  if (!visivel) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-[var(--dourado)] bg-[var(--azul-sombra)] px-4 py-3 md:hidden">
      <div className="min-w-0 [font-family:var(--fonte-dados)] text-xs text-[var(--nevoa)] [font-variant-numeric:tabular-nums]">
        <p className="truncate">{periodo}</p>
        <p className="truncate text-[var(--nevoa-fraca)]">{vagasTexto}</p>
      </div>
      <Botao href={href} variante="primario" comSeta className="shrink-0">
        {textoBotao}
      </Botao>
    </div>
  );
}
