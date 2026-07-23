package com.ihm.project.controller;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ihm.project.dto.meta.ServerTimeResponseDto;
import com.ihm.project.dto.meta.TicketOptionsResponseDto;
import com.ihm.project.enums.Estado;
import com.ihm.project.enums.Prioridad;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/meta")
@Tag(name = "Meta", description = "Endpoints auxiliares para el frontend")
public class MetaController {

    @Operation(summary = "Obtener hora actual del servidor")
    @GetMapping("/server-time")
    ResponseEntity<ServerTimeResponseDto> getServerTime() {
        return ResponseEntity.ok(new ServerTimeResponseDto(LocalDateTime.now().toString()));
    }

    @Operation(summary = "Obtener catalogos de tickets")
    @GetMapping("/ticket-options")
    ResponseEntity<TicketOptionsResponseDto> getTicketOptions() {
        return ResponseEntity.ok(new TicketOptionsResponseDto(
                Arrays.stream(Prioridad.values()).map(Enum::name).toList(),
                Arrays.stream(Estado.values()).map(Enum::name).toList()));
    }
}
