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

## Plano de Testes — `UsersService`

### 1. Escopo

Este plano cobre os testes unitários da camada de serviço (`UsersService`) do microsserviço de autenticação. As funcionalidades testadas são: registro de usuário, autenticação (login), atualização de dados, exclusão de conta e consulta de detalhes do usuário. Dependências externas (repositório, `AuthenticationManager`, `TokenService`) são isoladas via mocks com Mockito.

### 2. Objetivos

- Garantir que cada operação do serviço retorne o resultado esperado para entradas válidas.
- Assegurar que exceções adequadas sejam lançadas em cenários de erro (e-mail inválido, duplicado, usuário não encontrado, credenciais incorretas).
- Verificar que as interações com os repositórios e serviços auxiliares ocorrem conforme esperado (verificação de chamadas via `verify`).

### 3. Estratégia de Testes

**Abordagem:** Caixa-cinza — os testes conhecem a estrutura interna do serviço (ex: quais repositórios são chamados), mas validam o comportamento externo (retornos e exceções), não a implementação linha a linha.

**Técnicas utilizadas:**

- **Particionamento de equivalência:** cada método é testado com uma entrada válida (partição de sucesso) e ao menos uma entrada inválida (partição de falha), cobrindo comportamentos distintos.
- **Análise de valor limite:** aplicada na validação de e-mail — testando um e-mail no formato correto (`test@example.com`) e um no limite inválido (`invalid-email`, sem `@` e domínio).

### 4. Ambiente

| Item | Versão / Detalhe |
|---|---|
| Linguagem | Java 21 |
| Framework de testes | JUnit 5 (Jupiter) |
| Framework de mocks | Mockito 5.x (via `MockitoAnnotations.openMocks`) |
| Build | Maven |
| Escopo de execução | `mvn test` |
| Dependências de teste | `spring-boot-starter-test`, `mockito-core` |

> Os testes são unitários e não requerem banco de dados, servidor ou variáveis de ambiente ativas.

### 5. Descrição dos Casos de Teste

| ID | Nome | Pré-condição | Dados de Entrada | Ação | Resultado Esperado |
|---|---|---|---|---|---|
| TC-01 | Registro com sucesso | E-mail não cadastrado no repositório | `username=testuser`, `email=test@example.com`, `password=password` | `usersService.register(dto)` | Retorna `"Usuário Registrado com sucesso"` e chama `usersRepository.save()` |
| TC-02 | Login com sucesso | Usuário existente, credenciais corretas | `email=test@example.com`, `password=password` | `usersService.login(dto)` | Retorna `UserLoginResponseDTO` com `token="token123"` |
| TC-03 | Atualização com sucesso | Usuário encontrado pelo UUID | `id=<uuid>`, `email=newemail@example.com`, `username=newname` | `usersService.update(dto)` | Retorna `"Dados atualizados com sucesso"`, chama `save()` e atualiza o e-mail do objeto |
| TC-04 | Exclusão com sucesso | Nenhuma pré-condição de repositório | `email=test@example.com` | `usersService.delete(dto)` | Retorna `"Usuário Deletado com Sucesso!"` e chama `deleteByEmail()` |
| TC-05 | Consulta de detalhes com sucesso | Usuário encontrado pelo e-mail | `email=test@example.com` | `usersService.userDetails(dto)` | Retorna `UserdetailResponseDTO` com `uuid` e `username=testuser` |
| TC-06 | Registro com e-mail inválido | Nenhuma | `email=invalid-email` (sem `@`) | `usersService.register(dto)` | Lança `InvalidEmailException` |
| TC-07 | Registro com e-mail duplicado | E-mail já presente no repositório (`findByEmail` retorna `Users`) | `email=test@example.com` | `usersService.register(dto)` | Lança `InvalidEmailException` |
| TC-08 | Login com senha incorreta | `authenticationManager` lança exceção | `email=test@example.com`, `password=wrongpassword` | `usersService.login(dto)` | Lança `RuntimeException` com mensagem `"Bad credentials"` |
| TC-09 | Atualização com usuário não encontrado | `findById` retorna `Optional.empty()` | `id=<uuid>` inexistente | `usersService.update(dto)` | Lança `RuntimeException` |
| TC-10 | Consulta de detalhes com usuário não encontrado | `findUsersByEmail` retorna `Optional.empty()` | `email=nonexistent@example.com` | `usersService.userDetails(dto)` | Lança `RuntimeException` |

### 6. Critérios de Aceite

O sistema é considerado aprovado quando **100% dos 10 casos de teste passam** na execução de `mvn test`, sem falhas ou erros. Como os testes cobrem tanto os fluxos de sucesso quanto os de falha de todas as operações do serviço, nenhuma regressão parcial é aceitável para entrega.

### 7. Riscos e Limitações

- **Cobertura de integração:** os testes são estritamente unitários. Comportamentos relacionados à persistência real no PostgreSQL, filtros do Spring Security e geração/validação de JWT não são cobertos por esta suíte.
- **Validação de e-mail:** a lógica de validação é inferida pelo comportamento testado; o regex ou mecanismo exato utilizado internamente não é verificado diretamente.
- **Senha com hash:** os testes não verificam se a senha é armazenada com hash (ex: BCrypt) — apenas que `save()` é chamado. Um teste específico de segurança seria necessário para cobrir esse requisito.
- **Autenticação parcialmente coberta:** o teste de login com senha incorreta depende do comportamento do `AuthenticationManager` mockado; cenários como conta bloqueada ou token expirado não são simulados.
- **Ausência de testes de integração e E2E:** para validar as rotas REST (`/user/register`, `/user/login` etc.), seria necessária uma suíte adicional com `@SpringBootTest` e `MockMvc` ou testes de contrato.
