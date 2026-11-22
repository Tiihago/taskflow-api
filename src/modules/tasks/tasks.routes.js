const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
  createTaskSchema,
  updateTaskSchema,
  listTasksSchema,
  idParamSchema,
} = require('./tasks.schemas');

function createTasksRoutes(tasksService) {
  const router = Router();

  // Todas as rotas de tarefas exigem login.
  router.use(auth);

  router.get('/', validate(listTasksSchema, 'query'), async (req, res) => {
    const result = await tasksService.list(req.userId, req.validated.query);
    res.json(result);
  });

  router.post('/', validate(createTaskSchema), async (req, res) => {
    const task = await tasksService.create(req.userId, req.validated.body);
    res.status(201).json(task);
  });

  router.get('/:id', validate(idParamSchema, 'params'), async (req, res) => {
    const task = await tasksService.getById(req.userId, req.validated.params.id);
    res.json(task);
  });

  router.patch(
    '/:id',
    validate(idParamSchema, 'params'),
    validate(updateTaskSchema),
    async (req, res) => {
      const task = await tasksService.update(
        req.userId,
        req.validated.params.id,
        req.validated.body,
      );
      res.json(task);
    },
  );

  router.delete('/:id', validate(idParamSchema, 'params'), async (req, res) => {
    await tasksService.remove(req.userId, req.validated.params.id);
    res.status(204).send();
  });

  return router;
}

module.exports = { createTasksRoutes };
