# âœ… TaskFlow API

![CI](https://github.com/Tiihago/taskflow-api/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

ðŸ‡§ðŸ‡· API REST para gerenciamento de tarefas, com cadastro de usuÃ¡rios, login com JWT e tarefas privadas por usuÃ¡rio.

ðŸ‡ºðŸ‡¸ REST API for task management with user registration, JWT authentication and per-user private tasks.

## âœ¨ Funcionalidades | Features

- Cadastro e login de usuÃ¡rios com senha criptografada (**bcrypt**) e token **JWT**
- CRUD completo de tarefas: criar, listar, buscar, atualizar e remover
- Cada usuÃ¡rio sÃ³ enxerga e altera **as prÃ³prias tarefas**
- Listagem com **paginaÃ§Ã£o** e **filtro por status** (`pending`, `in_progress`, `done`)
- ValidaÃ§Ã£o de dados com **Zod** e mensagens de erro claras
- Tratamento centralizado de erros e cÃ³digos HTTP corretos (400, 401, 404, 409)
- **17 testes automatizados** (Jest + Supertest) rodando no **GitHub Actions**
- **Docker Compose** com PostgreSQL para subir tudo com um comando

## ðŸ› ï¸ Tecnologias | Tech stack

Node.js Â· Express 5 Â· PostgreSQL Â· JWT Â· bcrypt Â· Zod Â· Jest Â· Supertest Â· Docker Â· GitHub Actions

## ðŸ—‚ï¸ Estrutura | Project structure

```
src/
â”œâ”€â”€ app.js                  # monta o Express (recebe o banco por injeÃ§Ã£o de dependÃªncia)
â”œâ”€â”€ server.js               # inicia o servidor
â”œâ”€â”€ config/env.js           # variÃ¡veis de ambiente
â”œâ”€â”€ db/                     # conexÃ£o e schema SQL
â”œâ”€â”€ middlewares/            # autenticaÃ§Ã£o, validaÃ§Ã£o e erros
â”œâ”€â”€ modules/
â”‚   â”œâ”€â”€ users/              # cadastro, login e perfil
â”‚   â””â”€â”€ tasks/              # CRUD de tarefas
â””â”€â”€ utils/AppError.js
tests/                      # testes de integraÃ§Ã£o
```

Cada mÃ³dulo segue a separaÃ§Ã£o **rotas â†’ serviÃ§o â†’ repositÃ³rio**:
- **rotas**: recebem a requisiÃ§Ã£o HTTP e validam os dados
- **serviÃ§o**: regras de negÃ³cio
- **repositÃ³rio**: consultas SQL ao banco

## ðŸš€ Como rodar | Getting started

### OpÃ§Ã£o 1: rÃ¡pido, sem instalar banco (banco em memÃ³ria)

```bash
npm install
npm run dev:memory
```

### OpÃ§Ã£o 2: com Docker e PostgreSQL

```bash
docker compose up --build
```

A API sobe em `http://localhost:3000`.

### Rodar os testes

```bash
npm test
```

## ðŸ“¡ Endpoints

| MÃ©todo | Rota | DescriÃ§Ã£o | Auth |
|---|---|---|---|
| GET | `/health` | Status da API | â€” |
| POST | `/auth/register` | Cadastra um usuÃ¡rio | â€” |
| POST | `/auth/login` | Faz login e retorna o token | â€” |
| GET | `/users/me` | Dados do usuÃ¡rio logado | âœ… |
| GET | `/tasks?status=&page=&limit=` | Lista as tarefas | âœ… |
| POST | `/tasks` | Cria uma tarefa | âœ… |
| GET | `/tasks/:id` | Busca uma tarefa | âœ… |
| PATCH | `/tasks/:id` | Atualiza uma tarefa | âœ… |
| DELETE | `/tasks/:id` | Remove uma tarefa | âœ… |

Rotas com âœ… exigem o header `Authorization: Bearer <token>`.

### Exemplo de uso

```bash
# 1. Cadastro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@example.com","password":"senhaSegura123"}'

# 2. Login (copie o "token" da resposta)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"senhaSegura123"}'

# 3. Criar tarefa
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title":"Estudar Node.js","dueDate":"2026-12-31"}'

# 4. Listar tarefas concluÃ­das
curl "http://localhost:3000/tasks?status=done" -H "Authorization: Bearer SEU_TOKEN"
```

Resposta da listagem:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Estudar Node.js",
      "description": null,
      "status": "pending",
      "dueDate": "2026-12-31",
      "createdAt": "2026-11-22T18:00:00.000Z",
      "updatedAt": "2026-11-22T18:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

## ðŸ”® PrÃ³ximos passos | Roadmap

- [ ] DocumentaÃ§Ã£o interativa com Swagger
- [ ] Refresh token
- [ ] Deploy em nuvem

## ðŸ‘¤ Autor | Author

**T.Ortiiz** Â· [LinkedIn](https://www.linkedin.com/in/thiago-ortiz-387094109/) Â· [GitHub](https://github.com/Tiihago)
