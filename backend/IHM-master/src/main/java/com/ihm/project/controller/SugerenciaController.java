package com.ihm.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ihm.project.dto.SugerenciaDTO;
import com.ihm.project.service.SugerenciaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sugerencias")
@RequiredArgsConstructor
@Tag(name = "Sugerencias", description = "API para gestionar sugerencias, comentarios y preferencias de los usuarios (Interacción Hombre-Máquina)")
public class SugerenciaController {

    private final SugerenciaService sugerenciaService;

    @Operation(summary = "Crear una nueva sugerencia", description = "Permite a un usuario enviar una nueva sugerencia, comentario o preferencia desde el frontend.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Sugerencia creada exitosamente",
                content = { @Content(mediaType = "application/json",
                schema = @Schema(implementation = SugerenciaDTO.class)) }),
        @ApiResponse(responseCode = "400", description = "Datos inválidos suministrados",
                content = @Content)
    })
    @PostMapping
    public ResponseEntity<SugerenciaDTO> createSugerencia(@RequestBody SugerenciaDTO dto) {
        SugerenciaDTO created = sugerenciaService.createSugerencia(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Obtener todas las sugerencias", description = "Retorna una lista de todas las sugerencias recibidas.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de sugerencias obtenida exitosamente",
                content = { @Content(mediaType = "application/json",
                schema = @Schema(implementation = SugerenciaDTO.class)) })
    })
    @GetMapping
    public ResponseEntity<List<SugerenciaDTO>> getAllSugerencias() {
        return ResponseEntity.ok(sugerenciaService.getAllSugerencias());
    }
}
