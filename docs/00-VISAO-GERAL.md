# Site Felipe Muniz — Guia do Caminho da Fé
## Documentação técnica de construção

**Cliente:** Felipe Muniz (@cf_comfelipemuniz)
**Executor:** Bruno Mourão
**Natureza:** projeto-presente, sem custo para o cliente
**Data:** julho/2026
**Versão do documento:** 1.0

---

## 1. Resumo executivo

Felipe Muniz é guia do Caminho da Fé — a rota de peregrinação de ~500 km entre Águas da Prata (SP) e Aparecida (SP). Ele conduz grupos em saídas com datas fixas e vagas limitadas.

Hoje toda a operação comercial dele vive dentro do Instagram: a agenda é publicada como card, a venda acontece no direct, e não existe nenhum ponto de captura ou de conversão fora da rede social. O resultado é que ele produz conteúdo de qualidade alta e converte pouco, porque não tem para onde levar quem se interessa.

Este projeto entrega uma base própria: um site institucional e comercial, com CMS headless, onde o Felipe publica e atualiza tudo sozinho — sem depender do Bruno depois da entrega.

### O que o site precisa resolver, em ordem de prioridade

1. **Vender as saídas.** Cada saída vira uma página própria com data, ramal, roteiro dia a dia, vagas, valor, o que está incluso e um caminho de reserva sem atrito.
2. **Capturar quem ainda não vai comprar.** O peregrino pesquisa meses antes de decidir. O site troca material útil (checklist, manual de preparação) por contato.
3. **Aparecer no Google.** As saídas são sazonais (setembro, novembro). O conteúdo utilitário que o Felipe já produz precisa gerar tráfego o ano inteiro.
4. **Concentrar a prova social.** Depoimentos e fotos de grupo hoje se perdem no feed. No site eles ficam permanentes e ligados à saída correspondente.
5. **Reduzir trabalho manual.** Grupo confirmado recebe uma página com roteiro, pousadas e orientações — o que hoje é respondido um a um no WhatsApp.

### Restrições de projeto

| Restrição | Decisão |
|---|---|
| O Felipe não é técnico | Toda edição no Sanity Studio, em português, com campos guiados e pré-visualização |
| Custo recorrente para o cliente | Apenas o domínio (~R$ 40/ano no Registro.br). Todo o resto em camada gratuita |
| Manutenção pelo Bruno | Deve tender a zero após a entrega. Sem servidor, sem banco, sem atualização de plugin |
| Identidade visual | Já existe e é forte. O site respeita e estende a marca do Felipe — não é um rebrand |
| Prazo | Sem prazo contratual. Roadmap sugerido em 4 fases |

---

## 2. Índice do pacote

| # | Documento | Para quem |
|---|---|---|
| 00 | **Visão geral** (este) | Bruno + Felipe |
| 01 | Escopo e requisitos funcionais | Bruno |
| 02 | Arquitetura de informação e mapa de páginas | Bruno |
| 03 | Stack, arquitetura técnica e infraestrutura | Bruno |
| 04 | Design system e direção visual | Bruno |
| 05 | Schemas do Sanity (código pronto) | Bruno |
| 06 | Queries GROQ e camada de dados | Bruno |
| 07 | SEO, performance e conteúdo | Bruno |
| 08 | Manual do editor | **Felipe** |
| 09 | Setup passo a passo e roadmap | Bruno |

---

## 3. Decisões arquiteturais já tomadas

Estas decisões estão fechadas na v1 e justificadas no documento 03. Registradas aqui para não serem reabertas sem motivo.

**Next.js 15 (App Router) + TypeScript + Tailwind CSS v4.**
Renderização estática com revalidação sob demanda. Entrega HTML pronto para o Google, custo de execução próximo de zero, e o Bruno já trabalha com JavaScript.

**Sanity v3, Studio embutido em `/studio`.**
O Felipe acessa `felipemuniz.com.br/studio`, faz login com Google e edita. Não precisa instalar nada, não precisa de um segundo endereço, não precisa lembrar de outra senha.

**Vercel, plano Hobby.**
Deploy automático a cada commit. HTTPS, CDN global e domínio custom inclusos. Zero configuração de servidor.

**Sem checkout online na v1.**
A reserva é feita por formulário + link direto de WhatsApp com mensagem pré-preenchida. Motivo: um gateway de pagamento traz taxa, obrigação fiscal e antecipação de recebimento que o Felipe não pediu e pode não querer. A arquitetura deixa o caminho aberto para plugar Mercado Pago ou Asaas na v2 sem refatorar.

**Sem área logada na v1.**
A "área do grupo" é uma página com URL não listada (slug com sufixo aleatório), acessível por link enviado no WhatsApp do grupo. Resolve 100% da necessidade real sem construir autenticação.

---

## 4. Custo total de operação

| Item | Plano | Custo/mês |
|---|---|---|
| Domínio `.com.br` | Registro.br | ~R$ 3,30 (R$ 40/ano) |
| Hospedagem | Vercel Hobby | R$ 0 |
| CMS | Sanity Free | R$ 0 |
| E-mail transacional | Resend Free (3.000/mês) | R$ 0 |
| Analytics | Vercel Web Analytics | R$ 0 |
| **Total** | | **~R$ 3,30/mês** |

Limites da camada gratuita, com folga confortável para o porte da operação: Vercel entrega 100 GB de banda por mês; Sanity permite 10.000 documentos e 3 usuários; Resend cobre 3.000 e-mails mensais. Um site desse tamanho com tráfego de nicho não chega perto desses tetos.

**Ponto de atenção:** a Vercel Hobby é para uso não comercial. Um site de guia de peregrinação que vende saídas é uso comercial. Na prática a Vercel raramente age contra projetos desse porte, mas a alternativa limpa e igualmente gratuita é **Cloudflare Pages**, que não faz essa distinção. O documento 03 traz as duas configurações.

---

## 5. O que este pacote não cobre

- Produção de fotos e vídeo. O Felipe já tem acervo próprio.
- Redação do conteúdo final. O documento 07 traz a pauta e a estrutura; o texto sai dele.
- Gestão de tráfego pago.
- Emissão de nota fiscal, contrato de prestação de serviço ou seguro dos peregrinos.
- Integração com o site da Associação dos Amigos do Caminho da Fé.

---

## 6. Observação sobre o ecossistema

O site oficial `caminhodafe.com.br` roda WordPress e apresenta injeção de links de spam no rodapé (cassino e apostas), sinal clássico de plugin comprometido. Isso não afeta o projeto do Felipe, mas tem duas implicações:

1. Vale confirmar se o Felipe está listado na página **Operadores Credenciados** da associação. É uma fonte de tráfego qualificado e gratuito, com autoridade de domínio.
2. Um backlink vindo de um domínio com spam injetado tem valor de SEO reduzido. Não é motivo para recusar o link, mas não conte com ele como alavanca principal.
