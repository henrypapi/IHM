# Backend Front Integration

## Base URL

`http://localhost:8080`

## CORS

El backend acepta peticiones desde:

`http://localhost:4200`

Configurado en `SecurityConfig` con:

- metodos: `GET, POST, PUT, DELETE, OPTIONS`
- headers: `Authorization, Content-Type`
- credentials: `true`

## Autenticacion

Todos los endpoints privados usan:

`Authorization: Bearer <token>`

### Login

`POST /auth/login`

Request:

```json
{
  "identifier": "admin",
  "password": "admin"
}
```

Response:

```json
{
  "token": "JWT_AQUI"
}
```

## Usuarios de desarrollo

- `admin@gmail.com` / `admin`
- `tecnico@gmail.com` / `tecnico`
- `usuario@gmail.com` / `usuario`

## Usuarios de acceso

- `admin`
- `tecnico`
- `usuario`

## Endpoints publicos

- `POST /auth/login`
- `GET /api/v1/meta/server-time`
- `GET /api/v1/meta/ticket-options`
- `GET /v3/api-docs`
- `GET /swagger-ui/index.html`

## Endpoints privados

### Usuarios

- `GET /api/v1/usuario/me`
- `GET /api/v1/usuario`
- `GET /api/v1/usuario/{id}`
- `POST /api/v1/usuario`
- `PUT /api/v1/usuario/{id}`
- `DELETE /api/v1/usuario/{id}`

### Categorias

- `GET /api/v1/categoria`

### Tickets

- `GET /api/v1/ticket`
- `GET /api/v1/ticket/{id}`
- `GET /api/v1/ticket/usuario/{userId}`
- `GET /api/v1/ticket/my-tickets`
- `GET /api/v1/ticket/my-tickets-created`
- `POST /api/v1/ticket`
- `PUT /api/v1/ticket/{id}/asignacion`
- `PUT /api/v1/ticket/{id}/culminar`
- `DELETE /api/v1/ticket/{id}`

## Respuestas reales

### GET /api/v1/usuario/me

```json
{
  "apellido": "IHM",
  "celular": "999111222",
  "email": "admin@gmail.com",
  "id": 1,
  "nombre": "Admin",
  "roles": ["ROLE_ADMIN"]
}
```

### GET /api/v1/usuario

```json
[
  {
    "apellido": "IHM",
    "celular": "999111222",
    "email": "admin@gmail.com",
    "id": 1,
    "nombre": "Admin",
    "roles": ["ROLE_ADMIN"]
  },
  {
    "apellido": "Tecnico",
    "celular": "999111333",
    "email": "tecnico@gmail.com",
    "id": 2,
    "nombre": "Soporte",
    "roles": ["ROLE_TI"]
  },
  {
    "apellido": "Final",
    "celular": "999111444",
    "email": "usuario@gmail.com",
    "id": 3,
    "nombre": "Usuario",
    "roles": ["ROLE_USER"]
  }
]
```

### GET /api/v1/ticket

```json
[
  {
    "id": 1,
    "titulo": "Prueba desde Insomnia",
    "descripcion": "Primer ticket de prueba",
    "fechaRegistro": "2026-06-18 10:07:29",
    "fechaAsignacion": null,
    "fechaCulminacion": null,
    "prioridad": null,
    "estado": "PENDIENTE",
    "categoria": {
      "id": 1,
      "nombre": "Hardware"
    },
    "usuarioAsignado": null,
    "creadoPor": {
      "id": 3,
      "nombre": "Usuario"
    }
  },
  {
    "id": 33,
    "titulo": "Prueba desde Insomnia",
    "descripcion": "Segundo ticket de prueba",
    "fechaRegistro": "2026-06-18 10:38:38",
    "fechaAsignacion": null,
    "fechaCulminacion": null,
    "prioridad": null,
    "estado": "PENDIENTE",
    "categoria": {
      "id": 1,
      "nombre": "Hardware"
    },
    "usuarioAsignado": null,
    "creadoPor": {
      "id": 1,
      "nombre": "Admin"
    }
  }
]
```

### GET /api/v1/categoria

Ejemplo esperado:

```json
[
  { "id": 1, "nombre": "Hardware" },
  { "id": 2, "nombre": "Software" },
  { "id": 3, "nombre": "Redes" },
  { "id": 4, "nombre": "Accesos" }
]
```

### GET /api/v1/meta/ticket-options

```json
{
  "prioridades": ["BAJA", "MEDIA", "ALTA", "CRITICA"],
  "estados": ["PENDIENTE", "EN_PROCESO", "RESUELTO"]
}
```

## Request utiles para el front

### Crear ticket

`POST /api/v1/ticket`

Request:

```json
{
  "titulo": "Error de acceso",
  "descripcion": "No puedo entrar al sistema",
  "categoriaId": 1
}
```

Response `201 Created`:

```json
{
  "id": 34,
  "titulo": "Error de acceso",
  "descripcion": "No puedo entrar al sistema",
  "fechaRegistro": "2026-06-19 09:15:20",
  "fechaAsignacion": null,
  "fechaCulminacion": null,
  "prioridad": null,
  "estado": "PENDIENTE",
  "categoria": {
    "id": 1,
    "nombre": "Hardware"
  },
  "usuarioAsignado": null,
  "creadoPor": {
    "id": 3,
    "nombre": "Usuario"
  }
}
```

Errores de validacion `400 Bad Request`:

```json
{
  "timestamp": "2026-06-19T09:16:10",
  "status": 400,
  "error": "Bad Request",
  "message": "La solicitud contiene datos invalidos.",
  "path": "/api/v1/ticket",
  "validationErrors": {
    "titulo": "El titulo debe tener entre 5 y 120 caracteres.",
    "descripcion": "La descripcion debe tener entre 10 y 1000 caracteres."
  }
}
```

Notas para frontend:

- El formulario de creacion solo necesita `titulo`, `descripcion` y `categoriaId`.
- `estado`, `prioridad`, `usuarioAsignado` y fechas no se envian en el alta; los define el backend.
- Para poblar el selector de categoria usa `GET /api/v1/categoria`.
- Despues de crear, el backend responde con el ticket completo y header `Location: /api/v1/ticket/{id}`.

### Asignar ticket

`PUT /api/v1/ticket/{id}/asignacion`

```json
{
  "idUsuarioAsignado": 2,
  "prioridad": "ALTA"
}
```
