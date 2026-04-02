package com.dev_hub_api.restapi.service;

import com.dev_hub_api.restapi.model.User;
import com.dev_hub_api.restapi.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

/**
 * Service responsible for User business logic.
 *
 * @Service tells Spring to manage this class as a service bean.
 * Spring injects UserRepository automatically via constructor (no explicit @Autowired needed).
 * Validations, business rules, and data transformations belong here.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String name, String github, String imgUrl) {
        User user = new User(name, github, imgUrl);
        return userRepository.save(user);
    }

    public Collection<User> listUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public boolean deleteUser(String id) {
        return userRepository.deleteById(id);
    }
}
