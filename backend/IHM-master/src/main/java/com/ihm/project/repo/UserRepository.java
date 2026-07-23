package com.ihm.project.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ihm.project.model.Usuario;

public interface UserRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByEmailOrUsername(String email, String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
