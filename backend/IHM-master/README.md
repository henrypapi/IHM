# 🎫 IHM — Sistema de Gestión de Tickets

Backend REST API para un sistema de mesa de ayuda (helpdesk) con autenticación JWT, roles y permisos, gestión de tickets y documentación interactiva con Swagger UI.

---

## 🚀 Tecnologías

| Tecnología | Versión |
|---|---|
| Java | 21 |
| Spring Boot | 4.0.6 |
| Spring Security | (incluida en Boot) |
| Spring Data JPA | (incluida en Boot) |
| MySQL | (runtime) |
| JJWT | 0.11.5 |
| MapStruct | 1.6.3 |
| Lombok | (latest) |
| SpringDoc OpenAPI (Swagger) | 3.0.2 |
| Maven | Wrapper incluido |

---

## 📁 Estructura del Proyecto

```
src/main/java/com/ihm/project/
├── config/
│   ├── SecurityConfig.java       # Configuración de Spring Security y filtros
│   └── OpenApiConfig.java        # Configuración de Swagger / OpenAPI
├── controller/
│   ├── AuthController.java       # Autenticación (login)
│   ├── TicketController.java     # CRUD y gestión de tickets
│   └── UsuarioController.java    # CRUD de usuarios
├── dto/
│   ├── auth/                     # DTOs de autenticación
│   ├── ticket/                   # DTOs de tickets
│   └── usuario/                  # DTOs de usuarios
├── enums/
│   ├── Estado.java               # PENDIENTE | EN_PROCESO | RESUELTO
│   └── Prioridad.java            # BAJA | MEDIA | ALTA | CRITICA
├── jwt/
│   ├── JwtFilter.java            # Filtro de validación de tokens
│   ├── JwtService.java           # Generación y validación de JWT
│   └── UserDetailServImp.java    # Implementación de UserDetailsService
├── mapper/                       # Mappers MapStruct (Entity ↔ DTO)
├── model/
│   ├── Area.java
│   ├── Categoria.java
│   ├── Permiso.java
│   ├── Rol.java
│   ├── Sede.java
│   ├── Ticket.java
│   ├── Usuario.java
│   └── tbl_intermedias/
│       ├── RolPermisos.java
│       └── UsuarioRoles.java
├── repo/                         # Repositorios JPA
└── service/
    ├── TicketService.java
    ├── UsuarioService.java
    └── impl/                     # Implementaciones de los servicios
```

---

## ⚙️ Requisitos Previos

- **Java 21** o superior
- **MySQL** en ejecución local (por defecto en `localhost:3306`)
- **Maven** (o usar el wrapper incluido `./mvnw`)

---

## 🛠️ Configuración

Crea o edita el archivo `src/main/resources/application.properties` con tus datos:

```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/ihm_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=tu_contraseña

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=tu_clave_secreta_muy_larga_y_segura
jwt.expiration=86400000

# Puerto (opcional)
server.port=8080
```

---

## ▶️ Cómo Ejecutar

### Con Maven Wrapper (recomendado)

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

### Con Maven instalado

```bash
mvn spring-boot:run
```

La API estará disponible en: `http://localhost:8080`

---

## 🔐 Autenticación

El sistema usa **JWT stateless**. Para acceder a los endpoints protegidos:

### 1. Obtener Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### 2. Usar el Token

Incluye el token en el header de cada petición:

```http
Authorization: Bearer <token>
```

---

## 📋 Endpoints de la API

### 🔑 Autenticación

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `POST` | `/auth/login` | Iniciar sesión y obtener JWT | Público |

---

### 👥 Usuarios — `/api/v1/usuario`

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| `GET` | `/api/v1/usuario` | Listar todos los usuarios | Admin |
| `GET` | `/api/v1/usuario/{id}` | Obtener usuario por ID | Admin |
| `POST` | `/api/v1/usuario` | Crear nuevo usuario | Admin |
| `PUT` | `/api/v1/usuario/{id}` | Actualizar usuario | Admin |
| `DELETE` | `/api/v1/usuario/{id}` | Eliminar usuario | Admin |

---

### 🎫 Tickets — `/api/v1/ticket`

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| `GET` | `/api/v1/ticket` | Listar todos los tickets | Admin |
| `GET` | `/api/v1/ticket/{id}` | Obtener ticket por ID | Admin |
| `GET` | `/api/v1/ticket/usuario/{userId}` | Tickets asignados a un usuario | Admin |
| `GET` | `/api/v1/ticket/my-tickets` | Mis tickets asignados | Autenticado |
| `POST` | `/api/v1/ticket` | Crear nuevo ticket | Autenticado |
| `PUT` | `/api/v1/ticket/{id}/asignacion` | Asignar ticket a usuario y prioridad | Admin |
| `PUT` | `/api/v1/ticket/{id}/culminar` | Marcar ticket como resuelto | Técnico |
| `DELETE` | `/api/v1/ticket/{id}` | Eliminar ticket | Admin / Dueño |

---

## 📊 Modelo de Datos

### Ticket

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | Identificador único |
| `titulo` | String | Título del ticket |
| `descripcion` | String | Descripción del problema |
| `fechaRegistro` | LocalDateTime | Fecha de creación (auto) |
| `fechaAsignacion` | LocalDateTime | Fecha de asignación |
| `fechaCulminacion` | LocalDateTime | Fecha de resolución |
| `prioridad` | Enum | `BAJA` \| `MEDIA` \| `ALTA` \| `CRITICA` |
| `estado` | Enum | `PENDIENTE` \| `EN_PROCESO` \| `RESUELTO` |
| `categoria` | Categoria | Categoría del ticket |
| `usuarioAsignado` | Usuario | Técnico responsable |
| `creadoPor` | Usuario | Usuario que creó el ticket |

### Usuario

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | Identificador único |
| `email` | String | Correo (usado como username) |
| `password` | String | Contraseña (BCrypt) |
| `nombre` | String | Nombre |
| `apellido` | String | Apellido |
| `celular` | String | Número de celular |
| `fechaCreacion` | LocalDateTime | Fecha de registro (auto) |
| `roles` | List\<UsuarioRoles\> | Roles asignados |

---

## 📄 Documentación Swagger UI

Una vez que la aplicación esté corriendo, accede a la documentación interactiva:

```
http://localhost:8080/swagger-ui/index.html
```

También puedes consultar el JSON de la especificación OpenAPI en:

```
http://localhost:8080/v3/api-docs
```

---

## 🔒 Seguridad

- **Autenticación**: JWT (stateless, sin sesiones)
- **Encriptación de contraseñas**: BCrypt
- **Autorización**: Basada en roles (`Rol`) y permisos (`Permiso`)
- **Endpoints públicos**: `/auth/login`, `/swagger-ui/**`, `/v3/api-docs/**`
- **Todos los demás endpoints** requieren token JWT válido

---

## 🧪 Ejecutar Tests

```bash
.\mvnw.cmd test
```

---

## 📌 Estado del Proyecto

> ⚠️ Proyecto en desarrollo activo. Algunas funciones como la validación de propietario al eliminar tickets están pendientes de implementación.

---

## 👨‍💻 Autor

**Luis Fernando Melgar Pi**
