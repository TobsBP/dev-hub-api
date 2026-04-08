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

---

## Plano de Testes — API `UsersController`

### 1. Escopo

Este plano cobre os testes da API REST do controller `UsersController` do microsserviço de autenticação. São validados os endpoints expostos pela API: registro de usuários, login, atualização de dados, exclusão de conta e consulta de detalhes do usuário.

### 2. Objetivos

- Garantir que cada rota aceite e responda corretamente a requisições válidas.
- Verificar o comportamento de validação do JSON de entrada (`@Valid`) para campos obrigatórios e formato de e-mail.
- Assegurar que os fluxos de erro retornem códigos de status adequados e mensagens consistentes.
- Testar o comportamento de 5 cenários positivos e 5 cenários negativos, conforme pedido.

### 3. Estratégia de Testes

**Abordagem:** Caixa-preta na camada de controller — os testes exercitam apenas a API HTTP simulada com `MockMvc` e validam o contrato da rota, sem carregar todo o contexto de persistência.

**Técnicas utilizadas:**

- **Fluxos positivos:** requisições válidas para endpoints que devem retornar status `200 OK` e payload correto.
- **Fluxos negativos:** requisições inválidas ou com dados ausentes que devem retornar status `400 Bad Request`.
- **Validação de formato:** e-mail inválido deve ser rejeitado antes de chegar ao serviço.

### 4. Ambiente

| Item | Versão / Detalhe |
|---|---|
| Linguagem | Java 21 |
| Framework de testes | JUnit 5 (Jupiter) |
| Testes de controller | Spring `MockMvc` |
| Build | Maven |
| Escopo de execução | `mvn test` |
| Dependências de teste | `spring-boot-starter-test`, `spring-boot-starter-webmvc-test`, `spring-boot-starter-security-test` |

> Os testes de API usam `@WebMvcTest` e não precisam de banco de dados ou servidor real.

### 5. Descrição dos Casos de Teste

| ID | Nome | Endpoint | Entrada | Resultado Esperado |
|---|---|---|---|---|
| TC-01 | Registro com sucesso | `POST /user/register` | `username=testuser`, `email=test@example.com`, `password=password` | `200 OK`, corpo `Usuário Registrado com sucesso` |
| TC-02 | Login com sucesso | `POST /user/login` | `email=test@example.com`, `password=password` | `200 OK`, JSON `{"token":"token123"}` |
| TC-03 | Consulta de detalhes com sucesso | `GET /user` | `email=test@example.com` | `200 OK`, JSON com `email=test@example.com`, `username=testuser` |
| TC-04 | Atualização com sucesso | `PATCH /user/update` | corpo válido com `id`, `email`, `name`, `password`, `bio`, `avatarUrl` | `200 OK`, corpo `Dados atualizados com sucesso` |
| TC-05 | Exclusão com sucesso | `DELETE /user/delete` | `email=test@example.com` | `200 OK`, corpo `Usuário Deletado com Sucesso!` |
| TC-06 | Registro com e-mail inválido | `POST /user/register` | `email=invalid-email` | `400 Bad Request`, mensagem de validação de e-mail |
| TC-07 | Login com e-mail inválido | `POST /user/login` | `email=invalid-email` | `400 Bad Request`, mensagem de validação de e-mail |
| TC-08 | Consulta de detalhes com usuário ausente | `GET /user` | `email=missing@example.com` | `400 Bad Request`, mensagem `Usuario nao encontrado` |
| TC-09 | Atualização com usuário não encontrado | `PATCH /user/update` | `id` válido com dados de atualização | `400 Bad Request`, mensagem `Usuario nao encontrado` |
| TC-10 | Exclusão com e-mail em branco | `DELETE /user/delete` | `email=""` | `400 Bad Request`, mensagem de validação `must not be blank` |

### 6. Critérios de Aceitação

A suíte é considerada aprovada quando **100% dos 10 casos passarem** em `mvn test`, cobrindo os 7 cenários positivos e os 3 negativos definidos.

### 7. Observações

- Os testes se concentram no contrato da API e na validação de entrada do controller, usando mocks para o serviço.
- A rota `GET /user` recebe um corpo JSON com `email` embora o método seja `GET`; isso foi mantido conforme a implementação atual.
- Não há testes de integração com banco ou JWT nesta suíte específica.
