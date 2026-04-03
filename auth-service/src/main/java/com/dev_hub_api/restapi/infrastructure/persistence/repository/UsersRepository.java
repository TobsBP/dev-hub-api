package com.dev_hub_api.restapi.infrastructure.persistence.repository;

import com.dev_hub_api.restapi.domain.entity.user.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersRepository extends JpaRepository<Users, UUID> {
    UserDetails findByEmail(String email);
    Optional<Users> findUsersByEmail(String email);
    void deleteByEmail(String email);
}