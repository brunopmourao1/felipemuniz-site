import { buscar } from '@/sanity/client';
import { CONFIGURACAO, PROXIMAS_SAIDAS } from '@/sanity/queries';
import type { CONFIGURACAO_RESULT, PROXIMAS_SAIDAS_RESULT } from '@/sanity/types';
import { jsonLdOrganizacao } from '@/lib/seo';
import { Cabecalho } from '@/components/layout/Cabecalho';
import { Rodape } from '@/components/layout/Rodape';
import { BotaoWhatsApp } from '@/components/layout/BotaoWhatsApp';

const WHATSAPP_PADRAO = process.env.NEXT_PUBLIC_WHATSAPP ?? '';

export default async function LayoutSite({ children }: { children: React.ReactNode }) {
  const [config, proximas] = await Promise.all([
    buscar<CONFIGURACAO_RESULT>(CONFIGURACAO, {}, ['configuracao']),
    buscar<PROXIMAS_SAIDAS_RESULT>(PROXIMAS_SAIDAS, {}, ['saida']),
  ]);

  const whatsapp = config?.whatsapp ?? WHATSAPP_PADRAO;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganizacao(config)) }}
      />
      <Cabecalho whatsapp={whatsapp} />
      <main className="flex-1">{children}</main>
      <Rodape
        proximasSaidas={proximas
          .slice(0, 3)
          .filter((s): s is typeof s & { titulo: string; slug: string; dataInicio: string } =>
            Boolean(s.titulo && s.slug && s.dataInicio)
          )}
        whatsapp={whatsapp}
        email={config?.email ?? process.env.EMAIL_DESTINO ?? ''}
        instagram={config?.instagram ?? undefined}
      />
      <BotaoWhatsApp numero={whatsapp} />
    </>
  );
}
