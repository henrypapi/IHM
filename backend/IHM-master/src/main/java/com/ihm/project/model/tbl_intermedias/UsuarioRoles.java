package com.ihm.project.model.tbl_intermedias;

import java.time.LocalDateTime;

import com.ihm.project.model.Rol;
import com.ihm.project.model.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario_roles", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "usuario_id", "rol_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRoles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;

    @PrePersist
    public void prePersist() {
        fechaAsignacion = LocalDateTime.now(); // Establece la fecha de asignación al momento de crear la relación
    }
}