## GRUPO AD
TRABAJO FINAL INTEGRADOR - PROGRAMACIÓN III

Trabajo Final Integrador – Tecnicatura en Desarrollo Web
Materia: **Programación III**
Año: 2026

---

## Requisitos

- Node.js
- XAMPP (MySQL corriendo)

## Pasos para levantar el proyecto

**1. Instalar dependencias**
```bash
npm install
```

**2. Configurar la base de datos**

- Abrir phpMyAdmin
- Importar el archivo `modeloDatos.php`
- Luego ejecutar el contenido de `stored_procedures.sql`

**3. Crear el archivo `.env` en la raíz del proyecto**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=prog3_turnos
JWT_SECRET=grupoad
PORT=3000
```

**4. Iniciar el servidor**
```bash
npm run dev
```
npm run dev
```

---

## 🚀 Endpoints disponibles

### 🔹 Especialidades

| Método | Endpoint            | Descripción                      |
| ------ | ------------------- | -------------------------------- |
| GET    | /especialidades     | Obtener todas las especialidades |
| GET    | /especialidades/:id | Obtener una especialidad         |
| POST   | /especialidades     | Crear nueva especialidad         |
| PUT    | /especialidades/:id | Modificar especialidad           |
| DELETE | /especialidades/:id | Eliminación lógica               |

---

## 🧪 Ejemplos de uso

### Crear especialidad

```
POST /especialidades
```

Body:

```json
{
  "nombre": "CARDIOLOGÍA"
}
```

---

### Obtener especialidades

```
GET /especialidades
```

---

## 🧠 Reglas de negocio implementadas

* Eliminación lógica mediante campo `activo`
* Validación de datos de entrada
* Manejo de errores con respuestas HTTP adecuadas

---

## 🔐 Seguridad (en desarrollo)

* Autenticación mediante JWT
* Autorización basada en roles:

  * Médico
  * Paciente
  * Administrador

---

## 📊 Estado del proyecto

* [x] Conexión a base de datos
* [x] CRUD de especialidades
* [ ] Autenticación JWT
* [ ] Gestión de turnos
* [ ] Documentación Swagger
* [ ] Generación de reportes PDF

---

## 👥 Integrantes

La API queda disponible en `http://localhost:3000`

La documentación Swagger está en `http://localhost:3000/api-docs`

Hacer login con las credenciales de: admin@clinica.com yy admin123.

Pegar el token del login en Authorize y luego ejecutar cualquier ruta.
