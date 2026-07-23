package com.ihm.project.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ihm.project.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Optional<Categoria> findByNombre(String nombre);
}
