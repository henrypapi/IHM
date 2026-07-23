-- Create tables for IHM project
CREATE TABLE IF NOT EXISTS rol (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS permiso (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS rol_permisos (
    rol_id INT,
    permiso_id INT,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES rol(id),
    FOREIGN KEY (permiso_id) REFERENCES permiso(id)
);

CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apellido VARCHAR(100),
    celular VARCHAR(20),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(255) UNIQUE,
    nombre VARCHAR(100),
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS usuario_roles (
    usuario_id INT,
    rol_id INT,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, rol_id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (rol_id) REFERENCES rol(id)
);

CREATE TABLE IF NOT EXISTS sugerencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Insert seed data
INSERT INTO rol (id, name) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_USER'),
(3, 'ROLE_TI');

INSERT INTO permiso (id, name) VALUES
(1, 'USER_READ'),
(2, 'USER_CREATE'),
(3, 'USER_UPDATE'),
(4, 'USER_DELETE');

INSERT INTO rol_permisos (rol_id, permiso_id, fecha_asignacion) VALUES
(1, 1, NOW()),
(1, 2, NOW()),
(1, 3, NOW()),
(1, 4, NOW());

INSERT INTO usuario (apellido, celular, fecha_creacion, email, nombre, password) VALUES
('ARONE', '111222333', NOW(), 'admin@example.com', 'DAVID', '$2a$10$f/RLY06Udmw0C6pBmp.opOmXrU.3kclX9gUbMr9dG5Uyy/eS23S9W');

INSERT INTO usuario_roles (usuario_id, rol_id, fecha_asignacion) VALUES
(1, 1, NOW());

INSERT INTO sugerencia (tipo, mensaje, estado, fecha_creacion, usuario_id) VALUES
('Mejora', 'Me gustaría que la interfaz tenga un modo oscuro', 'Pendiente', NOW(), 1),
('Comentario', 'Excelente sistema, muy intuitivo', 'Revisado', NOW(), 1),
('Preferencia', 'Prefiero recibir notificaciones por correo en lugar de SMS', 'Pendiente', NOW(), null);
