package com.dev_hub_api.restapi.application.dto;

public record UserRegisterDTO(String username,
                              String email,
                              String password,
                              String bio,
                              String avatarUrl
                              ) {
}