//package com.dev_hub_api.restapi.application.service;
//
//import com.dev_hub_api.restapi.application.dto.*;
//import com.dev_hub_api.restapi.domain.entity.user.UserRole;
//import com.dev_hub_api.restapi.domain.entity.user.Users;
//import com.dev_hub_api.restapi.domain.exception.InvalidEmailException;
//import com.dev_hub_api.restapi.infrastructure.persistence.repository.UsersRepository;
//import com.dev_hub_api.restapi.infrastructure.security.TokenService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//
//import java.util.Optional;
//import java.util.UUID;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
//class UsersServiceTest {
//
//    @Mock
//    private UsersRepository usersRepository;
//
//    @Mock
//    private AuthenticationManager authenticationManager;
//
//    @Mock
//    private TokenService tokenService;
//
//    @InjectMocks
//    private UsersService usersService;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void testRegister_Success() {
//        UserRegisterDTO dto = new UserRegisterDTO("testuser", "test@example.com", "password", "bio", "avatar");
//        when(usersRepository.findByEmail("test@example.com")).thenReturn(null);
//        when(usersRepository.save(any(Users.class))).thenReturn(new Users());
//
//        String result = usersService.register(dto);
//
//        assertEquals("Usuário Registrado com sucesso", result);
//        verify(usersRepository).save(any(Users.class));
//    }
//
//    @Test
//    void testLogin_Success() {
//        UserLoginDTO dto = new UserLoginDTO("test@example.com", "password");
//        Users user = new Users("testuser", "test@example.com", "password", "bio", "avatar", UserRole.CLIENT);
//        Authentication auth = mock(Authentication.class);
//        when(auth.getPrincipal()).thenReturn(user);
//        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
//        when(tokenService.generateToken(user)).thenReturn("token123");
//
//        UserLoginResponseDTO result = usersService.login(dto);
//
//        assertEquals("token123", result.token());
//    }
//
//    @Test
//    void testUpdate_Success() {
//        UUID id = UUID.randomUUID();
//        UserUpdateDTO dto = new UserUpdateDTO(id, "newemail@example.com", "newname", "newpass", "newbio", "newavatar");
//        Users user = new Users("oldname", "old@example.com", "oldpass", "oldbio", "oldavatar", UserRole.CLIENT);
//        when(usersRepository.findById(id)).thenReturn(Optional.of(user));
//
//        String result = usersService.update(dto);
//
//        assertEquals("Dados atualizados com sucesso", result);
//        verify(usersRepository).save(user);
//        assertEquals("newemail@example.com", user.getEmail());
//    }
//
//    @Test
//    void testDelete_Success() {
//        UserUuidDTO dto = new UserUuidDTO("test@example.com");
//
//        String result = usersService.delete(dto);
//
//        assertEquals("Usuário Deletado com Sucesso!", result);
//        verify(usersRepository).deleteByEmail("test@example.com");
//    }
//
//    @Test
//    void testUserDetails_Success() {
//        UserUuidDTO dto = new UserUuidDTO("test@example.com");
//        Users user = new Users("testuser", "test@example.com", "password", "bio", "avatar", UserRole.CLIENT);
//        when(usersRepository.findUsersByEmail("test@example.com")).thenReturn(Optional.of(user));
//
//        UserdetailResponseDTO result = usersService.userDetails(dto);
//
//        assertEquals(user.getId(), result.uuid());
//        assertEquals("testuser", result.username());
//    }
//
//    @Test
//    void testRegister_InvalidEmail() {
//        UserRegisterDTO dto = new UserRegisterDTO("testuser", "invalid-email", "password", "bio", "avatar");
//
//        assertThrows(InvalidEmailException.class, () -> usersService.register(dto));
//    }
//
//    @Test
//    void testRegister_DuplicateEmail() {
//        UserRegisterDTO dto = new UserRegisterDTO("testuser", "test@example.com", "password", "bio", "avatar");
//        when(usersRepository.findByEmail("test@example.com")).thenReturn(new Users());
//
//        assertThrows(InvalidEmailException.class, () -> usersService.register(dto));
//    }
//
//    @Test
//    void testLogin_WrongPassword() {
//        UserLoginDTO dto = new UserLoginDTO("test@example.com", "wrongpassword");
//        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
//            .thenThrow(new RuntimeException("Bad credentials"));
//
//        assertThrows(RuntimeException.class, () -> usersService.login(dto));
//    }
//
//    @Test
//    void testUpdate_UserNotFound() {
//        UUID id = UUID.randomUUID();
//        UserUpdateDTO dto = new UserUpdateDTO(id, "newemail@example.com", "newname", "newpass", "newbio", "newavatar");
//        when(usersRepository.findById(id)).thenReturn(Optional.empty());
//
//        assertThrows(RuntimeException.class, () -> usersService.update(dto));
//    }
//
//    @Test
//    void testUserDetails_UserNotFound() {
//        UserUuidDTO dto = new UserUuidDTO("nonexistent@example.com");
//        when(usersRepository.findUsersByEmail("nonexistent@example.com")).thenReturn(Optional.empty());
//
//        assertThrows(RuntimeException.class, () -> usersService.userDetails(dto));
//    }
//}