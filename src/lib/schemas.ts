import { z } from 'zod';

const whatsappBR = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

export const esquemaLead = z.object({
  nome: z.string().trim().min(2, 'Digite seu nome completo.'),
  email: z.string().trim().email('Digite um e-mail válido.'),
  whatsapp: z.string().trim().regex(whatsappBR, 'Digite o WhatsApp com DDD.'),
  origem: z.string().min(1),
  consentimento: z.literal(true, {
    error: 'É preciso concordar para continuar.',
  }),
  website: z.string().max(0).optional(), // honeypot
});

export const esquemaReserva = esquemaLead.extend({
  saidaId: z.string().min(1),
  saidaTitulo: z.string().min(1),
  mensagem: z.string().trim().max(1000).optional(),
});

export type Lead = z.infer<typeof esquemaLead>;
export type Reserva = z.infer<typeof esquemaReserva>;
