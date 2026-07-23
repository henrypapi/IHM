package com.ihm.project.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.ihm.project.dto.usuario.UsuarioCreateRequestDto;
import com.ihm.project.dto.usuario.UsuarioResponseDto;
import com.ihm.project.dto.usuario.UsuarioUpdateRequestDto;
import com.ihm.project.model.Usuario;
import com.ihm.project.model.tbl_intermedias.UsuarioRoles;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioResponseDto toDto(Usuario usuario);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    Usuario toEntity(UsuarioCreateRequestDto dto);

    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    void updateToEntity(UsuarioUpdateRequestDto dto, @MappingTarget Usuario entity);

    default List<String> map(List<UsuarioRoles> roles) {
        if (roles == null) {
            return List.of();
        }
        return roles.stream()
                .map(usuarioRol -> usuarioRol.getRol().getName())
                .toList();
    }
}
