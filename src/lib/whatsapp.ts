export function linkDoWhatsapp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemReserva(tituloSaida: string, periodo: string): string {
  return (
    `Olá Felipe! Vi o site e quero reservar minha vaga na saída ` +
    `${tituloSaida} (${periodo}). Pode me passar os detalhes?`
  );
}

export function mensagemGeral(): string {
  return 'Olá Felipe! Vim do site e quero saber mais sobre as saídas do Caminho da Fé.';
}
