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

async function limpar() {
  const alvos = await client.fetch<string[]>(
    `*[_id in path("seed.**")]._id`
  );

  if (alvos.length === 0) {
    console.log('Nada para remover.');
    return;
  }

  console.log(`Removendo ${alvos.length} documentos de exemplo...`);
  // Ordem reversa evita erro de referência: depoimentos antes das saídas
  await client.delete({ query: `*[_id in path("seed.**") && _type == "depoimento"]` });
  await client.delete({ query: `*[_id in path("seed.**") && _type == "saida"]` });
  await client.delete({ query: `*[_id in path("seed.**")]` });

  console.log('Pronto. Os singletons (configuracao, quemSou) foram mantidos —');
  console.log('edite-os no Studio com o conteúdo real.');
}

limpar().catch((erro) => {
  console.error('Falhou:', erro.message);
  process.exit(1);
});
