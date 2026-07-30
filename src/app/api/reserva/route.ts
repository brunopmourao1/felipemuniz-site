import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@sanity/client';
import { esquemaReserva } from '@/lib/schemas';

const escritor = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-07-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const janela = new Map<string, number[]>();

function excedeuLimite(ip: string, max = 5, janelaMs = 60_000) {
  const agora = Date.now();
  const registros = (janela.get(ip) ?? []).filter((t) => agora - t < janelaMs);
  registros.push(agora);
  janela.set(ip, registros);
  return registros.length > max;
}

export async function POST(req: NextRequest) {
  // x-vercel-forwarded-for é preenchido pelo edge da Vercel e não pode ser
  // forjado pelo cliente, ao contrário de x-forwarded-for atrás de outro proxy.
  const ip =
    (req.headers.get('x-vercel-forwarded-for') ?? req.headers.get('x-forwarded-for'))
      ?.split(',')[0]
      ?.trim() || 'desconhecido';

  if (excedeuLimite(ip)) {
    return NextResponse.json(
      { erro: 'Muitas tentativas. Aguarde um minuto e tente de novo.' },
      { status: 429 }
    );
  }

  const dados = await req.json();

  // Honeypot: campo invisível que só bot preenche
  if (dados.website) {
    return NextResponse.json({ ok: true }); // silencioso de propósito
  }

  const validacao = esquemaReserva.safeParse(dados);
  if (!validacao.success) {
    return NextResponse.json(
      { erro: 'Confira os campos destacados.', campos: validacao.error.flatten() },
      { status: 400 }
    );
  }

  const { nome, email, whatsapp, origem, consentimento, saidaTitulo, mensagem } = validacao.data;

  try {
    await escritor.create({
      _type: 'lead',
      nome,
      email,
      whatsapp,
      origem,
      saidaInteresse: saidaTitulo,
      mensagem,
      consentimento,
      recebidoEm: new Date().toISOString(),
    });

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_REMETENTE!,
        to: process.env.EMAIL_DESTINO!,
        subject: `Novo pedido de reserva: ${saidaTitulo}`,
        text: `Saída: ${saidaTitulo}\nNome: ${nome}\nWhatsApp: ${whatsapp}\nE-mail: ${email}\nMensagem: ${mensagem ?? '—'}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (erro) {
    console.error('Falha ao registrar reserva', erro);
    return NextResponse.json(
      { erro: 'Não foi possível enviar agora. Tente de novo em instantes.' },
      { status: 500 }
    );
  }
}
