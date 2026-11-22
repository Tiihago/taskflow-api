# ✅ TaskFlow API

![CI](https://github.com/Tiihago/taskflow-api/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

🇧🇷 API REST para gerenciamento de tarefas, com cadastro de usuários, login com JWT e tarefas privadas por usuário.

🇺🇸 REST API for task management with user registration, JWT authentication and per-user private tasks.

## ✨ Funcionalidades | Features

- Cadastro e login de usuários com senha criptografada (**bcrypt**) e token **JWT**
- CRUD completo de tarefas: criar, listar, buscar, atualizar e remover
- Cada usuário só enxerga e altera **as próprias tarefas**
- Listagem com **paginação** e **filtro por status** (`pending`, `in_progress`, `done`)
- Validação de dados com **Zod** e mensagens de erro claras
- Tratamento centralizado de erros e códigos HTTP corretos (400, 401, 404, 409)
- **17 testes automatizados** (Jest + Supertest) rodando no **GitHub Actions**
- **Docker Compose** com PostgreSQL para subir tudo com um comando

## 🛠️ Tecnologias | Tech stack

Node.js · Express 5 · PostgreSQL · JWT · bcrypt · Zod · Jest · Supertest · Docker · GitHub Actions

## 🗂️ Estrutura | Project structure

```
src/
├── app.js                  # monta o Express (recebe o banco por injeção de dependência)
├── server.js               # inicia o servidor
├── config/env.js           # variáveis de ambiente
├── db/                     # conexão e schema SQL
├── middlewares/            # autenticação, validação e erros
├── modules/
│   ├── users/              # cadastro, login e perfil
│   └── tasks/              # CRUD de tarefas
└── utils/AppError.js
tests/                      # testes de integração
```

Cada módulo segue a separação **rotas → serviço → repositório**:
- **rotas**: recebem a requisição HTTP e validam os dados
- **serviço**: regras de negócio
- **repositório**: consultas SQL ao banco

## 🚀 Como rodar | Getting started

### Opção 1: rápido, sem instalar banco (banco em memória)

```bash
npm install
npm run dev:memory
```

### Opção 2: com Docker e PostgreSQL

```bash
docker compose up --build
```

A API sobe em `http://localhost:3000`.

### Rodar os testes

```bash
npm test
```

## 📡 Endpoints

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/health` | Status da API | — |
| POST | `/auth/register` | Cadastra um usuário | — |
| POST | `/auth/login` | Faz login e retorna o token | — |
| GET | `/users/me` | Dados do usuário logado | ✅ |
| GET | `/tasks?status=&page=&limit=` | Lista as tarefas | ✅ |
| POST | `/tasks` | Cria uma tarefa | ✅ |
| GET | `/tasks/:id` | Busca uma tarefa | ✅ |
| PATCH | `/tasks/:id` | Atualiza uma tarefa | ✅ |
| DELETE | `/tasks/:id` | Remove uma tarefa | ✅ |

Rotas com ✅ exigem o header `Authorization: Bearer <token>`.

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

# 4. Listar tarefas concluídas
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

## 🔮 Próximos passos | Roadmap

- [ ] Documentação interativa com Swagger
- [ ] Refresh token
- [ ] Deploy em nuvem

## 👤 Autor | Author

**T.Ortiiz** · [LinkedIn](https://www.linkedin.com/in/thiago-ortiz-387094109/) · [GitHub](https://github.com/Tiihago)
