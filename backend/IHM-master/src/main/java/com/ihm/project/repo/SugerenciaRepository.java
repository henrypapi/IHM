package com.ihm.project.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ihm.project.model.Sugerencia;

@Repository
public interface SugerenciaRepository extends JpaRepository<Sugerencia, Long> {
}
