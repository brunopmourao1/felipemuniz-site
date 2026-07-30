'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { urlDaImagem } from '@/sanity/image';
import { Botao } from '@/components/ui/Botao';
import type {
  CONFIGURACAO_RESULT,
  MATERIAL_PRINCIPAL_RESULT,
  QUEM_SOU_RESULT,
} from '@/sanity/types';

// Pontos de corte do progresso (0 a 1) — únicos números a mexer pra
// recalibrar o ritmo (ver documento 04, seção 5.1). A distância total de
// scroll é a altura do wrapper na JSX abaixo (h-[220vh]).
const CENA0_SAI_INICIO = 0.2;
const CENA0_SAI_FIM = 0.32;
const CENA1_ENTRA_INICIO = 0.22;
const CENA1_ENTRA_FIM = 0.34;
const CENA1_SAI_INICIO = 0.56;
const CENA1_SAI_FIM = 0.68;
const CENA2_ENTRA_INICIO = 0.58;
const CENA2_ENTRA_FIM = 0.78;
const SETA_INICIO = 0.24;
const SETA_FIM = 0.36;
const FATOR_SUAVIZACAO = 0.12;

function remapear(v: number, a: number, b: number): number {
  if (b === a) return v >= b ? 1 : 0;
  const t = (v - a) / (b - a);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

// Sobe de 0 a 1 entre [inicio,entradaFim], segura em 1, desce a 0 entre [saidaInicio,fim].
function trapezio(p: number, inicio: number, entradaFim: number, saidaInicio: number, fim: number): number {
  if (p <= inicio) return 0;
  if (p < entradaFim) return remapear(p, inicio, entradaFim);
  if (p <= saidaInicio) return 1;
  if (p < fim) return 1 - remapear(p, saidaInicio, fim);
  return 0;
}

export function HeroCinematico({
  config,
  material,
  quemSou,
}: {
  config: CONFIGURACAO_RESULT;
  material: MATERIAL_PRINCIPAL_RESULT;
  quemSou: QUEM_SOU_RESULT;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const cenaLugarRef = useRef<HTMLDivElement>(null);
  const cenaCitacaoRef = useRef<HTMLDivElement>(null);
  const cenaGuiaRef = useRef<HTMLDivElement>(null);
  const setaRef = useRef<HTMLImageElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const cenaLugar = cenaLugarRef.current;
    const cenaCitacao = cenaCitacaoRef.current;
    const cenaGuia = cenaGuiaRef.current;
    const seta = setaRef.current;
    const cue = cueRef.current;
    if (!wrapper || !stage || !cenaLugar || !cenaCitacao || !cenaGuia || !seta || !cue) return;

    // Medidas de layout lidas uma vez (não a cada frame de scroll, que força
    // reflow síncrono) e recalculadas só quando a página muda de tamanho.
    let offsetTopCache = 0;
    let alturaRolavelCache = 0;
    function medir() {
      offsetTopCache = wrapper!.offsetTop;
      alturaRolavelCache = wrapper!.offsetHeight - stage!.offsetHeight;
    }

    function progressoDoScroll() {
      return alturaRolavelCache > 0
        ? remapear(window.scrollY - offsetTopCache, 0, alturaRolavelCache)
        : 0;
    }

    function aplicarCena(el: HTMLElement, opacidade: number, deslocaPx: number) {
      el.style.opacity = String(opacidade);
      el.style.transform = `translateY(${deslocaPx * (1 - opacidade)}px)`;
      // Tira a cena inativa do foco de teclado e da árvore de acessibilidade
      // num passo só — mais robusto que aria-hidden + pointer-events manual.
      el.inert = opacidade <= 0.02;
    }

    function aplicarVisual(p: number) {
      const op0 = p >= CENA0_SAI_FIM ? 0 : p <= CENA0_SAI_INICIO ? 1
        : 1 - remapear(p, CENA0_SAI_INICIO, CENA0_SAI_FIM);
      const op1 = trapezio(p, CENA1_ENTRA_INICIO, CENA1_ENTRA_FIM, CENA1_SAI_INICIO, CENA1_SAI_FIM);
      const op2 = remapear(p, CENA2_ENTRA_INICIO, CENA2_ENTRA_FIM);

      aplicarCena(cenaLugar!, op0, -24);
      aplicarCena(cenaCitacao!, op1, 24);
      aplicarCena(cenaGuia!, op2, 24);

      // Seta "pintada" — clip-path revela da esquerda pra direita.
      const progressoSeta = remapear(p, SETA_INICIO, SETA_FIM);
      const recorteDireita = 103 - progressoSeta * 106;
      seta!.style.clipPath = `inset(-6% ${recorteDireita}% -6% -3%)`;

      // "Role para continuar" some quando a cena do guia assume de vez.
      cue!.style.opacity = String(1 - op2);
    }

    let progressoAlvo = 0;
    let progressoSuave = 0;
    let rodando = false;
    let intersectando = false;

    function laco() {
      progressoSuave += (progressoAlvo - progressoSuave) * FATOR_SUAVIZACAO;
      if (Math.abs(progressoAlvo - progressoSuave) < 0.0005) progressoSuave = progressoAlvo;
      aplicarVisual(progressoSuave);

      // Continua só enquanto ainda está convergindo pro alvo — parado (e já
      // alcançado), não há motivo pra continuar gastando frame.
      if (progressoSuave !== progressoAlvo) {
        requestAnimationFrame(laco);
      } else {
        rodando = false;
      }
    }

    function iniciarLaco() {
      if (rodando) return;
      rodando = true;
      requestAnimationFrame(laco);
    }

    // Só reage ao scroll (e só faz aritmética barata) enquanto o trecho fixo
    // está perto da tela.
    const observador = new IntersectionObserver(
      (entradas) => {
        intersectando = entradas[0].isIntersecting;
        if (intersectando) iniciarLaco();
      },
      { rootMargin: '20% 0px 20% 0px' }
    );
    observador.observe(wrapper);

    function aoRolar() {
      progressoAlvo = progressoDoScroll();
      if (intersectando) iniciarLaco();
    }
    window.addEventListener('scroll', aoRolar, { passive: true });

    function aoRedimensionar() {
      medir();
      progressoAlvo = progressoDoScroll();
      iniciarLaco();
    }
    window.addEventListener('resize', aoRedimensionar);

    medir();
    progressoAlvo = progressoDoScroll();
    progressoSuave = progressoAlvo;
    aplicarVisual(progressoSuave);

    return () => {
      observador.disconnect();
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRedimensionar);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative -mt-16 h-[220vh] motion-reduce:h-auto">
      <section
        ref={stageRef}
        className="sticky top-0 h-screen overflow-hidden bg-[var(--azul-profundo)] motion-reduce:relative motion-reduce:h-auto"
      >
        {/* Cena 1 — o lugar */}
        <div
          ref={cenaLugarRef}
          className="absolute inset-0 flex items-center justify-center motion-reduce:relative motion-reduce:min-h-screen motion-reduce:py-16"
        >
          {config?.heroImagem?.asset && (
            <div className="absolute inset-[-8%] overflow-hidden" aria-hidden="true">
              <Image
                src={urlDaImagem(config.heroImagem).width(1920).height(2560).url()}
                alt={config.heroImagem.alt}
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                placeholder={config.heroImagem.lqip ? 'blur' : undefined}
                blurDataURL={config.heroImagem.lqip ?? undefined}
                className="animate-[heroZoom_22s_ease-out_both] object-cover [transform-origin:50%_35%]"
              />
            </div>
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--azul-profundo) 0%, color-mix(in srgb, var(--azul-profundo) 55%, transparent) 45%, color-mix(in srgb, var(--azul-profundo) 15%, transparent) 70%, transparent 100%)',
            }}
          />
          <div className="relative z-[1] flex flex-col items-center px-6 text-center">
            <p className="animate-[fadeUp_.9s_ease-out_.15s_both] font-[var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
              Peregrinação
            </p>
            <h1 className="animate-[fadeUp_1s_ease-out_.35s_both] mt-5 max-w-3xl font-[var(--fonte-hero)] text-[var(--texto-4xl)] font-semibold leading-[1] tracking-[0.01em] text-[var(--nevoa)]">
              {config?.heroTitulo ?? 'Caminhe o Caminho da Fé com quem conhece cada passo'}
            </h1>
            <div
              aria-hidden="true"
              className="animate-[fadeUp_.9s_ease-out_.4s_both] mt-6 h-px w-12 bg-[var(--dourado)]"
            />
            {config?.heroSubtitulo && (
              <p className="animate-[fadeUp_.9s_ease-out_.55s_both] mt-6 max-w-xl text-[var(--texto-lg)] text-[var(--nevoa-fraca)]">
                {config.heroSubtitulo}
              </p>
            )}
          </div>
        </div>

        {/* Cena 2 — a citação */}
        <div
          ref={cenaCitacaoRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 motion-reduce:relative motion-reduce:min-h-screen motion-reduce:py-16 motion-reduce:opacity-100"
        >
          <div className="relative z-[1] flex max-w-xl flex-col items-center px-6 text-center">
            <Image
              ref={setaRef}
              src="/marca/seta-amarela.png"
              alt=""
              width={2795}
              height={1525}
              className="h-auto w-32 [clip-path:inset(-6%_103%_-6%_-3%)] [filter:drop-shadow(0_6px_16px_rgba(0,0,0,.45))] motion-reduce:[clip-path:none]"
            />
            <p className="mt-6 font-[var(--fonte-citacao)] text-[var(--texto-2xl)] italic text-[var(--nevoa)]">
              &ldquo;
              {config?.heroCitacao ??
                'O caminho não é sobre a chegada, é sobre a transformação.'}
              &rdquo;
            </p>
            <p className="mt-4 font-[var(--fonte-dados)] text-sm uppercase tracking-[0.35em] text-[var(--dourado)]">
              Siga a seta
            </p>
          </div>
        </div>

        {/* Cena 3 — o guia (mesma foto do bloco "Quem guia" mais abaixo) */}
        <div
          ref={cenaGuiaRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 motion-reduce:relative motion-reduce:min-h-screen motion-reduce:py-16 motion-reduce:opacity-100"
        >
          <div className="relative z-[1] flex flex-col items-center px-6 text-center">
            {quemSou?.foto?.asset && (
              <div className="relative aspect-[4/5] w-[min(72vw,300px)] overflow-hidden rounded-[var(--raio-m)] border border-[color-mix(in_srgb,var(--dourado)_35%,transparent)] shadow-[0_20px_60px_rgba(0,0,0,.55)]">
                <Image
                  src={urlDaImagem(quemSou.foto).width(600).height(750).url()}
                  alt={quemSou.foto.alt}
                  fill
                  sizes="300px"
                  placeholder={quemSou.foto.lqip ? 'blur' : undefined}
                  blurDataURL={quemSou.foto.lqip ?? undefined}
                  className="object-cover"
                />
              </div>
            )}
            <Image
              src="/marca/seta-amarela.png"
              alt=""
              width={2795}
              height={1525}
              className="mt-6 h-auto w-9"
            />
            <h2 className="mt-3 font-[var(--fonte-hero)] text-[var(--texto-2xl)] font-semibold text-[var(--nevoa)]">
              Felipe Muniz
            </h2>
            <p className="mt-1 font-[var(--fonte-dados)] text-xs uppercase tracking-[0.28em] text-[var(--dourado)]">
              Guia de peregrinação
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Botao href="/saidas" variante="primario" comSeta>
                Ver próximas saídas
              </Botao>
              {material?.slug && (
                <Botao href={`/materiais/${material.slug}`} variante="secundario">
                  Receber o guia de preparação
                </Botao>
              )}
            </div>
          </div>
        </div>

        <div
          ref={cueRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-6 z-[1] text-center motion-reduce:hidden"
        >
          <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.3em] text-[var(--nevoa-fraca)]">
            Role para continuar
          </p>
          <p className="mt-1 animate-[cuePulse_2.2s_ease-in-out_infinite] text-lg text-[var(--amarelo-seta)]">
            ↓
          </p>
        </div>
      </section>
    </div>
  );
}
