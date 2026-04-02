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
