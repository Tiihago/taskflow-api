const AppError = require('../../utils/AppError');

function createTasksService(tasksRepository) {
  async function findOrFail(userId, id) {
    const task = await tasksRepository.findById(userId, id);
    if (!task) {
      throw new AppError('Tarefa não encontrada', 404);
    }
    return task;
  }

  return {
    create(userId, data) {
      return tasksRepository.create(userId, data);
    },

    async list(userId, { status, page, limit }) {
      const offset = (page - 1) * limit;
      const { total, items } = await tasksRepository.list(userId, { status, limit, offset });
      return {
        data: items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    },

    getById(userId, id) {
      return findOrFail(userId, id);
    },

    async update(userId, id, fields) {
      const task = await tasksRepository.update(userId, id, fields);
      if (!task) {
        throw new AppError('Tarefa não encontrada', 404);
      }
      return task;
    },

    async remove(userId, id) {
      const removed = await tasksRepository.remove(userId, id);
      if (!removed) {
        throw new AppError('Tarefa não encontrada', 404);
      }
    },
  };
}

module.exports = { createTasksService };
