package com.ihm.project.dto.auth;

import com.ihm.project.dto.usuario.UsuarioResponseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UsuarioResponseDto usuario;
}
