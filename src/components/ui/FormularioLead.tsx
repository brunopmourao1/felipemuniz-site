'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { esquemaLead, type Lead } from '@/lib/schemas';
import { Campo } from '@/components/ui/Campo';
import { Botao } from '@/components/ui/Botao';

export function FormularioLead({
  origem,
  compacto = false,
  textoBotao = 'Quero receber',
}: {
  origem: string;
  compacto?: boolean;
  textoBotao?: string;
}) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Lead>({
    resolver: zodResolver(esquemaLead),
    defaultValues: { origem },
  });

  async function aoEnviar(dados: Lead) {
    setEnviando(true);
    setErroEnvio(null);
    try {
      const resposta = await fetch('/api/lead', {
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
    <form
      onSubmit={handleSubmit(aoEnviar)}
      noValidate
      className={compacto ? 'flex flex-col gap-4 sm:flex-row sm:items-start' : 'flex flex-col gap-4'}
    >
      <input
        type="text"
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input type="hidden" {...register('origem')} />

      <div className={compacto ? 'flex-1' : ''}>
        <Campo label="Nome" id="lead-nome" autoComplete="name" erro={errors.nome?.message} {...register('nome')} />
      </div>
      <div className={compacto ? 'flex-1' : ''}>
        <Campo
          label="WhatsApp"
          id="lead-whatsapp"
          placeholder="(19) 99876-5432"
          autoComplete="tel"
          erro={errors.whatsapp?.message}
          {...register('whatsapp')}
        />
      </div>
      <div className={compacto ? 'flex-1' : ''}>
        <Campo
          label="E-mail"
          id="lead-email"
          type="email"
          autoComplete="email"
          erro={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className={compacto ? 'flex flex-col gap-3 sm:w-auto' : 'flex flex-col gap-3'}>
        <label className="flex items-start gap-2 text-sm text-[var(--nevoa-fraca)]">
          <input type="checkbox" {...register('consentimento')} className="mt-1 min-h-4 min-w-4" />
          Autorizo o Felipe a entrar em contato comigo.
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
          {enviando ? 'Enviando…' : textoBotao}
        </Botao>
      </div>
    </form>
  );
}
