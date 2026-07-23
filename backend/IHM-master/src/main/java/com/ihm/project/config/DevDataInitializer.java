package com.ihm.project.config;

import java.util.List;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ihm.project.model.Categoria;
import com.ihm.project.model.Rol;
import com.ihm.project.model.Usuario;
import com.ihm.project.model.tbl_intermedias.UsuarioRoles;
import com.ihm.project.repo.CategoriaRepository;
import com.ihm.project.repo.RolRepository;
import com.ihm.project.repo.UserRepository;

@Configuration
@Profile("dev")
public class DevDataInitializer {

    private static final List<String> ADMIN_EMAIL_ALIASES = List.of("admin@ihm.local", "admin@example.com");
    private static final List<String> TI_EMAIL_ALIASES = List.of("ti@ihm.local");
    private static final List<String> USER_EMAIL_ALIASES = List.of("user@ihm.local");

    @Bean
    CommandLineRunner seedDevData(
            RolRepository rolRepository,
            UserRepository userRepository,
            CategoriaRepository categoriaRepository,
            com.ihm.project.repo.TicketRepository ticketRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            Rol adminRole = ensureRole(rolRepository, "ROLE_ADMIN");
            Rol userRole = ensureRole(rolRepository, "ROLE_USER");
            Rol tiRole = ensureRole(rolRepository, "ROLE_TI");

            ensureUser(
                    userRepository,
                    passwordEncoder,
                    "admin@gmail.com",
                    "admin",
                    "Admin",
                    "IHM",
                    "999111222",
                    adminRole,
                    ADMIN_EMAIL_ALIASES);

            ensureUser(
                    userRepository,
                    passwordEncoder,
                    "tecnico@gmail.com",
                    "tecnico",
                    "Soporte",
                    "Tecnico",
                    "999111333",
                    tiRole,
                    TI_EMAIL_ALIASES);

            ensureUser(
                    userRepository,
                    passwordEncoder,
                    "usuario@gmail.com",
                    "usuario",
                    "Usuario",
                    "Final",
                    "999111444",
                    userRole,
                    USER_EMAIL_ALIASES);

            com.ihm.project.model.Categoria catHardware = ensureCategoria(categoriaRepository, "Hardware");
            com.ihm.project.model.Categoria catSoftware = ensureCategoria(categoriaRepository, "Software");
            com.ihm.project.model.Categoria catRedes = ensureCategoria(categoriaRepository, "Redes");
            com.ihm.project.model.Categoria catAccesos = ensureCategoria(categoriaRepository, "Accesos");

            // --- Técnicos (ROLE_TI) ---
            com.ihm.project.model.Usuario carlos = ensureUser(userRepository, passwordEncoder, "carlos.gomez@empresa.com", "carlos.gomez", "Carlos", "Gómez", "987654321", tiRole, List.of());
            com.ihm.project.model.Usuario maria = ensureUser(userRepository, passwordEncoder, "maria.lopez@empresa.com", "maria.lopez", "María", "López", "912345678", tiRole, List.of());
            com.ihm.project.model.Usuario juan = ensureUser(userRepository, passwordEncoder, "juan.perez@empresa.com", "juan.perez", "Juan", "Pérez", "998877665", tiRole, List.of());

            // --- Usuarios normales (ROLE_USER) ---
            com.ihm.project.model.Usuario ana = ensureUser(userRepository, passwordEncoder, "ana.torres@empresa.com", "ana.torres", "Ana", "Torres", "977665544", userRole, List.of());
            com.ihm.project.model.Usuario luis = ensureUser(userRepository, passwordEncoder, "luis.ramirez@empresa.com", "luis.ramirez", "Luis", "Ramírez", "955443322", userRole, List.of());
            com.ihm.project.model.Usuario pedro = ensureUser(userRepository, passwordEncoder, "pedro.sanchez@empresa.com", "pedro.sanchez", "Pedro", "Sánchez", "911223344", userRole, List.of());
            com.ihm.project.model.Usuario laura = ensureUser(userRepository, passwordEncoder, "laura.martin@empresa.com", "laura.martin", "Laura", "Martín", "922334455", userRole, List.of());
            com.ihm.project.model.Usuario rafael = ensureUser(userRepository, passwordEncoder, "rafael.castro@empresa.com", "rafael.castro", "Rafael", "Castro", "933445566", userRole, List.of());
            com.ihm.project.model.Usuario isabel = ensureUser(userRepository, passwordEncoder, "isabel.romero@empresa.com", "isabel.romero", "Isabel", "Romero", "944556677", userRole, List.of());
            com.ihm.project.model.Usuario david = ensureUser(userRepository, passwordEncoder, "david.moreno@empresa.com", "david.moreno", "David", "Moreno", "955667788", userRole, List.of());

            if (ticketRepository.count() == 0) {
                ensureTicket(ticketRepository, carlos, catRedes, "Problema con conexión WiFi", "Mi laptop se desconecta constantemente de la red", com.ihm.project.enums.Prioridad.ALTA);
                ensureTicket(ticketRepository, carlos, catHardware, "Solicitud de monitor adicional", "Requiero un segundo monitor para mi estación de trabajo", com.ihm.project.enums.Prioridad.BAJA);
                ensureTicket(ticketRepository, carlos, catSoftware, "Error en Excel", "Excel se cierra inesperadamente al abrir macros", com.ihm.project.enums.Prioridad.MEDIA);
                ensureTicket(ticketRepository, carlos, catSoftware, "Instalación de IntelliJ", "Necesito el IDE para un nuevo proyecto", com.ihm.project.enums.Prioridad.MEDIA);
                ensureTicket(ticketRepository, carlos, catHardware, "Teclado con teclas falladas", "La barra espaciadora se queda atascada", com.ihm.project.enums.Prioridad.BAJA);

                ensureTicket(ticketRepository, maria, catSoftware, "No puedo acceder al ERP", "El sistema me rechaza las credenciales", com.ihm.project.enums.Prioridad.CRITICA);
                ensureTicket(ticketRepository, maria, catHardware, "Cambio de mouse", "El click derecho no funciona", com.ihm.project.enums.Prioridad.BAJA);
                ensureTicket(ticketRepository, maria, catSoftware, "Licencia de Office vencida", "Word me pide renovar la licencia", com.ihm.project.enums.Prioridad.MEDIA);
                ensureTicket(ticketRepository, maria, catRedes, "Acceso VPN", "Necesito configuración para trabajo remoto", com.ihm.project.enums.Prioridad.ALTA);
                ensureTicket(ticketRepository, maria, catHardware, "Lentitud en la PC", "La computadora tarda 15 minutos en arrancar", com.ihm.project.enums.Prioridad.MEDIA);

                ensureTicket(ticketRepository, juan, catRedes, "Caída de internet local", "El cable de red de mi escritorio no da señal", com.ihm.project.enums.Prioridad.ALTA);
                ensureTicket(ticketRepository, juan, catSoftware, "Instalación de Adobe Acrobat", "Para firmar documentos PDF", com.ihm.project.enums.Prioridad.MEDIA);
                ensureTicket(ticketRepository, juan, catHardware, "Pantalla parpadea", "El monitor parpadea constantemente", com.ihm.project.enums.Prioridad.MEDIA);
                ensureTicket(ticketRepository, juan, catSoftware, "Correo no sincroniza", "Outlook no descarga los correos nuevos", com.ihm.project.enums.Prioridad.ALTA);
                ensureTicket(ticketRepository, juan, catAccesos, "Restablecimiento de contraseña", "He olvidado mi contraseña del sistema interno", com.ihm.project.enums.Prioridad.CRITICA);

                ensureTicket(ticketRepository, ana, catHardware, "Impresora sin tóner", "La impresora del piso 3 se quedó sin tinta", com.ihm.project.enums.Prioridad.MEDIA);
                ensureTicket(ticketRepository, ana, catSoftware, "Fallo en aplicación de diseño", "Photoshop no guarda los archivos grandes", com.ihm.project.enums.Prioridad.ALTA);
                ensureTicket(ticketRepository, ana, catRedes, "Configuración de correo", "Necesito ayuda para sincronizar mi email", com.ihm.project.enums.Prioridad.BAJA);
                ensureTicket(ticketRepository, ana, catHardware, "Cable HDMI dañado", "El cable para proyector está roto", com.ihm.project.enums.Prioridad.BAJA);
                ensureTicket(ticketRepository, ana, catAccesos, "Problema de permisos en red", "No tengo acceso a la carpeta compartida Z:", com.ihm.project.enums.Prioridad.ALTA);

                ensureTicket(ticketRepository, luis, catHardware, "Pantalla azul", "La computadora se reinicia mostrando una pantalla azul", com.ihm.project.enums.Prioridad.CRITICA);
                ensureTicket(ticketRepository, luis, catSoftware, "Renovación de antivirus", "Sale una alerta de que mi PC está desprotegida", com.ihm.project.enums.Prioridad.ALTA);
                ensureTicket(ticketRepository, luis, catSoftware, "Problema con Teams", "El micrófono no me funciona durante las llamadas", com.ihm.project.enums.Prioridad.MEDIA);
                ensureTicket(ticketRepository, luis, catRedes, "Lentitud en la intranet", "Tarda mucho en cargar los reportes", com.ihm.project.enums.Prioridad.MEDIA);
                ensureTicket(ticketRepository, luis, catHardware, "Mantenimiento preventivo", "Mi equipo suena muy fuerte (ventiladores)", com.ihm.project.enums.Prioridad.BAJA);
            }
        };
    }

    private Rol ensureRole(RolRepository rolRepository, String roleName) {
        return rolRepository.findByName(roleName)
                .orElseGet(() -> {
                    Rol rol = new Rol();
                    rol.setName(roleName);
                    return rolRepository.save(rol);
                });
    }

    private com.ihm.project.model.Usuario ensureUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            String email,
            String username,
            String nombre,
            String apellido,
            String celular,
            Rol role,
            List<String> legacyEmails) {
        Usuario usuario = findSeedUser(userRepository, email, legacyEmails)
                .orElseGet(Usuario::new);

        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(username)); // Por simplicidad en dev, usamos el username como pass
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setCelular(celular);
        usuario.setRoles(resolveRoles(usuario, role));

        return userRepository.save(usuario);
    }

    private Optional<Usuario> findSeedUser(
            UserRepository userRepository,
            String targetEmail,
            List<String> legacyEmails) {
        Optional<Usuario> existingUser = userRepository.findByEmail(targetEmail);
        if (existingUser.isPresent()) {
            return existingUser;
        }

        for (String legacyEmail : legacyEmails) {
            Optional<Usuario> legacyUser = userRepository.findByEmail(legacyEmail);
            if (legacyUser.isPresent()) {
                return legacyUser;
            }
        }

        return Optional.empty();
    }

    private UsuarioRoles buildUserRole(Usuario usuario, Rol role) {
        UsuarioRoles usuarioRol = new UsuarioRoles();
        usuarioRol.setUsuario(usuario);
        usuarioRol.setRol(role);
        return usuarioRol;
    }

    private List<UsuarioRoles> resolveRoles(Usuario usuario, Rol role) {
        if (usuario.getRoles() != null && !usuario.getRoles().isEmpty()) {
            boolean alreadyHasRole = usuario.getRoles().stream()
                    .anyMatch(ur -> ur.getRol().getName().equals(role.getName()));
            if (alreadyHasRole) {
                return usuario.getRoles();
            }
        }
        return List.of(buildUserRole(usuario, role));
    }

    private com.ihm.project.model.Categoria ensureCategoria(CategoriaRepository categoriaRepository, String nombre) {
        return categoriaRepository.findByNombre(nombre)
                .orElseGet(() -> {
                    com.ihm.project.model.Categoria categoria = new com.ihm.project.model.Categoria();
                    categoria.setNombre(nombre);
                    return categoriaRepository.save(categoria);
                });
    }

    private void ensureTicket(
            com.ihm.project.repo.TicketRepository ticketRepository,
            com.ihm.project.model.Usuario creador,
            com.ihm.project.model.Categoria categoria,
            String titulo,
            String descripcion,
            com.ihm.project.enums.Prioridad prioridad) {
        com.ihm.project.model.Ticket ticket = new com.ihm.project.model.Ticket();
        ticket.setTitulo(titulo);
        ticket.setDescripcion(descripcion);
        ticket.setPrioridad(prioridad);
        ticket.setCategoria(categoria);
        ticket.setCreadoPor(creador);
        ticketRepository.save(ticket);
    }
}
