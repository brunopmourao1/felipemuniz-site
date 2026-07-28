import { revalidatePath, revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { NextRequest, NextResponse } from 'next/server';

type Corpo = { _type: string; slug?: { current: string } };

export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<Corpo>(
    req,
    process.env.SANITY_REVALIDATE_SECRET
  );

  if (!isValidSignature) {
    return new NextResponse('Assinatura inválida', { status: 401 });
  }
  if (!body?._type) {
    return new NextResponse('Corpo sem tipo', { status: 400 });
  }

  // Sempre revalida a tag do tipo alterado
  revalidateTag(body._type);

  // E a rota específica, quando houver slug
  const rotas: Record<string, (s: string) => string[]> = {
    saida: (s) => ['/', '/saidas', `/saidas/${s}`],
    post: (s) => ['/blog', `/blog/${s}`, '/preparacao'],
    depoimento: () => ['/', '/depoimentos'],
    faq: () => ['/perguntas-frequentes'],
    configuracao: () => ['/'],
  };

  const alvo = rotas[body._type];
  if (alvo) {
    for (const rota of alvo(body.slug?.current ?? '')) {
      revalidatePath(rota);
    }
  }

  return NextResponse.json({ revalidado: true, tipo: body._type });
}
