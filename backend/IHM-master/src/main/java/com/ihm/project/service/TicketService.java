package com.ihm.project.service;

import java.util.List;
import java.util.Optional;

import com.ihm.project.dto.ticket.AsignacionRequestDto;
import com.ihm.project.dto.ticket.TicketCreateRequestDto;
import com.ihm.project.dto.ticket.TicketResponseDto;

public interface TicketService {
    List<TicketResponseDto> findAll();

    Optional<TicketResponseDto> findById(Long id);

    List<TicketResponseDto> findByIdUsuarioAsignado(Long userId);

    List<TicketResponseDto> findMyTicketsCreados();

    List<TicketResponseDto> findMyTicketsAsignados();

    TicketResponseDto createTicket(TicketCreateRequestDto request);

    void deleteById(Long id);

    void asignacionTicket(AsignacionRequestDto requestDto, Long ticketId);

    void culminarTicket(Long ticketId);
}
