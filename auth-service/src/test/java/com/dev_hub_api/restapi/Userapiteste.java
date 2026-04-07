package com.dev_hub_api.restapi;

import com.dev_hub_api.restapi.application.dto.*;
import io.qameta.allure.*;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.DisplayName.class)
@Epic("DevHub API")
@Feature("/user endpoints")
@DisplayName("DevHub API – /user")
class UserApiTest {

    static {
        RestAssured.baseURI = System.getProperty("BASE_URL", "http://localhost:9090");
        RestAssured.proxy = null;
    }

    private String uniqueEmail(String prefix) {
        return prefix + "_" + System.currentTimeMillis() + "@test.com";
    }

    private Response registerUser(String email) {
        UserRegisterDTO dto = new UserRegisterDTO(
                "testuser",
                email,
                "Senha@123",
                "Usuário de teste",
                "https://avatar.test/img.png"
        );
        return given().body(dto).when().post("/user/register");
    }

    private Response loginUser(String email, String password) {
        UserLoginDTO dto = new UserLoginDTO(email, password);
        return given().body(dto).when().post("/user/login");
    }

    private RequestSpecification given() {
        return RestAssured.given().contentType(ContentType.JSON);
    }

    /**
     * [FALHA INTENCIONAL] Espera status 201, mas a API retorna 200.
     */
    @Test
    @Story("Registro")
    @Severity(SeverityLevel.BLOCKER)
    @DisplayName("TC-001 | Registro com dados válidos retorna 201")
    void tc001_registroValido_retorna201() {
        Response res = registerUser(uniqueEmail("user"));

        assertEquals(201, res.statusCode(),
                "Status esperado 201 para registro com dados válidos, mas foi: " + res.statusCode());
        assertNotNull(res.body().asString(), "Body não deve ser nulo");
        assertFalse(res.body().asString().isBlank(), "Body não deve ser vazio");
    }

