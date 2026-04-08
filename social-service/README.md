# Social Service

Microsserviço responsável pelas funcionalidades sociais da plataforma: posts, comentários, likes, follows, tags, snippets de código, bookmarks e reputação.

## Stack

- **Runtime:** Node.js
- **Framework:** Fastify
- **Linguagem:** TypeScript
- **Validação:** Zod
- **Banco de dados:** PostgreSQL (via `postgres`)
- **Autenticação:** JWT (`@fastify/jwt`)
- **Documentação:** Scalar / OpenAPI (`@fastify/swagger`)

## Requisitos

- Node.js 18+
- PostgreSQL

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do serviço:

```env
DB_URL=postgres://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento com hot reload e `.env` |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Inicia o build compilado |
| `npm run lint` | Verifica e corrige o código com Biome |

## Testes

A suíte de testes é composta por **20 casos automatizados** (TC-001 a TC-020) organizados em duas categorias:

| Categoria | IDs | Qtd. |
|---|---|---|
| Caminho Feliz (dados válidos) | TC-001 a TC-010 | 10 |
| Dados Inválidos / Inoportunos | TC-011 a TC-020 | 10 |

A collection está em `postman/social-service-tests.postman_collection.json`.

### Pré-requisitos

- [Postman CLI (Newman)](https://learning.postman.com/docs/collections/using-newman-cli/installing-running-newman/) instalado globalmente:

```bash
npm install -g newman newman-reporter-htmlextra
```

### Variáveis necessárias

Antes de rodar, preencha as variáveis da collection (via `--env-var` na CLI ou editando diretamente no Postman):

| Variável | Descrição |
|---|---|
| `BASE_URL` | URL base da API (padrão: `http://localhost:3333`) |
| `TEST_EMAIL` | E-mail de um usuário existente no banco |
| `TEST_PASSWORD` | Senha do usuário acima |
| `USER_ID` | UUID de um usuário existente |
| `POST_ID` | UUID de um post existente |
| `COMMENT_ID` | UUID de um comentário existente |

### Importar no Postman (UI)

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `postman/social-service-tests.postman_collection.json`
4. Preencha as variáveis da collection em **Variables**
5. Execute via **Run collection**

### Executar via linha de comando

```bash
newman run postman/social-service-tests.postman_collection.json \
  --env-var "BASE_URL=http://localhost:3333" \
  --env-var "TEST_EMAIL=usuario@exemplo.com" \
  --env-var "TEST_PASSWORD=suasenha" \
  --env-var "USER_ID=<uuid>" \
  --env-var "POST_ID=<uuid>" \
  --env-var "COMMENT_ID=<uuid>" \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export postman/reports/report.html
```

O relatório HTML será gerado em `postman/reports/report.html`.

### Executar no CI (Postman CLI oficial)

O workflow `.github/workflows/social-service.yml` executa os testes automaticamente após cada deploy na branch `main` usando o Postman CLI e publica o relatório JUnit nos artefatos do GitHub Actions.

### Testes de performance (k6)

Os testes de carga ficam em `k6/performance.js` e requerem o [k6](https://k6.io/docs/get-started/installation/) instalado:

```bash
mkdir -p k6/reports

k6 run \
  -e BASE_URL=http://localhost:3333 \
  -e USER_ID=<uuid> \
  -e POST_ID=<uuid> \
  -e COMMENT_ID=<uuid> \
  -e TAG_ID=<uuid> \
  -e SNIPPET_ID=<uuid> \
  k6/performance.js
```

O relatório HTML é gerado automaticamente em `k6/reports/`.

## Documentação

Com o servidor rodando, acesse:

```
http://localhost:3333/docs
```

## Rotas

### Users
| Método | Rota | Descrição |
|---|---|---|
| GET | `/users` | Listar todos os usuários |
| GET | `/user/:id` | Buscar usuário por ID |
| POST | `/users` | Criar usuário |
| PATCH | `/user/:id` | Atualizar usuário |
| DELETE | `/user/:id` | Deletar usuário |

### Posts
| Método | Rota | Descrição |
|---|---|---|
| GET | `/posts` | Listar todos os posts |
| GET | `/post/:id` | Buscar post por ID |
| GET | `/posts/:userId` | Listar posts de um usuário |
| POST | `/posts` | Criar post |
| PATCH | `/post/:id` | Atualizar post |
| DELETE | `/post/:id` | Deletar post |

### Comments
| Método | Rota | Descrição |
|---|---|---|
| GET | `/posts/:postId/comments` | Listar comentários de um post |
| GET | `/comment/:id` | Buscar comentário por ID |
| POST | `/comments` | Criar comentário |
| PATCH | `/comment/:id` | Atualizar comentário |
| DELETE | `/comment/:id` | Deletar comentário |

### Likes
| Método | Rota | Descrição |
|---|---|---|
| GET | `/likes/:targetType/:targetId` | Listar likes de um post ou comentário |
| POST | `/likes` | Dar like |
| DELETE | `/like/:userId/:targetType/:targetId` | Remover like |

### Follows
| Método | Rota | Descrição |
|---|---|---|
| GET | `/users/:userId/followers` | Listar seguidores |
| GET | `/users/:userId/following` | Listar quem o usuário segue |
| POST | `/follows` | Seguir usuário |
| DELETE | `/follow/:followerId/:followingId` | Deixar de seguir |

### Tags
| Método | Rota | Descrição |
|---|---|---|
| GET | `/tags` | Listar todas as tags |
| GET | `/tag/:id` | Buscar tag por ID |
| GET | `/posts/:postId/tags` | Listar tags de um post |
| POST | `/tags` | Criar tag |
| DELETE | `/tag/:id` | Deletar tag |
| POST | `/post-tag` | Adicionar tag a um post |
| DELETE | `/post-tag/:postId/:tagId` | Remover tag de um post |

### Code Snippets
| Método | Rota | Descrição |
|---|---|---|
| GET | `/posts/:postId/snippets` | Listar snippets de um post |
| GET | `/snippet/:id` | Buscar snippet por ID |
| POST | `/snippets` | Criar snippet |
| PATCH | `/snippet/:id` | Atualizar snippet |
| DELETE | `/snippet/:id` | Deletar snippet |

### Bookmarks
| Método | Rota | Descrição |
|---|---|---|
| GET | `/users/:userId/bookmarks` | Listar bookmarks de um usuário |
| POST | `/bookmarks` | Salvar bookmark |
| DELETE | `/bookmark/:userId/:postId` | Remover bookmark |

### Post Solutions
| Método | Rota | Descrição |
|---|---|---|
| GET | `/posts/:postId/solution` | Buscar solução de um post |
| PUT | `/posts/:postId/solution` | Definir solução |
| DELETE | `/posts/:postId/solution` | Remover solução |

### Reputation
| Método | Rota | Descrição |
|---|---|---|
| GET | `/users/:userId/reputations` | Histórico de reputação do usuário |
| POST | `/reputations` | Adicionar entrada de reputação |
