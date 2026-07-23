package com.ihm.project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ihm.project.dto.categoria.CategoriaResponseDto;
import com.ihm.project.repo.CategoriaRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/categoria")
@RequiredArgsConstructor
@Tag(name = "Categorias", description = "Catálogo básico de categorías")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    @Operation(summary = "Listar categorías")
    @GetMapping
    ResponseEntity<List<CategoriaResponseDto>> findAllCategorias() {
        List<CategoriaResponseDto> categorias = categoriaRepository.findAll().stream()
                .map(categoria -> new CategoriaResponseDto(categoria.getId(), categoria.getNombre()))
                .toList();
        return ResponseEntity.ok(categorias);
    }
}
