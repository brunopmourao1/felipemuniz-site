'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlDaImagem } from '@/sanity/image';
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
  const fotoGuiaRef = useRef<HTMLDivElement>(null);
  const fotoGuiaDesfocadaRef = useRef<HTMLImageElement>(null);
  const setaRef = useRef<HTMLImageElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const cenaLugar = cenaLugarRef.current;
    const cenaCitacao = cenaCitacaoRef.current;
    const cenaGuia = cenaGuiaRef.current;
    // Foto-foco da cena 3 é opcional: só existe quando quemSou.foto vem preenchido.
    const fotoGuia = fotoGuiaRef.current;
    const fotoGuiaDesfocada = fotoGuiaDesfocadaRef.current;
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

      // Foco: a camada borrada sobre o retrato (pré-calculada em CSS) some
      // por opacidade conforme a cena entra em foco — trocar opacidade é
      // praticamente de graça, animar o raio do blur a cada frame não é.
      if (fotoGuiaDesfocada) fotoGuiaDesfocada.style.opacity = String(1 - op2);
      if (fotoGuia) fotoGuia.style.transform = `scale(${1.05 - 0.05 * op2})`;

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
        className="sticky top-0 h-screen overflow-hidden bg-[var(--hero-fundo-escuro)] motion-reduce:relative motion-reduce:h-auto"
      >
        {/* Cena 1 — o lugar */}
        <div
          ref={cenaLugarRef}
          className="absolute inset-0 flex items-center justify-center motion-reduce:relative motion-reduce:min-h-screen motion-reduce:py-16"
        >
          {config?.heroImagem?.asset && (
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
              <Image
                src={urlDaImagem(config.heroImagem).width(2560).url()}
                alt={config.heroImagem.alt}
                fill
                priority
                fetchPriority="high"
                quality={95}
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
                'linear-gradient(180deg, rgba(8,10,8,.58) 0%, rgba(8,10,8,.18) 32%, rgba(8,10,8,.3) 58%, rgba(8,10,8,.8) 100%), radial-gradient(ellipse 120% 90% at 50% 45%, transparent 50%, rgba(10,7,3,.5) 100%)',
            }}
          />
          <div className="relative z-[1] flex flex-col items-center px-6 text-center">
            <p className="animate-[fadeUp_.9s_ease-out_.15s_both] pl-[0.55em] [font-family:var(--fonte-hero-corpo)] text-sm font-medium tracking-[0.55em] text-white/75">
              Peregrinação
            </p>
            <h1 className="animate-[fadeUp_1s_ease-out_.35s_both] mt-5 max-w-3xl [font-family:var(--fonte-hero)] text-[clamp(36px,6vw,72px)] font-semibold tracking-[0.06em] text-white [text-shadow:0_2px_40px_rgba(0,0,0,.5)]">
              {config?.heroTitulo ?? 'Caminhe o Caminho da Fé com quem conhece cada passo'}
            </h1>
            <div
              aria-hidden="true"
              className="animate-[fadeUp_.9s_ease-out_.6s_both] mt-6 h-px w-[46px] bg-[var(--hero-ambar)]"
            />
            {config?.heroSubtitulo && (
              <p className="animate-[fadeUp_.9s_ease-out_.55s_both] mt-6 max-w-xl [font-family:var(--fonte-hero-corpo)] text-[var(--texto-lg)] text-white/80">
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
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 42%, color-mix(in srgb, var(--hero-ambar) 10%, transparent) 0%, transparent 65%), var(--hero-fundo-escuro)',
            }}
          />
          <div className="relative z-[1] flex max-w-xl flex-col items-center px-6 text-center">
            <Image
              ref={setaRef}
              src="/marca/seta-amarela.png"
              alt=""
              width={2795}
              height={1525}
              className="h-auto w-[130px] [clip-path:inset(-6%_103%_-6%_-3%)] [filter:drop-shadow(var(--sombra-m))] motion-reduce:[clip-path:none]"
            />
            <p className="mt-[28px] max-w-[15em] [font-family:var(--fonte-hero)] text-[clamp(24px,3.6vw,38px)] font-medium italic leading-[1.3] text-white">
              &ldquo;
              {config?.heroCitacao ??
                'O caminho não é sobre a chegada, é sobre a transformação.'}
              &rdquo;
            </p>
            <p className="mt-[22px] pl-[0.42em] [font-family:var(--fonte-hero-corpo)] text-[15px] font-medium tracking-[0.42em] text-[var(--hero-ambar)]">
              Siga a seta
            </p>
          </div>
        </div>

        {/* Cena 3 — o guia (mesma foto do bloco "Quem guia" mais abaixo) */}
        <div
          ref={cenaGuiaRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 motion-reduce:relative motion-reduce:min-h-screen motion-reduce:py-16 motion-reduce:opacity-100"
        >
          {quemSou?.foto?.asset && (
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
              <Image
                src={urlDaImagem(quemSou.foto).width(1200).height(1200).url()}
                alt=""
                fill
                sizes="100vw"
                className="scale-[1.15] object-cover [filter:blur(38px)_brightness(.4)_saturate(1.1)] motion-reduce:scale-100 motion-reduce:[filter:blur(24px)_brightness(.4)]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(8,10,8,.55) 0%, rgba(8,10,8,.75) 100%)',
                }}
              />
            </div>
          )}
          <div className="relative z-[1] flex flex-col items-center px-6 text-center">
            {quemSou?.foto?.asset && (
              <div
                ref={fotoGuiaRef}
                className="relative aspect-[4/5] w-[min(72vw,300px)] overflow-hidden rounded-[6px] border border-[color-mix(in_srgb,var(--hero-ambar)_35%,transparent)] shadow-[var(--sombra-g)]"
              >
                <Image
                  src={urlDaImagem(quemSou.foto).width(600).height(750).url()}
                  alt={quemSou.foto.alt}
                  fill
                  sizes="300px"
                  placeholder={quemSou.foto.lqip ? 'blur' : undefined}
                  blurDataURL={quemSou.foto.lqip ?? undefined}
                  className="object-cover"
                />
                <Image
                  ref={fotoGuiaDesfocadaRef}
                  src={urlDaImagem(quemSou.foto).width(600).height(750).url()}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="300px"
                  className="scale-[1.15] object-cover [filter:blur(16px)_saturate(1.05)] motion-reduce:hidden"
                />
              </div>
            )}
            <Image
              src="/marca/seta-amarela.png"
              alt=""
              width={2795}
              height={1525}
              className="mt-[26px] h-auto w-[34px]"
            />
            <h2 className="mt-[14px] [font-family:var(--fonte-hero)] text-[clamp(26px,3.4vw,34px)] font-semibold text-white">
              Felipe Muniz
            </h2>
            <p className="mt-1 pl-[0.28em] [font-family:var(--fonte-hero-corpo)] text-xs font-medium tracking-[0.28em] text-[var(--hero-ambar)]">
              Guia de peregrinação
            </p>
            <div className="mt-[30px] flex flex-wrap justify-center gap-[14px]">
              <Link
                href="/saidas"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--hero-ambar)] px-[30px] py-[14px] [font-family:var(--fonte-hero-corpo)] text-base font-medium tracking-[0.03em] text-[var(--hero-sobre-ambar)] transition-colors duration-150 hover:bg-[var(--hero-ambar-hover)]"
              >
                Ver próximas saídas
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              {material?.slug && (
                <Link
                  href={`/materiais/${material.slug}`}
                  className="rounded-full border border-white/45 px-[30px] py-[14px] [font-family:var(--fonte-hero-corpo)] text-base font-normal tracking-[0.03em] text-white transition-colors duration-150 hover:border-white"
                >
                  Receber o guia de preparação
                </Link>
              )}
            </div>
          </div>
        </div>

        <div
          ref={cueRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-6 z-[1] text-center motion-reduce:hidden"
        >
          <p className="pl-[0.4em] [font-family:var(--fonte-hero-corpo)] text-xs font-medium tracking-[0.4em] text-white/65">
            Role para continuar
          </p>
          <p className="mt-1 animate-[cuePulse_2.2s_ease-in-out_infinite] text-[20px] text-[var(--hero-ambar)]">
            ↓
          </p>
        </div>
      </section>
    </div>
  );
}
