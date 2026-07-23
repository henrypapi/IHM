package com.ihm.project.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AsignacionRequestDto {
    @NotNull(message = "El ID del ticket no puede estar vacío")
    private Long idUsuarioAsignado;
    @NotBlank(message = "La prioridad no puede estar vacía")
    private String prioridad;
}