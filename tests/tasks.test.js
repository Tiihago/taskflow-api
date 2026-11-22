const request = require('supertest');
const { createTestApp, registerAndLogin } = require('./helpers');

describe('Tarefas', () => {
  let app;
  let token;

  const api = () => ({
    get: (url) => request(app).get(url).set('Authorization', `Bearer ${token}`),
    post: (url) => request(app).post(url).set('Authorization', `Bearer ${token}`),
    patch: (url) => request(app).patch(url).set('Authorization', `Bearer ${token}`),
    delete: (url) => request(app).delete(url).set('Authorization', `Bearer ${token}`),
  });

  beforeEach(async () => {
    app = await createTestApp();
    ({ token } = await registerAndLogin(app));
  });

  test('exige login', async () => {
    await request(app).get('/tasks').expect(401);
  });

  test('cria uma tarefa com valores padrão', async () => {
    const res = await api()
      .post('/tasks')
      .send({ title: 'Estudar Node.js', dueDate: '2026-12-31' })
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(Number),
      title: 'Estudar Node.js',
      description: null,
      status: 'pending',
      dueDate: '2026-12-31',
    });
  });

  test('valida os dados da tarefa', async () => {
    const res = await api()
      .post('/tasks')
      .send({ title: '', status: 'qualquer', dueDate: '31/12/2026' })
      .expect(400);

    const fields = res.body.details.map((d) => d.field);
    expect(fields).toEqual(expect.arrayContaining(['title', 'status', 'dueDate']));
  });

  test('lista com paginação e filtro por status', async () => {
    for (let i = 1; i <= 3; i++) {
      await api().post('/tasks').send({ title: `Tarefa ${i}` }).expect(201);
    }
    await api().post('/tasks').send({ title: 'Feita', status: 'done' }).expect(201);

    const page = await api().get('/tasks?page=1&limit=2').expect(200);
    expect(page.body.data).toHaveLength(2);
    expect(page.body.meta).toEqual({ page: 1, limit: 2, total: 4, totalPages: 2 });

    const done = await api().get('/tasks?status=done').expect(200);
    expect(done.body.data).toHaveLength(1);
    expect(done.body.data[0].title).toBe('Feita');
  });

  test('busca, atualiza e remove uma tarefa', async () => {
    const { body: task } = await api().post('/tasks').send({ title: 'Revisar SQL' }).expect(201);

    await api().get(`/tasks/${task.id}`).expect(200);

    const updated = await api()
      .patch(`/tasks/${task.id}`)
      .send({ status: 'done', description: 'JOINs e índices' })
      .expect(200);
    expect(updated.body).toMatchObject({ status: 'done', description: 'JOINs e índices' });

    await api().delete(`/tasks/${task.id}`).expect(204);
    await api().get(`/tasks/${task.id}`).expect(404);
  });

  test('não aceita atualização vazia nem ID inválido', async () => {
    const { body: task } = await api().post('/tasks').send({ title: 'Tarefa' }).expect(201);
    await api().patch(`/tasks/${task.id}`).send({}).expect(400);
    await api().get('/tasks/abc').expect(400);
  });

  test('um usuário não acessa a tarefa de outro', async () => {
    const { body: task } = await api().post('/tasks').send({ title: 'Minha tarefa' }).expect(201);

    const outro = await registerAndLogin(app, { email: 'outro@example.com' });
    const asOther = (req) => req.set('Authorization', `Bearer ${outro.token}`);

    await asOther(request(app).get(`/tasks/${task.id}`)).expect(404);
    await asOther(request(app).patch(`/tasks/${task.id}`)).send({ title: 'Hack' }).expect(404);
    await asOther(request(app).delete(`/tasks/${task.id}`)).expect(404);

    const list = await asOther(request(app).get('/tasks')).expect(200);
    expect(list.body.data).toHaveLength(0);
  });

  test('responde 404 para rota inexistente', async () => {
    await api().get('/rota-que-nao-existe').expect(404);
  });
});
