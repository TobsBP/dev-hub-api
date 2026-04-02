package com.dev_hub_api.restapi.repository;

import com.dev_hub_api.restapi.model.User;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * In-memory repository for User.
 *
 * @Repository tells Spring to manage this class as a data-access bean.
 * When JPA + a database are added, this becomes an interface extending JpaRepository<User, String>
 * and Spring provides the implementation automatically.
 */
@Repository
public class UserRepository {

    private final Map<String, User> store = new HashMap<>();

    public User save(User user) {
        store.put(user.getUserId(), user);
        return user;
    }

    public Collection<User> findAll() {
        return store.values();
    }

    public Optional<User> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public boolean deleteById(String id) {
        return store.remove(id) != null;
    }
}
