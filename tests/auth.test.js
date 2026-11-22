const request = require('supertest');
const { createTestApp, registerAndLogin } = require('./helpers');

describe('Autenticação', () => {
  let app;

  beforeEach(async () => {
    app = await createTestApp();
  });

  test('GET /health responde ok', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('cadastra usuário sem devolver a senha', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Ana', email: 'ANA@Example.com', password: 'senhaSegura123' })
      .expect(201);

    expect(res.body).toMatchObject({ id: expect.any(Number), name: 'Ana', email: 'ana@example.com' });
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  test('não permite e-mail duplicado', async () => {
    const user = { name: 'Ana', email: 'ana@example.com', password: 'senhaSegura123' };
    await request(app).post('/auth/register').send(user).expect(201);
    const res = await request(app).post('/auth/register').send(user).expect(409);
    expect(res.body.error).toBe('E-mail já cadastrado');
  });

  test('valida os dados do cadastro', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'A', email: 'nao-e-email', password: '123' })
      .expect(400);

    const fields = res.body.details.map((d) => d.field);
    expect(fields).toEqual(expect.arrayContaining(['name', 'email', 'password']));
  });

  test('faz login e devolve um token JWT', async () => {
    const { token, user } = await registerAndLogin(app);
    expect(token.split('.')).toHaveLength(3);
    expect(user.email).toBe('teste@example.com');
  });

  test('recusa senha errada', async () => {
    await registerAndLogin(app);
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'teste@example.com', password: 'senhaErrada' })
      .expect(401);
    expect(res.body.error).toBe('E-mail ou senha inválidos');
  });

  test('GET /users/me devolve o usuário logado', async () => {
    const { token } = await registerAndLogin(app);
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.email).toBe('teste@example.com');
  });

  test('bloqueia rota protegida sem token ou com token inválido', async () => {
    await request(app).get('/users/me').expect(401);
    await request(app).get('/users/me').set('Authorization', 'Bearer token-falso').expect(401);
  });

  test('responde 400 para JSON mal formatado', async () => {
    await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": ')
      .expect(400);
  });
});
