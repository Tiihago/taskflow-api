// Converte a coluna DATE para "AAAA-MM-DD", venha ela como texto ou como Date.
function toDateString(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function toTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    dueDate: toDateString(row.due_date),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Campos que podem ser atualizados: nome no JSON -> nome da coluna
const UPDATABLE_COLUMNS = {
  title: 'title',
  description: 'description',
  status: 'status',
  dueDate: 'due_date',
};

const SELECT_COLUMNS = 'id, title, description, status, due_date, created_at, updated_at';

function createTasksRepository(db) {
  return {
    async create(userId, { title, description = null, status = 'pending', dueDate = null }) {
      const { rows } = await db.query(
        `INSERT INTO tasks (user_id, title, description, status, due_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING ${SELECT_COLUMNS}`,
        [userId, title, description, status, dueDate],
      );
      return toTask(rows[0]);
    },

    async list(userId, { status, limit, offset }) {
      const params = [userId];
      let where = 'WHERE user_id = $1';
      if (status) {
        params.push(status);
        where += ` AND status = $${params.length}`;
      }

      const countResult = await db.query(`SELECT COUNT(*) AS total FROM tasks ${where}`, params);
      const { rows } = await db.query(
        `SELECT ${SELECT_COLUMNS} FROM tasks ${where}
         ORDER BY created_at DESC, id DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset],
      );

      return { total: Number(countResult.rows[0].total), items: rows.map(toTask) };
    },

    // Sempre filtra por user_id: um usuário nunca acessa tarefa de outro.
    async findById(userId, id) {
      const { rows } = await db.query(
        `SELECT ${SELECT_COLUMNS} FROM tasks WHERE id = $1 AND user_id = $2`,
        [id, userId],
      );
      return rows[0] ? toTask(rows[0]) : null;
    },

    async update(userId, id, fields) {
      const sets = [];
      const params = [];
      for (const [key, column] of Object.entries(UPDATABLE_COLUMNS)) {
        if (fields[key] !== undefined) {
          params.push(fields[key]);
          sets.push(`${column} = $${params.length}`);
        }
      }
      sets.push('updated_at = NOW()');
      params.push(id, userId);

      const { rows } = await db.query(
        `UPDATE tasks SET ${sets.join(', ')}
         WHERE id = $${params.length - 1} AND user_id = $${params.length}
         RETURNING ${SELECT_COLUMNS}`,
        params,
      );
      return rows[0] ? toTask(rows[0]) : null;
    },

    async remove(userId, id) {
      const { rowCount } = await db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [
        id,
        userId,
      ]);
      return rowCount > 0;
    },
  };
}

module.exports = { createTasksRepository };
