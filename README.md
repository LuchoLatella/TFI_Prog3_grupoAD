## GRUPO AD
TRABAJO FINAL INTEGRADOR - PROGRAMACIÓN III

Trabajo Final Integrador – Tecnicatura en Desarrollo Web
Materia: **Programación III**
Año: 2026

---

## 👥 Integrantes

* Diego Benjamin Vallory
* Franco Matías Aquino
* Lucas Samuel Beltran
* Gaston Emmanuel Diaz
* Mateo Fernandez
* Luciano Latella

---

## Requisitos previos

- Node.js v18 o superior
- XAMPP con MySQL corriendo

---

## Instalación y configuración

**1. Clonar el repositorio**
```bash
git clone https://github.com/LuchoLatella/TFI_Prog3_grupoAD
cd TFI_Prog3_grupoAD
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Configurar la base de datos**

- Abrir phpMyAdmin
- Importar el archivo `modeloDatos.sql` para crear las tablas
- Ejecutar el contenido de `sql/sp_estadisticas.sql` para crear el stored procedure
- Ejecutar `sql/crear_usuario_mysql.sql` para crear el usuario con permisos limitados (conectado como root)

**4. Crear el archivo `.env` en la raíz del proyecto**

Copiar `.env.example` y completar con los datos reales:
```
DB_HOST=localhost
DB_USER=clinica_user
DB_PASSWORD=clinica_pass_2026
DB_NAME=prog3_turnos
JWT_SECRET=grupoad
PORT=3000
CORS_ORIGIN=*
```


**5. Iniciar el servidor**
```bash
npm run dev
```

El servidor queda disponible en `http://localhost:3000`

---

## 📚 Documentación Swagger

Con el servidor corriendo, acceder a:
```
http://localhost:3000/api/v1/api-docs
```

Para autenticarse en Swagger:

1. Hacer `POST /api/v1/auth/login` con las credenciales
         "email": "admin@clinica.com",
         "contrasenia": "admin123"
2. Copiar el `token` de la respuesta
3. Clic en el botón **Authorize 🔒** (arriba a la derecha)
4. Pegar el token y confirmar
5. Todos los endpoints protegidos quedan habilitados automáticamente

---

## 🔐 Roles y permisos

| Rol | Valor | Permisos |
|-----|-------|----------|
| Médico | 1 | Ver y marcar sus propios turnos como atendidos |
| Paciente | 2 | Crear turnos, ver sus turnos, listar médicos y especialidades |
| Administrador | 3 | Acceso completo a todos los endpoints |

---

## 🚀 Endpoints disponibles

Todos los endpoints requieren autenticación JWT excepto `/auth/login` y `/auth/register`.

### 🔑 Auth

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| POST | `/api/v1/auth/login` | — | Iniciar sesión, retorna JWT |
| POST | `/api/v1/auth/register` | — | Registrar usuario (paciente, médico o admin) |

### 🏥 Especialidades

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| GET | `/api/v1/especialidades` | 2, 3 | Listar todas las especialidades activas |
| GET | `/api/v1/especialidades/:id` | 2, 3 | Obtener una especialidad por ID |
| POST | `/api/v1/especialidades` | 3 | Crear especialidad |
| PUT | `/api/v1/especialidades/:id` | 3 | Editar especialidad |
| DELETE | `/api/v1/especialidades/:id` | 3 | Eliminar (soft delete) |

### 👨‍⚕️ Médicos

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| GET | `/api/v1/medicos` | 2, 3 | Listar médicos (con filtro `?especialidad=1`) |
| GET | `/api/v1/medicos/:id` | 2, 3 | Obtener médico por ID |
| POST | `/api/v1/medicos/:id/obras-sociales` | 3 | Asociar médico con obra social |
| DELETE | `/api/v1/medicos/:id/obras-sociales/:idOS` | 3 | Desasociar médico de obra social |

### 🏦 Obras Sociales

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| GET | `/api/v1/obras-sociales` | 2, 3 | Listar obras sociales activas |
| GET | `/api/v1/obras-sociales/:id` | 2, 3 | Obtener obra social por ID |
| POST | `/api/v1/obras-sociales` | 3 | Crear obra social |
| PUT | `/api/v1/obras-sociales/:id` | 3 | Editar obra social |
| DELETE | `/api/v1/obras-sociales/:id` | 3 | Eliminar (soft delete) |

### 🧑‍🤝‍🧑 Pacientes

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| GET | `/api/v1/pacientes` | 3 | Listar todos los pacientes |
| PUT | `/api/v1/pacientes/:id/obra-social` | 3 | Actualizar obra social de un paciente |

### 📅 Turnos

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| GET | `/api/v1/turnos` | 1, 2, 3 | Listar turnos según rol del usuario |
| POST | `/api/v1/turnos` | 2, 3 | Crear turno (calcula valor_total automáticamente) |
| PATCH | `/api/v1/turnos/:id/atendido` | 1 | Marcar turno como atendido |
| GET | `/api/v1/turnos/estadisticas` | 3 | Estadísticas del mes (via stored procedure) |
| GET | `/api/v1/turnos/reporte-pdf` | 3 | Descargar reporte PDF de turnos |

---

## 🧠 Reglas de negocio

- **Soft delete**: los registros nunca se eliminan físicamente, se marca `activo = 0`
- **valor_total** se calcula automáticamente al crear un turno:
  - Obra social particular (`es_particular = 1`): `valor_total = valor_consulta`
  - Obra social con descuento (`es_particular = 0`): `valor_total = valor_consulta - (porcentaje_descuento / 100 × valor_consulta)`
- **Estadísticas** generadas exclusivamente via stored procedure `sp_estadisticas()`
- **PDF** incluye cantidad de turnos, atendidos, pendientes, recaudación total y detalle por turno

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura de 3 capas:

```
routes/ → controllers/ → services/ → repositories/ → MySQL
```

- **routes**: endpoints, validaciones (express-validator) y control de acceso (JWT + roles)
- **controllers**: reciben `req`/`res`, llaman al service, devuelven la respuesta HTTP
- **services**: lógica de negocio y reglas del dominio
- **repositories**: acceso a la base de datos (queries SQL puras)

---

## 🛠️ Tecnologías

- **Runtime**: Node.js (ESM)
- **Framework**: Express
- **Base de datos**: MySQL 2
- **Autenticación**: JSON Web Tokens (jsonwebtoken)
- **Documentación**: Swagger UI (swagger-jsdoc + swagger-ui-express)
- **Validaciones**: express-validator
- **Logs**: Morgan
- **Archivos**: Multer
- **PDF**: PDFKit

---

## 📊 Estado del proyecto

* [x] Conexión a base de datos con usuario sin root
* [x] Arquitectura 3 capas (repositories / services / controllers)
* [x] CRUD completo de especialidades
* [x] CRUD completo de obras sociales
* [x] Gestión de médicos y asociaciones con obras sociales
* [x] Gestión de pacientes y asociaciones con obras sociales
* [x] Autenticación JWT
* [x] Autorización por roles (médico / paciente / administrador)
* [x] Gestión de turnos con cálculo automático de valor_total
* [x] Transacciones MySQL en operaciones críticas
* [x] Estadísticas via stored procedure
* [x] Generación de reportes PDF
* [x] Documentación Swagger
* [x] Middlewares: Morgan, Multer, express-validator
* [x] CORS configurable
* [x] Variables de entorno
* [x] Soft delete en todas las entidades
