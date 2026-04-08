package com.dev_hub_api.restapi.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserLoginDTO(
                             @Email @NotBlank String email,
                             @NotBlank String password){
}
