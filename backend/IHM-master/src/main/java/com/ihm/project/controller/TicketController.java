package com.ihm.project.controller;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ihm.project.dto.ticket.AsignacionRequestDto;
import com.ihm.project.dto.ticket.TicketCreateRequestDto;
import com.ihm.project.dto.ticket.TicketResponseDto;
import com.ihm.project.service.TicketService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/ticket")
@RequiredArgsConstructor
@Tag(name = "Tickets", description = "Controlador para la gestion completa de tickets del sistema")
public class TicketController {

    private final TicketService ticketService;

    @Operation(summary = "Obtener mis tickets creados", description = "Mis tickets creados")
    @GetMapping("/my-tickets-created")
    ResponseEntity<List<TicketResponseDto>> findMyTicketCreados() {
        requireAnyRole("ROLE_USER", "ROLE_ADMIN");
        return ResponseEntity.ok(ticketService.findMyTicketsCreados());
    }

    @Operation(summary = "Obtener mis tickets asignados", description = "Mis tickets asignados")
    @GetMapping("/my-tickets")
    ResponseEntity<List<TicketResponseDto>> findMyTicketAsignados() {
        requireAnyRole("ROLE_TI", "ROLE_ADMIN");
        return ResponseEntity.ok(ticketService.findMyTicketsAsignados());
    }

    @Operation(summary = "Obtener tickets por ID de usuario",
            description = "Busca tickets utilizando el identificador unico de un usuario")
    @GetMapping("/usuario/{userId}")
    ResponseEntity<List<TicketResponseDto>> findTicketsByUserId(@PathVariable Long userId) {
        requireAnyRole("ROLE_ADMIN");
        return ResponseEntity.ok(ticketService.findByIdUsuarioAsignado(userId));
    }

    @Operation(summary = "Obtener todos los tickets")
    @GetMapping
    ResponseEntity<List<TicketResponseDto>> findAllTickets() {
        requireAnyRole("ROLE_ADMIN");
        return ResponseEntity.ok(ticketService.findAll());
    }

    @Operation(summary = "Obtener ticket por ID", description = "Busca un ticket utilizando su identificador unico")
    @GetMapping("/{id}")
    ResponseEntity<Optional<TicketResponseDto>> findTicketById(@PathVariable Long id) {
        requireAnyRole("ROLE_ADMIN");
        return ResponseEntity.ok(ticketService.findById(id));
    }

    @Operation(summary = "Crear ticket")
    @PostMapping
    ResponseEntity<TicketResponseDto> createTicket(@RequestBody @Valid TicketCreateRequestDto requestDto) {
        requireAnyRole("ROLE_USER", "ROLE_ADMIN");
        TicketResponseDto createdTicket = ticketService.createTicket(requestDto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdTicket.getId())
                .toUri();
        return ResponseEntity.created(location).body(createdTicket);
    }

    @Operation(summary = "Eliminar ticket por ID")
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteTicketById(@PathVariable Long id) {
        requireAnyRole("ROLE_ADMIN", "ROLE_USER");
        ticketService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Asignacion de tickets",
            description = "Permite asignar un ticket a un usuario y establecer su prioridad")
    @PutMapping("/{id}/asignacion")
    public ResponseEntity<String> asignarTicket(
            @PathVariable Long id,
            @RequestBody AsignacionRequestDto requestDto) {
        requireAnyRole("ROLE_ADMIN");
        ticketService.asignacionTicket(requestDto, id);
        return ResponseEntity.ok("Ticket asignado correctamente.");
    }

    @Operation(summary = "Culminar ticket", description = "Permite culminar un ticket")
    @PutMapping("/{id}/culminar")
    public ResponseEntity<String> culminarTicket(@PathVariable Long id) {
        requireAnyRole("ROLE_TI", "ROLE_ADMIN");
        ticketService.culminarTicket(id);
        return ResponseEntity.ok("Ticket culminado correctamente.");
    }

    private void requireAnyRole(String... roles) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean allowed = authentication.getAuthorities().stream()
                .anyMatch(authority -> java.util.Arrays.asList(roles).contains(authority.getAuthority()));
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permisos para este recurso.");
        }
    }
}
