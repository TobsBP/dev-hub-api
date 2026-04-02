# dev-hub-api

API backend da plataforma Dev Hub, construída com arquitetura de microsserviços.

## Serviços

### auth-service
Responsável pelo registro e autenticação de usuários.

- **Stack:** Java 21 + Spring Boot
- **Responsabilidades:**
  - Registro de novos usuários
  - Login com geração de JWT
  - Validação e refresh de tokens

### social-service
Responsável por todas as funcionalidades sociais da plataforma.

- **Stack:** Node.js + Fastify + TypeScript
- **Responsabilidades:**
  - Posts, comentários e likes
  - Sistema de follows entre usuários
  - Tags e snippets de código
  - Bookmarks e soluções de posts
  - Histórico de reputação

## Estrutura do repositório

```
dev-hub-api/
├── auth-service/     # Spring Boot — registro e login
└── social-service/   # Fastify — funcionalidades sociais
```

## Como rodar

Cada serviço possui seu próprio README com instruções detalhadas:

- [`auth-service`](./auth-service/)
- [`social-service`](./social-service/README.md)
