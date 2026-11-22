function toUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

function createUsersRepository(db) {
  return {
    async create({ name, email, passwordHash }) {
      const { rows } = await db.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
        [name, email, passwordHash],
      );
      return toUser(rows[0]);
    },

    async findByEmail(email) {
      const { rows } = await db.query(
        'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1',
        [email],
      );
      if (!rows[0]) return null;
      return { ...toUser(rows[0]), passwordHash: rows[0].password_hash };
    },

    async findById(id) {
      const { rows } = await db.query(
        'SELECT id, name, email, created_at FROM users WHERE id = $1',
        [id],
      );
      return rows[0] ? toUser(rows[0]) : null;
    },
  };
}

module.exports = { createUsersRepository };
