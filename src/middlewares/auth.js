const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');

// Exige o header "Authorization: Bearer <token>" e coloca o id do usuário em req.userId.
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Token não informado', 401);
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.userId = Number(payload.sub);
    next();
  } catch {
    throw new AppError('Token inválido ou expirado', 401);
  }
}

module.exports = auth;
