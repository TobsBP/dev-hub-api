package com.dev_hub_api.restapi.infrastructure.web.controller;

import com.dev_hub_api.restapi.application.dto.*;
import com.dev_hub_api.restapi.application.service.UsersService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UsersController {

    private final UsersService usersService;

    public UsersController(UsersService usersService){
        this.usersService = usersService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody @Valid UserRegisterDTO data){
        return ResponseEntity.ok(usersService.register(data));
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid UserLoginDTO data){
        return ResponseEntity.ok(usersService.login(data));
    }

    @PatchMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UserUpdateDTO data){
        return ResponseEntity.ok(usersService.update(data));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestBody @Valid UserUuidDTO data){
        return ResponseEntity.ok(usersService.delete(data));
    }

    @GetMapping()
    public ResponseEntity<UserdetailResponseDTO> UserDetails(@RequestBody @Valid UserUuidDTO data) {
        return ResponseEntity.ok(usersService.userDetails(data));
    }

}
