package com.ihm.project.model.tbl_intermedias;

import java.time.LocalDateTime;

import com.ihm.project.model.Permiso;
import com.ihm.project.model.Rol;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "rol_permisos", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "permiso_id", "rol_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RolPermisos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "permiso_id")
    private Permiso permiso;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;
}
