const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const AppError = require('../../utils/AppError');

const SALT_ROUNDS = 10;

function createAuthService(usersRepository) {
  function generateToken(user) {
    return jwt.sign({ sub: String(user.id) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  }

  return {
    async register({ name, email, password }) {
      const existing = await usersRepository.findByEmail(email);
      if (existing) {
        throw new AppError('E-mail já cadastrado', 409);
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      return usersRepository.create({ name, email, passwordHash });
    },

    async login({ email, password }) {
      const user = await usersRepository.findByEmail(email);
      // Mesma mensagem para e-mail ou senha errados, para não revelar quais e-mails existem.
      const passwordOk = user && (await bcrypt.compare(password, user.passwordHash));
      if (!passwordOk) {
        throw new AppError('E-mail ou senha inválidos', 401);
      }

      const { passwordHash, ...publicUser } = user;
      return { token: generateToken(user), user: publicUser };
    },

    async getProfile(userId) {
      const user = await usersRepository.findById(userId);
      if (!user) {
        throw new AppError('Usuário não encontrado', 404);
      }
      return user;
    },
  };
}

module.exports = { createAuthService };
