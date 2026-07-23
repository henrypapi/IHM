package com.ihm.project.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ihm.project.model.Rol;
import java.util.Optional;


public interface RolRepository extends JpaRepository<Rol, Long>{
    Optional<Rol> findByName(String name);
}