package com.dev_hub_api.restapi.application.dto;

import java.sql.Timestamp;
import java.util.UUID;

public record UserdetailResponseDTO(UUID uuid,
                                    String username,
                                    String email,
                                    String bio,
                                    String avataUrl,
                                    Timestamp created_at) {
}
