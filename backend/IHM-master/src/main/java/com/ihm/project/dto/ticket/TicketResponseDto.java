package com.ihm.project.dto.ticket;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TicketResponseDto {
    private Long id;
    private String titulo;
    private String descripcion;
    private String fechaRegistro;
    private String fechaAsignacion;
    private String fechaCulminacion;
    private String prioridad;
    private String estado;
    private TicketCategoryDto categoria;
    private TicketUserDto usuarioAsignado;
    private TicketUserDto creadoPor;
}
