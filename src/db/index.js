const fs = require('node:fs');
const path = require('node:path');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

// Banco em memória (pg-mem): usado nos testes e para rodar a API sem instalar o PostgreSQL.
function createMemoryPool() {
  const { newDb } = require('pg-mem');
  const db = newDb();
  const { Pool } = db.adapters.createPg();
  return new Pool();
}

function createPostgresPool(connectionString) {
  const { Pool, types } = require('pg');
  // Retorna colunas DATE como texto (AAAA-MM-DD) para evitar problemas de fuso horário.
  types.setTypeParser(1082, (value) => value);
  return new Pool({ connectionString });
}

async function createDatabase({ memory = false, connectionString } = {}) {
  const pool = memory ? createMemoryPool() : createPostgresPool(connectionString);
  await pool.query(schema);
  return pool;
}

module.exports = { createDatabase };
