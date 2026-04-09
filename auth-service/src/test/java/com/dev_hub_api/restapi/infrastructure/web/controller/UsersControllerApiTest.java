package com.dev_hub_api.restapi.infrastructure.web.controller;

import com.dev_hub_api.restapi.application.dto.UserLoginDTO;
import com.dev_hub_api.restapi.application.dto.UserLoginResponseDTO;
import com.dev_hub_api.restapi.application.dto.UserRegisterDTO;
import com.dev_hub_api.restapi.application.dto.UserUpdateDTO;
import com.dev_hub_api.restapi.application.dto.UserUuidDTO;
import com.dev_hub_api.restapi.application.dto.UserdetailResponseDTO;
import com.dev_hub_api.restapi.application.service.UsersService;
import com.dev_hub_api.restapi.infrastructure.persistence.repository.UsersRepository;
import com.dev_hub_api.restapi.infrastructure.security.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UsersController.class)
@AutoConfigureMockMvc(addFilters = false)
class UsersControllerApiTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private UsersService usersService;

    @MockitoBean
    private TokenService tokenService;

    @MockitoBean
    private UsersRepository usersRepository;

    @Test
    void registerUser_ShouldReturnOk_WhenRequestIsValid() throws Exception {
        var request = new UserRegisterDTO("testuser", "test@example.com", "password", "bio", "avatar");
        when(usersService.register(any(UserRegisterDTO.class))).thenReturn("Usuário Registrado com sucesso");

        mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuário Registrado com sucesso"));

        verify(usersService).register(any(UserRegisterDTO.class));
    }

    @Test
    void registerUser_ShouldReturnBadRequest_WhenEmailIsInvalid() throws Exception {
        var request = new UserRegisterDTO("testuser", "invalid-email", "password", "bio", "avatar");

        mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("must be a well-formed email address")));

        verify(usersService, never()).register(any(UserRegisterDTO.class));
    }

    @Test
    void loginUser_ShouldReturnToken_WhenRequestIsValid() throws Exception {
        var request = new UserLoginDTO("test@example.com", "password");
        when(usersService.login(any(UserLoginDTO.class))).thenReturn(new UserLoginResponseDTO("token123"));

        mockMvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token123"));

        verify(usersService).login(any(UserLoginDTO.class));
    }

    @Test
    void loginUser_ShouldReturnBadRequest_WhenEmailIsInvalid() throws Exception {
        var request = new UserLoginDTO("invalid-email", "password");

        mockMvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("must be a well-formed email address")));

        verify(usersService, never()).login(any(UserLoginDTO.class));
    }

    @Test
    void getUserDetails_ShouldReturnUser_WhenEmailExists() throws Exception {
        var request = new UserUuidDTO("test@example.com");
        var createdAt = Timestamp.from(Instant.parse("2026-01-01T00:00:00Z"));
        when(usersService.userDetails(any(UserUuidDTO.class)))
                .thenReturn(new UserdetailResponseDTO(UUID.randomUUID(), "test@example.com", "testuser", "bio", "avatar", createdAt));

        mockMvc.perform(get("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(usersService).userDetails(any(UserUuidDTO.class));
    }

    @Test
    void getUserDetails_ShouldReturnBadRequest_WhenUserDoesNotExist() throws Exception {
        var request = new UserUuidDTO("missing@example.com");
        when(usersService.userDetails(any(UserUuidDTO.class)))
                .thenThrow(new RuntimeException("Usuario nao encontrado"));

        mockMvc.perform(get("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Usuario nao encontrado"));
    }

    @Test
    void updateUser_ShouldReturnOk_WhenRequestIsValid() throws Exception {
        UUID id = UUID.randomUUID();
        var request = new UserUpdateDTO(id, "updated@example.com", "updatedname", "newpass", "newbio", "newavatar");
        when(usersService.update(any(UserUpdateDTO.class))).thenReturn("Dados atualizados com sucesso");

        mockMvc.perform(patch("/user/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Dados atualizados com sucesso"));

        verify(usersService).update(any(UserUpdateDTO.class));
    }

    @Test
    void updateUser_ShouldReturnBadRequest_WhenUserDoesNotExist() throws Exception {
        UUID id = UUID.randomUUID();
        var request = new UserUpdateDTO(id, "updated@example.com", "updatedname", "newpass", "newbio", "newavatar");
        when(usersService.update(any(UserUpdateDTO.class)))
                .thenThrow(new RuntimeException("Usuario nao encontrado"));

        mockMvc.perform(patch("/user/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Usuario nao encontrado"));
    }

    @Test
    void deleteUser_ShouldReturnOk_WhenRequestIsValid() throws Exception {
        var request = new UserUuidDTO("test@example.com");
        when(usersService.delete(any(UserUuidDTO.class))).thenReturn("Usuário Deletado com Sucesso!");

        mockMvc.perform(delete("/user/delete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuário Deletado com Sucesso!"));

        verify(usersService).delete(any(UserUuidDTO.class));
    }

    @Test
    void deleteUser_ShouldReturnBadRequest_WhenEmailIsBlank() throws Exception {
        var request = new UserUuidDTO("");

        mockMvc.perform(delete("/user/delete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("must not be blank")));

        verify(usersService, never()).delete(any(UserUuidDTO.class));
    }

}
