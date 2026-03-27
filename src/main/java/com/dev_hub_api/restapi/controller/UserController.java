package com.dev_hub_api.restapi.controller;

import com.dev_hub_api.restapi.model.User;
import com.dev_hub_api.restapi.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;

/**
 * REST controller for the User resource.
 *
 * @RestController = @Controller + @ResponseBody: returns JSON automatically.
 * @RequestMapping defines the base route for all methods in this controller.
 * Spring injects UserService via constructor.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /users → returns all users
    @GetMapping
    public Collection<User> listUsers() {
        return userService.listUsers();
    }

    // GET /users/{id} → returns a user by id
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /users → creates a new user
    // JSON body: { "name": "...", "github": "...", "img_url": "..." }
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, String> body) {
        User created = userService.createUser(
                body.get("name"),
                body.get("github"),
                body.get("img_url")
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // DELETE /users/{id} → removes a user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        boolean removed = userService.deleteUser(id);
        return removed
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
