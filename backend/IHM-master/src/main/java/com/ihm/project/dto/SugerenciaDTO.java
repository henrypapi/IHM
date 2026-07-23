package com.ihm.project.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SugerenciaDTO {
    private Long id;
    
    @NotBlank(message = "El tipo no puede estar vacío")
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "El tipo contiene caracteres inválidos")
    private String tipo;
    
    @NotBlank(message = "El mensaje no puede estar vacío")
    @Size(max = 2000, message = "El mensaje es demasiado largo")
    @Pattern(regexp = "^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s.,\\-_!?¿¡()\\r\\n]*$", message = "El mensaje contiene caracteres inválidos")
    private String mensaje;
    
    @Pattern(regexp = "^[A-Z_]*$", message = "Estado inválido")
    private String estado;
    private LocalDateTime fechaCreacion;
    private Long usuarioId; // Optional, can be null for anonymous suggestions
}
