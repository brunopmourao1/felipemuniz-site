'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { esquemaReserva, type Reserva } from '@/lib/schemas';
import { Campo } from '@/components/ui/Campo';
import { Botao } from '@/components/ui/Botao';

export function FormularioReserva({ saidaId, saidaTitulo }: { saidaId: string; saidaTitulo: string }) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Reserva>({
    resolver: zodResolver(esquemaReserva),
    defaultValues: { origem: 'reserva', saidaId, saidaTitulo },
  });

  async function aoEnviar(dados: Reserva) {
    setEnviando(true);
    setErroEnvio(null);
    try {
      const resposta = await fetch('/api/reserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => null);
        throw new Error(corpo?.erro ?? 'Não foi possível enviar agora. Tente de novo em instantes.');
      }
      router.push('/obrigado');
    } catch (erro) {
      setErroEnvio(erro instanceof Error ? erro.message : 'Não foi possível enviar agora.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(aoEnviar)} noValidate className="flex flex-col gap-4">
      <input
        type="text"
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input type="hidden" {...register('origem')} />
      <input type="hidden" {...register('saidaId')} />
      <input type="hidden" {...register('saidaTitulo')} />

      <Campo label="Nome" id="reserva-nome" autoComplete="name" erro={errors.nome?.message} {...register('nome')} />
      <Campo
        label="WhatsApp"
        id="reserva-whatsapp"
        placeholder="(19) 99876-5432"
        autoComplete="tel"
        erro={errors.whatsapp?.message}
        {...register('whatsapp')}
      />
      <Campo label="E-mail" id="reserva-email" type="email" autoComplete="email" erro={errors.email?.message} {...register('email')} />
      <Campo
        as="textarea"
        label="Mensagem (opcional)"
        id="reserva-mensagem"
        rows={3}
        erro={errors.mensagem?.message}
        {...register('mensagem')}
      />

      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-2 text-sm text-[var(--nevoa-fraca)]">
          <input type="checkbox" {...register('consentimento')} className="mt-1 min-h-4 min-w-4" />
          Autorizo o Felipe a entrar em contato comigo sobre esta saída. Li a{' '}
          <Link href="/politica-de-privacidade" className="underline hover:text-[var(--amarelo-seta)]">
            política de privacidade
          </Link>
          .
        </label>
        {errors.consentimento && (
          <p role="alert" className="text-sm text-[var(--erro)]">
            {errors.consentimento.message}
          </p>
        )}

        {erroEnvio && (
          <p role="alert" className="text-sm text-[var(--erro)]">
            {erroEnvio}
          </p>
        )}

        <Botao type="submit" variante="primario" comSeta disabled={enviando}>
          {enviando ? 'Enviando…' : `Reservar vaga em ${saidaTitulo}`}
        </Botao>
      </div>
    </form>
  );
}
