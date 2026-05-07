## GRUPO AD
TRABAJO FINAL INTEGRADOR - PROGRAMACIÓN III

- Diego Benjamin Vallory
- Franco Matías Aquino
- Lucas Samuel Beltran
- Gaston Emmanuel Diaz
- Mateo Fernandez
- Luciano Latella

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

La API queda disponible en `http://localhost:3000`

La documentación Swagger está en `http://localhost:3000/api-docs`

Hacer login con las credenciales de: admin@clinica.com yy admin123.

Pegar el token del login en Authorize y luego ejecutar cualquier ruta.