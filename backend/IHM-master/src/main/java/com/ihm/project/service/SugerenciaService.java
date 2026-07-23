package com.ihm.project.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ihm.project.dto.SugerenciaDTO;
import com.ihm.project.model.Sugerencia;
import com.ihm.project.model.Usuario;
import com.ihm.project.repo.SugerenciaRepository;
import com.ihm.project.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SugerenciaService {

    private final SugerenciaRepository sugerenciaRepository;
    private final UserRepository userRepository;

    public SugerenciaDTO createSugerencia(SugerenciaDTO dto) {
        Sugerencia sugerencia = new Sugerencia();
        sugerencia.setTipo(dto.getTipo());
        sugerencia.setMensaje(dto.getMensaje());
        sugerencia.setEstado(dto.getEstado() != null ? dto.getEstado() : "Pendiente");
        
        if (dto.getUsuarioId() != null) {
            Usuario usuario = userRepository.findById(dto.getUsuarioId()).orElse(null);
            sugerencia.setUsuario(usuario);
        }

        Sugerencia saved = sugerenciaRepository.save(sugerencia);
        return mapToDTO(saved);
    }

    public List<SugerenciaDTO> getAllSugerencias() {
        return sugerenciaRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private SugerenciaDTO mapToDTO(Sugerencia sugerencia) {
        SugerenciaDTO dto = new SugerenciaDTO();
        dto.setId(sugerencia.getId());
        dto.setTipo(sugerencia.getTipo());
        dto.setMensaje(sugerencia.getMensaje());
        dto.setEstado(sugerencia.getEstado());
        dto.setFechaCreacion(sugerencia.getFechaCreacion());
        if (sugerencia.getUsuario() != null) {
            dto.setUsuarioId(sugerencia.getUsuario().getId());
        }
        return dto;
    }
}
