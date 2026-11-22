const { Router } = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { registerSchema, loginSchema } = require('./users.schemas');

function createAuthRoutes(authService) {
  const router = Router();

  router.post('/register', validate(registerSchema), async (req, res) => {
    const user = await authService.register(req.validated.body);
    res.status(201).json(user);
  });

  router.post('/login', validate(loginSchema), async (req, res) => {
    const result = await authService.login(req.validated.body);
    res.json(result);
  });

  return router;
}

function createUsersRoutes(authService) {
  const router = Router();

  router.get('/me', auth, async (req, res) => {
    const user = await authService.getProfile(req.userId);
    res.json(user);
  });

  return router;
}

module.exports = { createAuthRoutes, createUsersRoutes };
