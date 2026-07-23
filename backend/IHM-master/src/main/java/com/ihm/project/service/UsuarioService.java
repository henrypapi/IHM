package com.ihm.project.service;

import java.util.List;
import java.util.Optional;

import com.ihm.project.dto.usuario.UsuarioCreateRequestDto;
import com.ihm.project.dto.usuario.UsuarioResponseDto;
import com.ihm.project.dto.usuario.UsuarioUpdateRequestDto;

public interface UsuarioService {
    List<UsuarioResponseDto> findAll();

    Optional<UsuarioResponseDto> findById(Long id);

    UsuarioResponseDto save(UsuarioCreateRequestDto request);

    void deleteById(Long id);

    UsuarioResponseDto update(Long id, UsuarioUpdateRequestDto request);
}
