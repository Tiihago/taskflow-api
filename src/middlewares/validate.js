const AppError = require('../utils/AppError');

// Valida body, query ou params com um schema do Zod.
// Os dados validados ficam em req.validated[origem].
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      throw new AppError('Dados inválidos', 400, details);
    }

    req.validated = { ...req.validated, [source]: result.data };
    next();
  };
}

module.exports = validate;
