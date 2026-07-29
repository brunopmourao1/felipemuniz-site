import { buscar } from '@/sanity/client';
import { CONFIGURACAO } from '@/sanity/queries';
import type { CONFIGURACAO_RESULT } from '@/sanity/types';
import { Container } from '@/components/ui/Container';

export const revalidate = 3600;

export const metadata = {
  title: 'Política de privacidade',
  description: 'Como os dados enviados pelos formulários deste site são coletados, usados e protegidos.',
};

export default async function PaginaPoliticaDePrivacidade() {
  const config = await buscar<CONFIGURACAO_RESULT>(CONFIGURACAO, {}, ['configuracao']);
  const email = config?.email ?? process.env.EMAIL_DESTINO ?? '';

  return (
    <Container className="py-16">
      <p className="font-[var(--fonte-dados)] text-xs uppercase tracking-[0.15em] text-[var(--dourado)]">
        Política de privacidade
      </p>
      <h1 className="mt-2 max-w-2xl font-[var(--fonte-display)] text-[var(--texto-3xl)] font-extrabold tracking-[-0.02em] text-[var(--nevoa)]">
        Como tratamos seus dados
      </h1>

      <div className="mt-8 max-w-[var(--largura-conteudo)] text-[var(--nevoa)] [&>h2]:mt-8 [&>h2]:font-[var(--fonte-display)] [&>h2]:text-lg [&>h2]:font-bold [&>p]:mt-3 [&>ul]:mt-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mt-1">
        <p>
          Este site é operado por Felipe Muniz, guia do Caminho da Fé. Esta página explica quais
          dados pessoais coletamos pelos formulários do site, para que servem e como você pode
          pedir a exclusão deles.
        </p>

        <h2>Quais dados coletamos</h2>
        <p>
          Quando você preenche um formulário — para receber um material gratuito, reservar uma
          saída ou tirar dúvidas — coletamos nome, WhatsApp e e-mail. Nenhum outro dado pessoal é
          coletado neste site: não usamos cookies de rastreamento, não pedimos CPF, endereço nem
          dados de pagamento.
        </p>

        <h2>Para que usamos</h2>
        <ul>
          <li>Enviar o material solicitado (PDF) por e-mail.</li>
          <li>Responder à sua dúvida ou pedido de reserva pelo WhatsApp.</li>
          <li>Avisar sobre novidades relacionadas à saída ou ao Caminho da Fé, quando você autoriza.</li>
        </ul>
        <p>Seus dados não são vendidos nem compartilhados com terceiros para fins de publicidade.</p>

        <h2>Onde ficam armazenados</h2>
        <p>
          Os dados enviados pelos formulários ficam guardados no Sanity, o sistema de gestão de
          conteúdo deste site, acessível apenas pelo Felipe e por quem ele autorizar. O envio de
          e-mails é feito pela Resend, que processa apenas o necessário para a entrega da
          mensagem.
        </p>

        <h2>Seus direitos</h2>
        <p>
          Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode pedir a qualquer
          momento para saber quais dados seus temos guardados, corrigi-los ou excluí-los
          definitivamente. Basta escrever para{' '}
          {email ? (
            <a href={`mailto:${email}`} className="text-[var(--amarelo-seta)] underline underline-offset-2">
              {email}
            </a>
          ) : (
            'o e-mail de contato do site'
          )}{' '}
          pedindo a exclusão dos seus dados.
        </p>

        <h2>Alterações desta política</h2>
        <p>
          Esta política pode ser atualizada conforme o site evolui. A versão em vigor é sempre a
          publicada nesta página.
        </p>
      </div>
    </Container>
  );
}