    @Test
    @Story("Registro")
    @Severity(SeverityLevel.CRITICAL)
    @DisplayName("TC-002 | Registro sem campo obrigatório (email) retorna 4xx")
    void tc002_registroSemEmail_retorna4xx() {
        UserRegisterDTO dto = new UserRegisterDTO("sem_email", null, "Senha@123", "bio", "");
        Response res = given().body(dto).when().post("/user/register");

        assertTrue(res.statusCode() >= 400,
                "Status deve ser >= 400 quando e-mail está ausente, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Registro")
    @Severity(SeverityLevel.CRITICAL)
    @DisplayName("TC-003 | Registro sem senha aceito com 200")
    void tc003_registroSemSenha_retorna200() {
        UserRegisterDTO dto = new UserRegisterDTO("sem_senha", uniqueEmail("nopass"), null, "bio", "");
        Response res = given().body(dto).when().post("/user/register");

        assertEquals(200, res.statusCode(),
                "Status esperado 200 para registro sem senha, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Registro")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-004 | Registro com email duplicado retorna 4xx")
    void tc004_registroEmailDuplicado_retorna4xx() {
        String email = uniqueEmail("dup");
        registerUser(email);

        Response res = registerUser(email);

        assertTrue(res.statusCode() >= 400,
                "Status deve ser >= 400 para e-mail duplicado, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Registro")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-005 | Registro com email inválido aceito com 200")
    void tc005_registroEmailMalFormatado_retorna200() {
        UserRegisterDTO dto = new UserRegisterDTO("bad_email", "nao-e-um-email", "Senha@123", "", "");
        Response res = given().body(dto).when().post("/user/register");

        assertEquals(200, res.statusCode(),
                "Status esperado 200 para e-mail mal formatado, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Registro")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-006 | Registro com body vazio retorna 4xx")
    void tc006_registroBodyVazio_retorna4xx() {
        UserRegisterDTO dto = new UserRegisterDTO(null, null, null, null, null);
        Response res = given().body(dto).when().post("/user/register");

        assertTrue(res.statusCode() >= 400,
                "Status deve ser >= 400 para body vazio, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Login")
    @Severity(SeverityLevel.BLOCKER)
    @DisplayName("TC-007 | Login com credenciais válidas retorna body vazio")
    void tc007_loginValido_retornaBodyVazio() {
        String email = uniqueEmail("login");
        registerUser(email);

        Response res = loginUser(email, "Senha@123");

        assertEquals(200, res.statusCode(),
                "Status esperado 200 para login com credenciais válidas");
        assertTrue(res.body().asString().isBlank(),
                "Body deveria estar vazio, mas contém: " + res.body().asString());
    }

    @Test
    @Story("Login")
    @Severity(SeverityLevel.CRITICAL)
    @DisplayName("TC-008 | Login com senha errada retorna 4xx")
    void tc008_loginSenhaErrada_retorna4xx() {
        String email = uniqueEmail("wrongpwd");
        registerUser(email);

        Response res = loginUser(email, "SenhaErrada999");

        assertTrue(res.statusCode() >= 400,
                "Status deve ser >= 400 para senha incorreta, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Login")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-009 | Login com email inexistente aceito com 200")
    void tc009_loginEmailInexistente_retorna200() {
        Response res = loginUser("inexistente@test.com", "Senha@123");

        assertEquals(200, res.statusCode(),
                "Status esperado 200 para e-mail inexistente, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Login")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-010 | Login sem email retorna 4xx")
    void tc010_loginSemEmail_retorna4xx() {
        UserLoginDTO dto = new UserLoginDTO(null, "Senha@123");
        Response res = given().body(dto).when().post("/user/login");

        assertTrue(res.statusCode() >= 400,
                "Status deve ser >= 400 quando e-mail está ausente no login, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Login")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-011 | Login sem senha aceito com 200")
    void tc011_loginSemSenha_retorna200() {
        UserLoginDTO dto = new UserLoginDTO("alguem@test.com", null);
        Response res = given().body(dto).when().post("/user/login");

        assertEquals(200, res.statusCode(),
                "Status esperado 200 quando senha está ausente, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Detalhes do Usuário")
    @Severity(SeverityLevel.BLOCKER)
    @DisplayName("TC-012 | Detalhes com email válido retorna 200 e dados do usuário")
    void tc012_detalhesEmailValido_retorna200EDados() {
        String email = uniqueEmail("details");
        registerUser(email);

        UserUuidDTO dto = new UserUuidDTO(email);
        Response res = given().body(dto).when().get("/user");

        assertEquals(200, res.statusCode(),
                "Status esperado 200 para consulta de usuário existente");
        assertEquals(email, res.jsonPath().getString("email"),
                "E-mail retornado deve ser igual ao e-mail cadastrado");
    }

    @Test
    @Story("Detalhes do Usuário")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-013 | Detalhes com email inexistente retorna 200")
    void tc013_detalhesEmailInexistente_retorna200() {
        UserUuidDTO dto = new UserUuidDTO("ghost@test.com");
        Response res = given().body(dto).when().get("/user");

        assertEquals(200, res.statusCode(),
                "Status esperado 200 para e-mail inexistente, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Detalhes do Usuário")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-014 | Detalhes sem corpo retorna 4xx")
    void tc014_detalhesSemBody_retorna4xx() {
        UserUuidDTO dto = new UserUuidDTO(null);
        Response res = given().body(dto).when().get("/user");

        assertTrue(res.statusCode() >= 400,
                "Status deve ser >= 400 para body vazio em GET /user, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Atualização")
    @Severity(SeverityLevel.BLOCKER)
    @DisplayName("TC-015 | Atualização com dados válidos retorna 201")
    void tc015_atualizacaoDadosValidos_retorna201() {
        String email = uniqueEmail("upd");
        Response regRes = registerUser(email);

        String userId = regRes.body().asString().replaceAll("\"", "").trim();

        UserUpdateDTO dto = new UserUpdateDTO(
                java.util.UUID.fromString(userId),
                email,
                "Nome Atualizado",
                "NovaSenha@456",
                "Bio nova",
                "https://avatar.test/new.png"
        );

        Response res = given().body(dto).when().patch("/user/update");

        assertEquals(201, res.statusCode(),
                "Status esperado 201 para atualização com dados válidos, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Atualização")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-016 | Atualização com id inexistente/inválido retorna 4xx")
    void tc016_atualizacaoIdInexistente_retorna4xx() {
        UserUpdateDTO dto = new UserUpdateDTO(
                java.util.UUID.fromString("00000000-0000-0000-0000-000000000000"),
                "x@x.com",
                "X",
                "Abc@123",
                "",
                ""
        );

        Response res = given().body(dto).when().patch("/user/update");

        assertTrue(res.statusCode() >= 400,
                "Status deve ser >= 400 para UUID inexistente, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Atualização")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-017 | Atualização com body vazio aceita com 200")
    void tc017_atualizacaoBodyVazio_retorna200() {
        UserUpdateDTO dto = new UserUpdateDTO(null, null, null, null, null, null);
        Response res = given().body(dto).when().patch("/user/update");

        assertEquals(200, res.statusCode(),
                "Status esperado 200 para body vazio em PATCH /user/update, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Exclusão")
    @Severity(SeverityLevel.BLOCKER)
    @DisplayName("TC-018 | Exclusão com email válido retorna 200")
    void tc018_exclusaoEmailValido_retorna200() {
        String email = uniqueEmail("del");
        registerUser(email);

        UserUuidDTO dto = new UserUuidDTO(email);
        Response res = given().body(dto).when().delete("/user/delete");

        assertEquals(200, res.statusCode(),
                "Status esperado 200 para exclusão de usuário existente");
    }

    @Test
    @Story("Exclusão")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-019 | Exclusão com email inexistente aceita com 200")
    void tc019_exclusaoEmailInexistente_retorna200() {
        UserUuidDTO dto = new UserUuidDTO("naoexiste@test.com");
        Response res = given().body(dto).when().delete("/user/delete");

        assertEquals(200, res.statusCode(),
                "Status esperado 200 para exclusão de e-mail inexistente, mas foi: " + res.statusCode());
    }

    @Test
    @Story("Exclusão")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("TC-020 | Exclusão sem body retorna 4xx")
    void tc020_exclusaoSemBody_retorna4xx() {
        UserUuidDTO dto = new UserUuidDTO(null);
        Response res = given().body(dto).when().delete("/user/delete");

        assertTrue(res.statusCode() >= 400,
                "Status deve ser >= 400 para body vazio em DELETE /user/delete, mas foi: " + res.statusCode());
    }
}