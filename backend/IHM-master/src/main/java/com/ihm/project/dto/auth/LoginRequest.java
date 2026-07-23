package com.ihm.project.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginRequest {
    @NotBlank
    @JsonAlias({ "email", "username" })
    private String identifier;

    @NotBlank
    private String password;
}
