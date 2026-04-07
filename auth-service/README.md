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
# DevHub API – Suíte de Testes Automatizados (Java)

**Disciplina:** Qualidade de Software – INATEL  
**Professor:** Christopher Lima  
**Categoria:** Testes de API REST  
**Ferramenta:** JUnit 5 + REST Assured + Allure

---

## Pré-requisitos

| Ferramenta                  | Versão mínima |
|-----------------------------|---------------|
| Java (JDK)                  | 17+           |
| Maven                       | 3.8+          |
| API rodando localmente      | `http://localhost:8080` |

---

## Estrutura do Projeto

```
devhub-api-tests-java/
├── pom.xml
├── README.md
└── src/
    └── test/
        └── java/
            └── br/inatel/qs/
                ├── ApiHelper.java      # URL base + métodos auxiliares
                └── UserApiTest.java    # 20 casos de teste (TC-001 a TC-020)
```

---

## Instalação

```bash
# Clone o repositório e entre na pasta
git clone <url-do-repo>
cd devhub-api-tests-java

# Baixa as dependências (sem rodar testes)
mvn dependency:resolve
```

---

## Execução dos Testes

```bash
# Rodar todos os 20 casos (saída no terminal)
mvn test

# Apontar para outro ambiente
mvn test -DBASE_URL=https://api.seuservidor.com
```

### Relatório Allure (HTML)

```bash
# 1. Rodar os testes gerando dados Allure
mvn test

# 2. Abrir o relatório no browser
mvn allure:serve
# ou gerar o HTML estático em target/site/allure-maven-plugin/
mvn allure:report
```

---

## Casos de Teste

| ID     | Endpoint            | Cenário                                  | Tipo          |
|--------|---------------------|------------------------------------------|---------------|
| TC-001 | POST /register      | Dados válidos – retorna 200              | Caminho Feliz |
| TC-002 | POST /register      | Sem campo email – retorna 4xx            | Inválido      |
| TC-003 | POST /register      | Sem campo password – retorna 4xx         | Inválido      |
| TC-004 | POST /register      | Email duplicado – retorna 4xx            | Inválido      |
| TC-005 | POST /register      | Email mal formatado – retorna 4xx        | Inválido      |
| TC-006 | POST /register      | Body vazio – retorna 4xx                 | Inválido      |
| TC-007 | POST /login         | Credenciais válidas – retorna 200        | Caminho Feliz |
| TC-008 | POST /login         | Senha errada – retorna 4xx               | Inválido      |
| TC-009 | POST /login         | Email inexistente – retorna 4xx          | Inválido      |
| TC-010 | POST /login         | Sem campo email – retorna 4xx            | Inválido      |
| TC-011 | POST /login         | Sem campo senha – retorna 4xx            | Inválido      |
| TC-012 | GET /user           | Email válido – retorna 200 e dados       | Caminho Feliz |
| TC-013 | GET /user           | Email inexistente – retorna 4xx          | Inválido      |
| TC-014 | GET /user           | Sem body – retorna 4xx                   | Inválido      |
| TC-015 | PATCH /user/update  | Dados válidos – retorna 200              | Caminho Feliz |
| TC-016 | PATCH /user/update  | UUID inexistente – retorna 4xx           | Inválido      |
| TC-017 | PATCH /user/update  | Body vazio – retorna 4xx                 | Inválido      |
| TC-018 | DELETE /user/delete | Email válido – retorna 200               | Caminho Feliz |
| TC-019 | DELETE /user/delete | Email inexistente – retorna 4xx          | Inválido      |
| TC-020 | DELETE /user/delete | Sem body – retorna 4xx                   | Inválido      |

**Total: 20 casos** (10 Caminho Feliz + 10 Dados Inválidos)

---

---

## Correspondência com o projeto Node.js original

| Node.js (Jest + Axios)              | Java (JUnit 5 + REST Assured)        |
|-------------------------------------|--------------------------------------|
| `jest`                              | `junit-jupiter`                      |
| `axios`                             | `rest-assured`                       |
| `jest-html-reporter`                | `allure-junit5`                      |
| `describe()`                        | Classe de teste anotada              |
| `test()`                            | `@Test`                              |
| `expect(x).toBe(y)`                 | `assertEquals(y, x)`                 |
| `expect(x).toBeGreaterThanOrEqual(400)` | `assertTrue(x >= 400)`           |
| `process.env.BASE_URL`              | `System.getProperty("BASE_URL")`     |
| `npm test`                          | `mvn test`                           |
| `npm run test:html`                 | `mvn allure:serve`                   |