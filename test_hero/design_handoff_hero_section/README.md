# Handoff: Hero Section — Caminho da Fé (site Felipe Muniz)

## Overview
Hero section para a home de https://felipemuniz-site.vercel.app/ — site do guia de peregrinação Felipe Muniz (Caminho da Fé, rumo a Aparecida). Foto de fundo full-bleed da Basílica de Aparecida com zoom lento (Ken Burns), navegação no topo, citação central em serif itálico, seta amarela pintada da marca, CTAs e indicador de scroll.

## About the Design Files
Os arquivos deste pacote são **referências de design em HTML** — protótipos que mostram o visual e o comportamento pretendidos, NÃO código de produção para copiar direto. A tarefa é **recriar este design no ambiente do site existente** (o site atual é Next.js na Vercel, com imagens via Sanity) usando os padrões e componentes já estabelecidos no repositório.

## Fidelity
**High-fidelity (hifi)** — cores, tipografia, espaçamentos e animações são finais. Recriar fielmente, adaptando apenas ao sistema de componentes do codebase (ex.: next/image para a foto, componente de nav já existente).

## Screens / Views

### Hero (única view)
- **Purpose**: Primeira dobra da home; apresenta a marca, a frase de impacto e leva para /saidas e /preparacao.
- **Layout**: `<section>` position relative, width 100%, min-height 100vh, overflow hidden, background #141a14.
  - Camada 1 (fundo): foto cover full-bleed, animação de zoom 1.06 → 1.14 em 22s (ease-out, forwards), transform-origin 50% 35%.
  - Camada 2 (scrim): linear-gradient(180deg, rgba(8,10,8,.72) 0%, rgba(8,10,8,.25) 24%, rgba(8,10,8,.18) 55%, rgba(8,10,8,.72) 100%).
  - Camada 3 (vinheta): radial-gradient(ellipse 120% 90% at 50% 45%, transparent 55%, rgba(10,7,3,.5) 100%).
  - Header: flex space-between, padding 28px 56px, z-index 2.
  - Coluna central: flex column, align center, text-align center, padding "clamp(20px, 8vh, 90px) 24px 130px" (o padding-bottom de 130px reserva espaço para o indicador de scroll em telas baixas).
  - Indicador de scroll: absolute, bottom 22px, centralizado.

## Components

### Header / Nav
- Logo (esquerda): imagem da seta amarela 44px + "Felipe Muniz" em Cormorant Garamond 600, 26px, branco, gap 12px.
- Links (direita, flex gap 36px): Saídas · O Caminho · Preparação · Quem sou — Jost 400, 16px, letter-spacing 0.08em, rgba(255,255,255,.85), hover #fff. Rotas reais do site: /saidas, /o-caminho, /preparacao, /quem-sou.
- CTA WhatsApp: "Falar com o Felipe" — pill (border-radius 999px), background #e8b34b, texto #10100c, Jost 500 16px, padding 11px 24px, hover #f2c96d. Link: https://wa.me/5511953215363 (com o texto pré-preenchido já usado no site).

### Bloco central
- Eyebrow: "CAMINHO DA FÉ · RUMO A APARECIDA" — Jost 500, 15px, letter-spacing 0.5em, rgba(255,255,255,.82).
- H1 (citação): “O caminho não é sobre a chegada, é sobre a transformação.” — Cormorant Garamond itálico 500, font-size clamp(36px, 4.6vw, 68px), line-height 1.16, branco, text-shadow 0 2px 30px rgba(0,0,0,.5), max-width 17em, quebra manual após a vírgula.
- Linha da seta (flex, gap 20px, margin-top clamp(18px,3.4vh,34px)):
  - Seta amarela (assets/seta-amarela.png) width 120px, drop-shadow(0 6px 16px rgba(0,0,0,.45)); anima com wipe da esquerda p/ direita: clip-path inset(-6% 103% -6% -3%) → inset(-6% -3% -6% -3%), 1s ease-out, delay 1s.
  - "SIGA A SETA" — Jost 500, 19px, letter-spacing 0.42em, cor #e8b34b.
- CTAs (flex gap 18px, wrap, margin-top clamp(24px,5vh,52px)):
  - Primário: "Ver próximas saídas →" — pill #e8b34b, texto #10100c, Jost 500 18px, padding 17px 36px, hover #f2c96d. → /saidas
  - Secundário: "Receber o guia de preparação" — pill transparente, border 1px rgba(255,255,255,.45), texto #fff, hover border #fff. → /materiais/checklist-do-peregrino
- Indicador de scroll: "ROLE PARA SEGUIR" Jost 13px, letter-spacing 0.4em, rgba(255,255,255,.75) + seta "↓" 22px #e8b34b pulsando (opacity .45↔1 + translateY 6px, 2.2s ease-in-out infinite).

## Interactions & Behavior
- Entrada (uma vez, on load): elementos fazem fade-up (opacity 0→1 + translateY 26px→0, 0.9s ease-out, fill both) em cascata — eyebrow delay .2s, H1 .45s, linha da seta .7s (wipe da seta em 1s), CTAs .95s, indicador 1.4s.
- Fundo: zoom Ken Burns contínuo de 22s (uma vez, segura no frame final).
- Hovers: descritos acima; sem estados de loading/erro/form.
- Responsivo: tipografia via clamp; CTAs com flex-wrap; paddings verticais com clamp para telas baixas (~550–750px) — nada pode sobrepor o indicador de scroll. Em mobile a nav deve colapsar no padrão já usado pelo site.

## State Management
Nenhum estado — seção estática com animações CSS de entrada. Sem data fetching (a foto pode vir do Sanity como as demais imagens do site).

## Design Tokens
- Cores: âmbar/seta #e8b34b (hover #f2c96d), texto sobre âmbar #10100c, fundo base #141a14 / #0c0a08, branco #fff e rgba(255,255,255,.45/.75/.82/.85), scrim rgba(8,10,8,…), vinheta rgba(10,7,3,.5).
- Tipografia: Cormorant Garamond (500/600, itálico p/ H1) + Jost (300–600). Google Fonts.
- Radius: 999px (pills), demais retos. Sombras: text-shadow do H1 e drop-shadow da seta (acima).
- Espaçamento: header 28px 56px; gaps 12/18/20/36px; margens verticais com clamp (valores acima).

## Assets
- assets/basilica.jpg — foto da Basílica de Aparecida (Pexels, Thiago Cruz — manter crédito conforme licença Pexels). No site real, servir via Sanity/next-image.
- assets/seta-amarela.png — seta amarela pintada (marca Seta Amarela), PNG com transparência, fornecida pelo cliente.
- image-slot.js — utilitário do protótipo (placeholder de imagem); NÃO portar para produção, usar <Image> do Next.

## Files
- Hero Section.dc.html — o protótipo hifi (abrir no navegador). O markup relevante está dentro de <x-dc>…</x-dc>; estilos são inline + keyframes no topo.
- assets/ — imagens usadas.
