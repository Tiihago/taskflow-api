const request = require('supertest');
const { createDatabase } = require('../src/db');
const { createApp } = require('../src/app');

// Cada chamada cria uma API nova com um banco em memória limpo.
async function createTestApp() {
  const db = await createDatabase({ memory: true });
  return createApp({ db });
}

async function registerAndLogin(app, overrides = {}) {
  const user = {
    name: 'Usuária Teste',
    email: 'teste@example.com',
    password: 'senhaSegura123',
    ...overrides,
  };

  await request(app).post('/auth/register').send(user).expect(201);
  const res = await request(app)
    .post('/auth/login')
    .send({ email: user.email, password: user.password })
    .expect(200);

  return { token: res.body.token, user: res.body.user };
}

module.exports = { createTestApp, registerAndLogin };
