const env = require('./config/env');
const { createDatabase } = require('./db');
const { createApp } = require('./app');

async function main() {
  // Sem DATABASE_URL (ou com --memory), usa banco em memória: bom para testar rápido.
  const memory = process.argv.includes('--memory') || !env.databaseUrl;
  if (memory) {
    console.warn('Usando banco em memória: os dados somem ao reiniciar a API.');
  }

  const db = await createDatabase({ memory, connectionString: env.databaseUrl });
  const app = createApp({ db });

  app.listen(env.port, () => {
    console.log(`TaskFlow API rodando em http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error('Falha ao iniciar a API:', err);
  process.exit(1);
});
