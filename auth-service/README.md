# Auth Service

Microsserviço responsável pela autenticação e gerenciamento de usuários da plataforma dev-hub-api.

## Stack

- **Runtime:** Java 21
- **Framework:** Spring Boot 4.0.5
- **Linguagem:** Java
- **Validação:** Jakarta Validation (Bean Validation)
- **Banco de dados:** PostgreSQL (via Spring Data JPA / Hibernate)
- **Autenticação:** JWT (`com.auth0:java-jwt`)
- **Segurança:** Spring Security

## Requisitos

- Java 21+
- PostgreSQL

## Instalação

```bash
mvn install
```
## Scripts

| Comando | Descrição |
|---|---|
| `mvn spring-boot:run` | Inicia em modo desenvolvimento |
| `mvn package` | Compila e empacota o projeto em `.jar` |
| `java -jar target/*.jar` | Inicia o build compilado |
| `mvn test` | Executa os testes |

## Porta padrão

```
http://localhost:9090
```

## Rotas

### Users

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/user/register` | Registrar novo usuário | ❌ |
| POST | `/user/login` | Autenticar usuário e obter token JWT | ❌ |
| PATCH | `/user/update` | Atualizar dados do usuário | ✅ |
| DELETE | `/user/delete` | Deletar usuário por UUID | ✅ |
| GET | `/user` | Buscar detalhes do usuário por UUID | ✅ |

## Exemplos de Request

### POST `/user/register`
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123",
  "bio": "Developer",
  "avatarUrl": "https://..."
}
```

### POST `/user/login`
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### PATCH `/user/update`
```json
{
  "email": "john@example.com",
  "username": "newname",
  "bio": "Updated bio"
}
```

### DELETE `/user/delete`
```json
{
  "email": "john@example.com"
}
```

### GET `/user`
```json
{
  "email": "john@example.com"
}
```