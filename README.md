# 🏥 API Clínica - Programación III

Trabajo Final Integrador – Tecnicatura en Desarrollo Web
Materia: **Programación III**
Año: 2026

---

## 📌 Descripción

Este proyecto consiste en el desarrollo de una **API RESTful** para la gestión de una clínica médica.

La aplicación permite administrar:

* Especialidades médicas
* Médicos
* Pacientes
* Obras sociales
* Turnos

Se implementa utilizando **Node.js**, **Express** y **MySQL**, aplicando buenas prácticas de desarrollo backend.

---

## 🎯 Objetivos del proyecto

* Implementar una API REST desde el lado del servidor
* Conectar con base de datos relacional (MySQL)
* Aplicar reglas de negocio reales
* Gestionar autenticación y autorización por roles
* Documentar endpoints correctamente

---

## 🛠️ Tecnologías utilizadas

* Node.js
* Express
* MySQL (phpMyAdmin)
* express-validator
* JSON Web Tokens (JWT) *(en desarrollo)*
* dotenv
* cors

---

## 📁 Estructura del proyecto

```
src/
 ├── config/          # Configuración de base de datos
 ├── controllers/     # Lógica de negocio
 ├── routes/          # Definición de endpoints
 ├── middlewares/     # Validaciones y otros middlewares
 └── app.js           # Punto de entrada
```

---

## ⚙️ Instalación y ejecución

### 1. Clonar repositorio

```
git clone https://github.com/LuchoLatella/TFI_Prog3_grupoAD.git
cd TFI_Prog3_grupoAD
```

### 2. Instalar dependencias

```
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=prog3_turnos

PORT=3000
JWT_SECRET=secreto123
```

### 4. Ejecutar el servidor

Modo desarrollo:

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

* Diego Benjamin Vallory
* Franco Matías Aquino
* Lucas Samuel Beltran
* Gaston Emmanuel Diaz
* Mateo Fernandez
* Luciano Latella



