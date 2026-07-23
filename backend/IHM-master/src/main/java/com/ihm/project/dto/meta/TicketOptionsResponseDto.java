package com.ihm.project.dto.meta;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TicketOptionsResponseDto {
    private List<String> prioridades;
    private List<String> estados;
}
