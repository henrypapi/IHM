package com.ihm.project.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ihm.project.dto.usuario.UsuarioCreateRequestDto;
import com.ihm.project.dto.usuario.UsuarioResponseDto;
import com.ihm.project.dto.usuario.UsuarioUpdateRequestDto;
import com.ihm.project.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1/usuario")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Controlador para la gestión completa de usuarios del sistema")
public class UsuarioController {

    private final UsuarioService usuarioServ;

    @Operation(summary = "Obtener usuario autenticado")
    @GetMapping("/me")
    ResponseEntity<UsuarioResponseDto> findCurrentUsuario() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return usuarioServ.findAll().stream()
                .filter(usuario -> usuario.getEmail().equals(email))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PARA ADMINISTRADORES
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtener los Usuarios")
    @GetMapping()
    ResponseEntity<List<UsuarioResponseDto>> findAllUsuarios() {
        return ResponseEntity.ok(usuarioServ.findAll());
    }

    // PARA ROL ADMINISTRADOR
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtener usuario por ID", description = "Busca un usuario en la base de datos utilizando su identificador único y devuelve sus datos detallados.")
    @GetMapping("/{id}")
    ResponseEntity<Optional<UsuarioResponseDto>> findUsuarioById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioServ.findById(id));
    }

    // PARA ROL ADMINISTRADORES
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear Usuario")
    @PostMapping()
    ResponseEntity<UsuarioResponseDto> createUsuario(@RequestBody @Valid UsuarioCreateRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioServ.save(requestDto));
    }

    // PARA ROL ADMINISTRADOR
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar Usuario por ID")
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteUsuarioById(@PathVariable Long id) {
        usuarioServ.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // PARA ROL ADMINISTRADOR
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Modificar Usuario")
    @PutMapping("/{id}")
    ResponseEntity<UsuarioResponseDto> updatedUsuario(@PathVariable Long id,
            @RequestBody @Valid UsuarioUpdateRequestDto requestDto) {
        return ResponseEntity.ok(usuarioServ.update(id, requestDto));
    }

}
