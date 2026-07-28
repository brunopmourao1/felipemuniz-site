export type StatusSaida = 'aberta' | 'ultimas' | 'esgotada' | 'realizada';

const LIMITE_ULTIMAS = 0.3;

export function statusDaSaida(saida: {
  dataFim: string;
  vagasTotal: number;
  vagasDisponiveis: number;
}): StatusSaida {
  if (new Date(saida.dataFim) < new Date()) return 'realizada';
  if (saida.vagasDisponiveis <= 0) return 'esgotada';
  if (saida.vagasDisponiveis <= Math.ceil(saida.vagasTotal * LIMITE_ULTIMAS)) {
    return 'ultimas';
  }
  return 'aberta';
}

export const rotuloDoStatus: Record<StatusSaida, string> = {
  aberta: 'Vagas abertas',
  ultimas: 'Últimas vagas',
  esgotada: 'Esgotada',
  realizada: 'Realizada',
};

export function textoDoBotao(status: StatusSaida): string {
  switch (status) {
    case 'aberta':
    case 'ultimas':
      return 'Quero reservar';
    case 'esgotada':
      return 'Entrar na lista de espera';
    case 'realizada':
      return 'Ver a próxima data';
  }
}
