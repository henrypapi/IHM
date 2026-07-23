package com.ihm.project.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ihm.project.dto.ticket.AsignacionRequestDto;
import com.ihm.project.dto.ticket.TicketCreateRequestDto;
import com.ihm.project.dto.ticket.TicketResponseDto;
import com.ihm.project.enums.Estado;
import com.ihm.project.enums.Prioridad;
import com.ihm.project.exception.BadRequestException;
import com.ihm.project.exception.ForbiddenOperationException;
import com.ihm.project.exception.ResourceNotFoundException;
import com.ihm.project.mapper.TicketMapper;
import com.ihm.project.model.Categoria;
import com.ihm.project.model.Ticket;
import com.ihm.project.model.Usuario;
import com.ihm.project.repo.CategoriaRepository;
import com.ihm.project.repo.TicketRepository;
import com.ihm.project.repo.UserRepository;
import com.ihm.project.service.TicketService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final CategoriaRepository categoriaRepository;
    private final UserRepository usuarioRepository;
    private final TicketMapper ticketMapper;

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponseDto> findAll() {
        return ticketRepository.findAll().stream().map(ticketMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponseDto> findByIdUsuarioAsignado(Long userId) {
        return ticketRepository.findByUsuarioAsignadoId(userId).stream().map(ticketMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponseDto> findMyTicketsCreados() {
        Usuario usuario = getAuthenticatedUser();
        return ticketRepository.findByCreadoPorId(usuario.getId()).stream().map(ticketMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponseDto> findMyTicketsAsignados() {
        Usuario usuario = getAuthenticatedUser();
        return ticketRepository.findByUsuarioAsignadoId(usuario.getId()).stream().map(ticketMapper::toDto).toList();
    }

    @Override
    @Transactional
    public TicketResponseDto createTicket(TicketCreateRequestDto request) {
        Ticket ticket = ticketMapper.toEntity(request);
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontro la categoria con ID: " + request.getCategoriaId()));

        ticket.setTitulo(normalize(request.getTitulo()));
        ticket.setDescripcion(normalize(request.getDescripcion()));
        ticket.setCategoria(categoria);
        ticket.setCreadoPor(getAuthenticatedUser());

        return ticketMapper.toDto(ticketRepository.save(ticket));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el ticket con ID: " + id));

        Usuario usuario = getAuthenticatedUser();
        boolean isAdmin = usuario.getRoles().stream()
                .anyMatch(role -> role.getRol().getName().equals("ROLE_ADMIN"));
        boolean isOwner = ticket.getCreadoPor().getId().equals(usuario.getId());
        if (!isAdmin && !isOwner) {
            throw new ForbiddenOperationException("No puedes eliminar este ticket.");
        }

        ticketRepository.delete(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TicketResponseDto> findById(Long id) {
        return ticketRepository.findById(id).map(ticketMapper::toDto);
    }

    @Override
    @Transactional
    public void asignacionTicket(AsignacionRequestDto requestDto, Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el ticket con ID: " + ticketId));

        Usuario usuario = usuarioRepository.findById(requestDto.getIdUsuarioAsignado())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontro el usuario con ID: " + requestDto.getIdUsuarioAsignado()));

        ticket.setUsuarioAsignado(usuario);
        ticket.setEstado(Estado.EN_PROCESO);
        ticket.setFechaAsignacion(LocalDateTime.now());

        try {
            ticket.setPrioridad(Prioridad.valueOf(requestDto.getPrioridad().toUpperCase().trim()));
        } catch (IllegalArgumentException | NullPointerException exception) {
            throw new BadRequestException("La prioridad '" + requestDto.getPrioridad() + "' no es valida.");
        }

        ticketRepository.save(ticket);
    }

    @Override
    @Transactional
    public void culminarTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el ticket con ID: " + ticketId));

        Usuario tecnicoLogueado = getAuthenticatedUser();
        if (ticket.getUsuarioAsignado() == null ||
                !ticket.getUsuarioAsignado().getId().equals(tecnicoLogueado.getId())) {
            throw new ForbiddenOperationException(
                    "No tienes permisos para culminar este ticket porque no te esta asignado.");
        }

        ticket.setEstado(Estado.RESUELTO);
        ticket.setFechaCulminacion(LocalDateTime.now());
        ticketRepository.save(ticket);
    }

    private Usuario getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (Usuario) authentication.getPrincipal();
    }

    private String normalize(String value) {
        return value == null ? null : value.trim().replaceAll("\\s+", " ");
    }
}
