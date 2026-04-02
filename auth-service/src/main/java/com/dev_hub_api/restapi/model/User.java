package com.dev_hub_api.restapi.model;

import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class User {

    private String userId;
    private String name;
    private String github;
    private String img_url;

    public User(String name, String github, String img_url) {
        this.userId = UUID.randomUUID().toString();
        this.name = name;
        this.github = github;
        this.img_url = img_url;
    }
}
