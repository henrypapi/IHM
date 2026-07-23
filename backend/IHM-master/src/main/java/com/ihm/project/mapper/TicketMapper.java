package com.ihm.project.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ihm.project.dto.ticket.TicketCreateRequestDto;
import com.ihm.project.dto.ticket.TicketResponseDto;
import com.ihm.project.model.Ticket;

@Mapper(componentModel = "spring")
public interface TicketMapper {
    @Mapping(source = "fechaRegistro", target = "fechaRegistro", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(source = "fechaAsignacion", target = "fechaAsignacion", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(source = "fechaCulminacion", target = "fechaCulminacion", dateFormat = "yyyy-MM-dd HH:mm:ss")
    TicketResponseDto toDto(Ticket ticket);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "creadoPor", ignore = true)
    @Mapping(target = "usuarioAsignado", ignore = true)
    @Mapping(target = "fechaRegistro", ignore = true)
    @Mapping(target = "fechaAsignacion", ignore = true)
    @Mapping(target = "fechaCulminacion", ignore = true)
    @Mapping(target = "prioridad", ignore = true)
    @Mapping(target = "estado", ignore = true)
    Ticket toEntity(TicketCreateRequestDto dto);
}
