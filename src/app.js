const express = require('express');
const { createUsersRepository } = require('./modules/users/users.repository');
const { createAuthService } = require('./modules/users/auth.service');
const { createAuthRoutes, createUsersRoutes } = require('./modules/users/users.routes');
const { createTasksRepository } = require('./modules/tasks/tasks.repository');
const { createTasksService } = require('./modules/tasks/tasks.service');
const { createTasksRoutes } = require('./modules/tasks/tasks.routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Monta a aplicação recebendo o banco por parâmetro (injeção de dependência).
// Assim os testes usam um banco em memória e a produção usa o PostgreSQL.
function createApp({ db }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());

  const authService = createAuthService(createUsersRepository(db));
  const tasksService = createTasksService(createTasksRepository(db));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/auth', createAuthRoutes(authService));
  app.use('/users', createUsersRoutes(authService));
  app.use('/tasks', createTasksRoutes(tasksService));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
