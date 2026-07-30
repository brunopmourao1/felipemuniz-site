import { buscar } from '@/sanity/client';
import { CONFIGURACAO } from '@/sanity/queries';
import type { CONFIGURACAO_RESULT } from '@/sanity/types';
import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';
import { FormularioLead } from '@/components/ui/FormularioLead';
import { linkDoWhatsapp, mensagemGeral } from '@/lib/whatsapp';

export const revalidate = 3600;

export const metadata = {
  title: 'Contato',
  description: 'Fale com o Felipe Muniz pelo WhatsApp, e-mail ou Instagram.',
};

export default async function PaginaContato() {
  const config = await buscar<CONFIGURACAO_RESULT>(CONFIGURACAO, {}, ['configuracao']);
  const whatsapp = config?.whatsapp ?? process.env.NEXT_PUBLIC_WHATSAPP ?? '';
  const email = config?.email ?? process.env.EMAIL_DESTINO ?? '';

  return (
    <Container className="py-16">
      <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Contato
      </p>
      <h1 className="mt-2 max-w-2xl [font-family:var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        Fale com o Felipe
      </h1>
      <p className="mt-4 max-w-[var(--largura-conteudo)] text-[var(--nevoa-fraca)]">
        A forma mais rápida de tirar dúvidas sobre uma saída é pelo WhatsApp. Se preferir, deixe
        seu contato abaixo e o Felipe responde por e-mail.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div>
            <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.1em] text-[var(--dourado)]">
              WhatsApp
            </p>
            <div className="mt-3">
              <Botao href={linkDoWhatsapp(whatsapp, mensagemGeral())} variante="primario" comSeta>
                Chamar no WhatsApp
              </Botao>
            </div>
          </div>

          {email && (
            <div>
              <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.1em] text-[var(--dourado)]">
                E-mail
              </p>
              <a href={`mailto:${email}`} className="mt-2 block text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]">
                {email}
              </a>
            </div>
          )}

          {config?.instagram && (
            <div>
              <p className="[font-family:var(--fonte-dados)] text-xs uppercase tracking-[0.1em] text-[var(--dourado)]">
                Instagram
              </p>
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-[var(--nevoa)] hover:text-[var(--amarelo-seta)]"
              >
                {config.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')}
              </a>
            </div>
          )}
        </div>

        <div className="rounded-[var(--raio-m)] bg-[var(--azul-noite)] p-8">
          <h2 className="[font-family:var(--fonte-display)] text-lg font-bold text-[var(--nevoa)]">
            Prefere e-mail? Deixe seu contato
          </h2>
          <div className="mt-6">
            <FormularioLead origem="contato" textoBotao="Enviar" />
          </div>
        </div>
      </div>
    </Container>
  );
}
