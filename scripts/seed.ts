import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-07-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

/** Baixa uma imagem do picsum e sobe como asset do Sanity. */
async function subirImagem(semente: string, rotulo: string) {
  const url = `https://picsum.photos/seed/${semente}/1600/1067`;
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Falha ao baixar imagem ${semente}`);
  const buffer = Buffer.from(await resposta.arrayBuffer());
  const asset = await client.assets.upload('image', buffer, {
    filename: `seed-${semente}.jpg`,
  });
  console.log(`  imagem ${rotulo}`);
  return {
    _type: 'imagemComAlt',
    asset: { _type: 'reference', _ref: asset._id },
    alt: `[EXEMPLO] ${rotulo}`,
  };
}

const ramais = [
  { id: 'seed.ramal.aguas-da-prata', nome: 'Ramal Principal — Águas da Prata',
    slug: 'aguas-da-prata', cidadeInicio: 'Águas da Prata — SP',
    km: 415, diasSugeridos: 13, dificuldade: 'moderado' },
  { id: 'seed.ramal.paraisopolis', nome: 'Ramal de Paraisópolis',
    slug: 'paraisopolis', cidadeInicio: 'Paraisópolis — MG',
    km: 240, diasSugeridos: 8, dificuldade: 'leve' },
  { id: 'seed.ramal.estiva', nome: 'Ramal de Estiva',
    slug: 'estiva', cidadeInicio: 'Estiva — MG',
    km: 280, diasSugeridos: 9, dificuldade: 'moderado' },
  { id: 'seed.ramal.luminosa', nome: 'Ramal da Luminosa',
    slug: 'ramal-da-luminosa', cidadeInicio: 'Águas da Prata — SP',
    km: 430, diasSugeridos: 14, dificuldade: 'exigente' },
];

function gerarRoteiro(dias: number, cidade: string) {
  const destinos = [
    'Andradas', 'Ipuiúna', 'Borda da Mata', 'Congonhal', 'Pouso Alegre',
    'Cachoeira de Minas', 'Cambuí', 'Bueno Brandão', 'Munhoz',
    'Toledo', 'Bragança Paulista', 'Atibaia', 'Aparecida',
  ];
  let anterior = cidade.split(' — ')[0];
  return Array.from({ length: dias }, (_, i) => {
    const destino = destinos[i % destinos.length];
    const trecho = `${anterior} → ${destino}`;
    anterior = destino;
    return {
      _key: `dia-${i + 1}`,
      dia: i + 1,
      trecho,
      km: [18, 22, 26, 20, 24, 19, 28, 23][i % 8],
      altimetria: [420, 680, 950, 310, 780, 540, 1120, 660][i % 8],
      pousada: `[EXEMPLO] Pousada em ${destino}`,
      descricao:
        `[EXEMPLO] Descrição do dia ${i + 1}. Substituir pelo relato real do ` +
        `Felipe sobre o terreno, o que se vê e o que exige. Ser honesto sobre a dificuldade.`,
    };
  });
}

const saidas = [
  { id: 'seed.saida.setembro-2026', titulo: '[EXEMPLO] Saída de Setembro',
    slug: 'aguas-da-prata-set-2026', ramal: 'seed.ramal.aguas-da-prata',
    inicio: '2026-09-04', fim: '2026-09-16', cidade: 'Águas da Prata — SP',
    km: 415, nivel: 'moderado', dias: 13,
    vagasTotal: 14, vagasDisponiveis: 4, destaque: true,
    valor: '[EXEMPLO] R$ 0.000 · em até 6x' },
  { id: 'seed.saida.novembro-2026', titulo: '[EXEMPLO] Saída de Novembro',
    slug: 'paraisopolis-nov-2026', ramal: 'seed.ramal.paraisopolis',
    inicio: '2026-11-18', fim: '2026-11-23', cidade: 'Paraisópolis — MG',
    km: 240, nivel: 'leve', dias: 6,
    vagasTotal: 12, vagasDisponiveis: 12, destaque: false,
    valor: '[EXEMPLO] R$ 0.000 · em até 6x' },
  { id: 'seed.saida.estiva-2026', titulo: '[EXEMPLO] Saída de Estiva',
    slug: 'estiva-set-2026', ramal: 'seed.ramal.estiva',
    inicio: '2026-09-09', fim: '2026-09-16', cidade: 'Estiva — MG',
    km: 280, nivel: 'moderado', dias: 8,
    vagasTotal: 10, vagasDisponiveis: 0, destaque: false,
    valor: '[EXEMPLO] R$ 0.000 · em até 6x' },
  { id: 'seed.saida.maio-2026', titulo: '[EXEMPLO] Saída de Maio',
    slug: 'aguas-da-prata-mai-2026', ramal: 'seed.ramal.aguas-da-prata',
    inicio: '2026-05-10', fim: '2026-05-22', cidade: 'Águas da Prata — SP',
    km: 415, nivel: 'moderado', dias: 13,
    vagasTotal: 12, vagasDisponiveis: 0, destaque: false,
    valor: '[EXEMPLO] R$ 0.000' },
];

const depoimentos = [
  ['Maria Aparecida', 'Campinas — SP', 'seed.saida.maio-2026'],
  ['João Batista',    'Santos — SP',   'seed.saida.maio-2026'],
  ['Ana Lúcia',       'Belo Horizonte — MG', 'seed.saida.maio-2026'],
  ['Pedro Henrique',  'São Paulo — SP', 'seed.saida.maio-2026'],
  ['Lúcia Helena',    'Ribeirão Preto — SP', 'seed.saida.maio-2026'],
  ['Roberto Carlos',  'Poços de Caldas — MG', 'seed.saida.maio-2026'],
  ['Sandra Regina',   'Sorocaba — SP', 'seed.saida.maio-2026'],
  ['Antônio Sérgio',  'Uberlândia — MG', 'seed.saida.maio-2026'],
  ['Vera Lúcia',      'Jundiaí — SP',  'seed.saida.maio-2026'],
  ['Marcos Vinícius', 'Pouso Alegre — MG', 'seed.saida.maio-2026'],
];

const perguntas = [
  ['decisao',     'Preciso ser católico para fazer o Caminho da Fé?', 1, true],
  ['decisao',     'Dá para fazer o Caminho sozinho ou é melhor em grupo?', 2, true],
  ['fisico',      'Que preparo físico eu preciso ter?', 3, true],
  ['equipamento', 'O que eu levo na mochila?', 4, true],
  ['valores',     'O que está incluso no valor?', 5, true],
  ['caminho',     'Como funciona a credencial e os carimbos?', 6, false],
  ['caminho',     'E se eu não conseguir acompanhar o grupo?', 7, false],
  ['fisico',      'Qual a melhor época do ano para caminhar?', 8, false],
  ['equipamento', 'Preciso de bota específica?', 9, false],
  ['valores',     'Como funciona o pagamento?', 10, false],
];

const posts = [
  ['O que levar no Caminho da Fé', 'o-que-levar-no-caminho-da-fe', 'preparacao'],
  ['Quantos dias leva o Caminho da Fé', 'quantos-dias-leva-o-caminho-da-fe', 'preparacao'],
  ['Qual ramal escolher', 'qual-ramal-do-caminho-da-fe-escolher', 'roteiros'],
  ['Dá para fazer o Caminho sozinho?', 'caminho-da-fe-sozinho', 'preparacao'],
  ['A credencial e os carimbos', 'credencial-e-carimbos', 'espiritualidade'],
];

function paragrafo(texto: string) {
  return {
    _type: 'block', _key: Math.random().toString(36).slice(2, 10),
    style: 'normal',
    children: [{ _type: 'span', _key: 'sp', text: texto, marks: [] }],
    markDefs: [],
  };
}

async function semear() {
  console.log('Semeando dataset...\n');
  const documentos: any[] = [];

  // ── Ramais ─────────────────────────────────────────
  console.log('Ramais');
  for (const r of ramais) {
    documentos.push({
      _id: r.id, _type: 'ramal',
      nome: r.nome,
      slug: { _type: 'slug', current: r.slug },
      cidadeInicio: r.cidadeInicio,
      km: r.km, diasSugeridos: r.diasSugeridos, dificuldade: r.dificuldade,
      descricao: [paragrafo(`[EXEMPLO] Descrição do ${r.nome}. Substituir pelo texto do Felipe.`)],
      imagem: await subirImagem(`ramal-${r.slug}`, `Paisagem do ${r.nome}`),
    });
  }

  // ── Saídas ─────────────────────────────────────────
  console.log('Saídas');
  for (const s of saidas) {
    const galeria = await Promise.all(
      [1, 2, 3, 4].map((n) =>
        subirImagem(`${s.slug}-g${n}`, `Foto ${n} da ${s.titulo}`)
      )
    );
    documentos.push({
      _id: s.id, _type: 'saida',
      titulo: s.titulo,
      slug: { _type: 'slug', current: s.slug },
      slugGrupo: { _type: 'slug', current: `${s.slug}-${Math.random().toString(36).slice(2, 8)}` },
      ramal: { _type: 'reference', _ref: s.ramal },
      dataInicio: s.inicio, dataFim: s.fim,
      cidadeSaida: s.cidade,
      resumo: `[EXEMPLO] Resumo da ${s.titulo}. Duas ou três linhas sobre o que essa saída tem de particular.`,
      distanciaKm: s.km, nivel: s.nivel,
      roteiro: gerarRoteiro(s.dias, s.cidade),
      vagasTotal: s.vagasTotal, vagasDisponiveis: s.vagasDisponiveis,
      valor: s.valor, destaque: s.destaque,
      incluso: ['[EXEMPLO] Guia credenciado', '[EXEMPLO] Hospedagem', '[EXEMPLO] Café da manhã', '[EXEMPLO] Transporte de bagagem', '[EXEMPLO] Apoio de veículo'],
      naoIncluso: ['[EXEMPLO] Passagem até a cidade de saída', '[EXEMPLO] Almoço e jantar', '[EXEMPLO] Seguro individual'],
      imagemCapa: await subirImagem(`${s.slug}-capa`, `Capa da ${s.titulo}`),
      galeria,
      orientacoesGrupo: [paragrafo('[EXEMPLO] Orientações que só o grupo confirmado vê.')],
    });
  }

  // ── Depoimentos ────────────────────────────────────
  console.log('Depoimentos');
  for (const [i, [nome, cidade, saida]] of depoimentos.entries()) {
    documentos.push({
      _id: `seed.depoimento.${i + 1}`, _type: 'depoimento',
      nome: `[EXEMPLO] ${nome}`,
      cidade,
      saida: { _type: 'reference', _ref: saida },
      texto:
        `[EXEMPLO] Depoimento de ${nome}. Substituir pelo texto real do peregrino, ` +
        `sem corrigir demais — texto de gente real precisa soar como gente real. ` +
        `Pedir autorização antes de publicar com nome e cidade.`,
      foto: await subirImagem(`retrato-${i + 1}`, `Retrato de ${nome}`),
      publicado: true,
      destaque: i < 5,
    });
  }

  // ── FAQ ────────────────────────────────────────────
  console.log('Perguntas frequentes');
  perguntas.forEach(([categoria, pergunta, ordem, naHome], i) => {
    documentos.push({
      _id: `seed.faq.${i + 1}`, _type: 'faq',
      pergunta: pergunta as string,
      resposta: [paragrafo('[EXEMPLO] Resposta a escrever com o Felipe.')],
      categoria, ordem, naHome,
    });
  });

  // ── Posts ──────────────────────────────────────────
  console.log('Posts');
  for (const [i, [titulo, slug, categoria]] of posts.entries()) {
    documentos.push({
      _id: `seed.post.${i + 1}`, _type: 'post',
      titulo: `[EXEMPLO] ${titulo}`,
      slug: { _type: 'slug', current: slug },
      categoria,
      resumo: `[EXEMPLO] Resumo de "${titulo}". Duas linhas, aparece na lista e no Google.`,
      capa: await subirImagem(`post-${slug}`, `Capa de ${titulo}`),
      publicadoEm: new Date(Date.now() - i * 7 * 86_400_000).toISOString(),
      corpo: [
        paragrafo(`[EXEMPLO] Primeiro parágrafo de "${titulo}".`),
        { _type: 'block', _key: 'h2a', style: 'h2', markDefs: [],
          children: [{ _type: 'span', _key: 's', text: '[EXEMPLO] Um subtítulo', marks: [] }] },
        paragrafo('[EXEMPLO] Mais texto. Substituir pelo artigo real conforme a pauta do documento 07.'),
      ],
    });
  }

  // ── Material de captura ────────────────────────────
  console.log('Material');
  documentos.push({
    _id: 'seed.material.checklist', _type: 'material',
    titulo: '[EXEMPLO] Checklist do Peregrino',
    slug: { _type: 'slug', current: 'checklist-do-peregrino' },
    promessa: '[EXEMPLO] A lista completa do que levar, item por item, com o peso de cada um.',
    topicos: ['[EXEMPLO] Mochila', '[EXEMPLO] Calçado', '[EXEMPLO] Documentos', '[EXEMPLO] Primeiros socorros'],
    capa: await subirImagem('material-checklist', 'Capa do checklist'),
    ativo: true,
    // arquivo: subir um PDF de exemplo manualmente pelo Studio
  });

  // ── Singletons ─────────────────────────────────────
  console.log('Configurações');
  documentos.push({
    _id: 'configuracao', _type: 'configuracao',
    whatsapp: '5511953215363',
    email: 'bruno.pmourao1@gmail.com',
    instagram: 'https://www.instagram.com/cf_comfelipemuniz/',
    heroTitulo: '[EXEMPLO] Caminhe o Caminho da Fé com quem conhece cada passo',
    heroSubtitulo: '[EXEMPLO] Grupos guiados com segurança, acolhimento e experiência.',
    heroImagem: await subirImagem('hero', 'Grupo de peregrinos caminhando ao amanhecer'),
    peregrinosGuiados: 247,
    saidasRealizadas: 18,
    anoInicio: 2019,
  });

  documentos.push({
    _id: 'quemSou', _type: 'quemSou',
    titulo: 'Quem caminha com você',
    foto: await subirImagem('felipe', 'Retrato do guia'),
    historia: [
      paragrafo('[EXEMPLO] Primeiro parágrafo da história do Felipe.'),
      paragrafo('[EXEMPLO] Por que ele guia. É a página que decide a confiança de quem vai contratar — o texto real precisa vir dele.'),
    ],
    credenciais: ['[EXEMPLO] Guia credenciado', '[EXEMPLO] Primeiros socorros', '[EXEMPLO] Condutor de trilha'],
  });

  // ── Gravar ─────────────────────────────────────────
  console.log(`\nGravando ${documentos.length} documentos...`);
  const transacao = documentos.reduce(
    (t, doc) => t.createOrReplace(doc),
    client.transaction()
  );
  await transacao.commit();

  console.log('\nPronto.');
  console.log('Para remover tudo depois: npm run seed:limpar');
}

semear().catch((erro) => {
  console.error('\nFalhou:', erro.message);
  process.exit(1);
});
