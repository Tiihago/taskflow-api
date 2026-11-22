const { z } = require('zod');

const STATUS = ['pending', 'in_progress', 'done'];

const title = z.string().trim().min(1, 'O título é obrigatório').max(150);
const description = z.string().trim().max(1000).nullable();
const status = z.enum(STATUS, { message: `Status deve ser: ${STATUS.join(', ')}` });
const dueDate = z.iso.date({ message: 'Data deve estar no formato AAAA-MM-DD' }).nullable();

const createTaskSchema = z.object({
  title,
  description: description.optional(),
  status: status.optional(),
  dueDate: dueDate.optional(),
});

const updateTaskSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    status: status.optional(),
    dueDate: dueDate.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  });

const listTasksSchema = z.object({
  status: status.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const idParamSchema = z.object({
  id: z.coerce.number({ message: 'ID inválido' }).int('ID inválido').positive('ID inválido'),
});

module.exports = { createTaskSchema, updateTaskSchema, listTasksSchema, idParamSchema };
