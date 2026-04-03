package com.dev_hub_api.restapi.application.service;

import com.dev_hub_api.restapi.application.dto.*;
import com.dev_hub_api.restapi.domain.entity.user.UserRole;
import com.dev_hub_api.restapi.domain.entity.user.Users;
import com.dev_hub_api.restapi.domain.exception.InvalidEmailException;
import com.dev_hub_api.restapi.infrastructure.persistence.repository.UsersRepository;
import com.dev_hub_api.restapi.infrastructure.security.TokenService;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class UsersService {
    private final UsersRepository usersRepository;

    private AuthenticationManager authenticationManager;

    private TokenService tokenService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[a-z]+$");

    public UsersService(UsersRepository usersRepository, TokenService tokenService, AuthenticationManager authenticationManager){
        this.usersRepository = usersRepository;
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    public String register(UserRegisterDTO dto){
        String encryptedPassword = new BCryptPasswordEncoder().encode(dto.password());
        Users user = new Users(dto.username(),
                validateEmail(dto.email()),
                encryptedPassword,
                dto.bio(),
                dto.avatarUrl(),
                UserRole.CLIENT);
        usersRepository.save(user);
        return "Usuário Registrado com sucesso";
    }

    public UserLoginResponseDTO login (UserLoginDTO dto){
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.email(),dto.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((Users) auth.getPrincipal());

        return new UserLoginResponseDTO(token);
    }

    public String update(UserUpdateDTO dto){
        Users users  = usersRepository.findById(dto.id()).orElseThrow(()->new RuntimeException("Usuario nao encontrado"));
        if(dto.email() != null){
            users.setEmail(dto.email());
        }
        if(dto.name() != null){
            users.setUsername(dto.name());
        }
        if (dto.password() != null){
            users.setPassword(dto.password());
        }
        if (dto.bio() != null){
            users.setBio(dto.bio());
        }
        if (dto.avatarUrl() != null){
            users.setAvatarUrl(dto.avatarUrl());
        }
        usersRepository.save(users);
        return "Dados atualizados com sucesso";
    }

    @Transactional
    public String delete(UserUuidDTO dto){
        usersRepository.deleteByEmail(dto.email());
        return "Usuário Deletado com Sucesso!";
    }

    public UserdetailResponseDTO userDetails(UserUuidDTO dto){
        Users user = usersRepository.findUsersByEmail(dto.email()).orElseThrow(() -> new RuntimeException("Usuario não encontrado"));

        return new UserdetailResponseDTO(user.getId(),user.getUsername(),user.getEmail(),user.getBio(),user.getAvatarUrl(),user.getCreatedAt());
    }

    private String validateEmail(String email){
        if(usersRepository.findByEmail(email) != null || email == null || !EMAIL_PATTERN.matcher(email).matches()){
            throw new InvalidEmailException("Email Invalido por favor digite um email valido");
        }
        return email;
    }
}
