package com.ihm.project.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ihm.project.model.Ticket;
import java.util.List;


public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUsuarioAsignadoId(Long id);

    List<Ticket> findByCreadoPorId(Long id);
}