package com.dev_hub_api.restapi.domain.entity.user;

public enum UserRole {
    CLIENT("client"),
    ADM("admin");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}
