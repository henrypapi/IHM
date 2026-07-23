package com.ihm.project.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TicketCreateRequestDto {
    @NotBlank(message = "El titulo no puede estar vacio.")
    @Size(min = 5, max = 120, message = "El titulo debe tener entre 5 y 120 caracteres.")
    @Pattern(regexp = "^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s.,\\-_!?¿¡()]*$", message = "El título contiene caracteres inválidos")
    private String titulo;

    @NotBlank(message = "La descripcion no puede estar vacia.")
    @Size(min = 10, max = 1000, message = "La descripcion debe tener entre 10 y 1000 caracteres.")
    @Pattern(regexp = "^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s.,\\-_!?¿¡()\\r\\n]*$", message = "La descripción contiene caracteres inválidos")
    private String descripcion;

    @Positive(message = "La categoria debe ser un identificador valido.")
    private Long categoriaId;
}
