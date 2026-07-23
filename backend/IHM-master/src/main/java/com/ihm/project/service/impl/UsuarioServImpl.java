package com.ihm.project.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ihm.project.dto.usuario.UsuarioCreateRequestDto;
import com.ihm.project.dto.usuario.UsuarioResponseDto;
import com.ihm.project.dto.usuario.UsuarioUpdateRequestDto;
import com.ihm.project.mapper.UsuarioMapper;
import com.ihm.project.model.Rol;
import com.ihm.project.model.Usuario;
import com.ihm.project.model.tbl_intermedias.UsuarioRoles;
import com.ihm.project.repo.RolRepository;
import com.ihm.project.repo.UserRepository;
import com.ihm.project.service.UsuarioService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServImpl implements UsuarioService {

    private final UserRepository usuarioRepo;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final RolRepository rolRepository;

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioResponseDto> findAll() {
        return usuarioRepo.findAll().stream().map(user -> usuarioMapper.toDto(user)).toList();
    }

    @Override
    public Optional<UsuarioResponseDto> findById(Long id) {
        return usuarioRepo.findById(id).map(user -> usuarioMapper.toDto(user));
    }

    @Transactional
    @Override
    public UsuarioResponseDto save(UsuarioCreateRequestDto request) {
        String normalizedEmail = normalize(request.getEmail());
        String generatedUsername = extractUsername(normalizedEmail);

        if (usuarioRepo.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email ya registrado");
        }
        if (usuarioRepo.existsByUsername(generatedUsername)) {
            throw new RuntimeException("Nombre de usuario ya registrado");
        }

        Usuario usuarioCreated = usuarioMapper.toEntity(request);
        usuarioCreated.setEmail(normalizedEmail);
        usuarioCreated.setUsername(generatedUsername);
        usuarioCreated.setPassword(passwordEncoder.encode(request.getPassword()));

        List<UsuarioRoles> roles = request.getRoles().stream()
                .map(roleName -> {
                    Rol rol = rolRepository.findByName(roleName)
                            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
                    UsuarioRoles usuarioRoles = new UsuarioRoles();
                    usuarioRoles.setUsuario(usuarioCreated);
                    usuarioRoles.setRol(rol);
                    return usuarioRoles;
                })
                .toList();
        usuarioCreated.setRoles(roles);

        Usuario usuarioSave = usuarioRepo.save(usuarioCreated);
        return usuarioMapper.toDto(usuarioSave);
    }

    @Override
    public void deleteById(Long id) {
        if (!usuarioRepo.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepo.deleteById(id);
    }

    @Override
    public UsuarioResponseDto update(Long id, UsuarioUpdateRequestDto request) {
        return usuarioRepo.findById(id).map(usuarioExist -> {
            usuarioMapper.updateToEntity(request, usuarioExist);
            Usuario usuarioSaved = usuarioRepo.save(usuarioExist);
            return usuarioMapper.toDto(usuarioSaved);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private String normalize(String value) {
        return value == null ? null : value.trim().toLowerCase();
    }

    private String extractUsername(String email) {
        int separatorIndex = email.indexOf('@');
        return separatorIndex > 0 ? email.substring(0, separatorIndex) : email;
    }
}
