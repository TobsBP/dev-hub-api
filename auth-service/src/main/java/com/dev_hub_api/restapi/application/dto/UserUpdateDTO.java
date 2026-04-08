package com.dev_hub_api.restapi.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UserUpdateDTO(
                            @NotNull UUID id,
                            @Email String email,
                            String name,
                            String password,
                            String bio,
                            String avatarUrl
                            ) {
}
