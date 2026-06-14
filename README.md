GRUPO AD

TRABAJO FINAL INTEGRADOR - PROGRAMACIÓN III

Trabajo Final Integrador – Tecnicatura en Desarrollo Web
Materia: Programación III
Año: 2026


👥 Integrantes


Diego Benjamin Vallory
Franco Matías Aquino
Lucas Samuel Beltran
Gaston Emmanuel Diaz
Mateo Fernandez
Luciano Latella



Requisitos previos


Node.js v18 o superior
XAMPP con MySQL corriendo



Instalación y configuración

1. Clonar el repositorio

bashgit clone https://github.com/LuchoLatella/TFI_Prog3_grupoAD
cd TFI_Prog3_grupoAD

2. Instalar dependencias

bashnpm install

3. Configurar la base de datos


Abrir phpMyAdmin
Importar el archivo modeloDatos.sql para crear las tablas
Ejecutar el contenido de sql/sp_estadisticas.sql para crear el stored procedure
Ejecutar sql/crear_usuario_mysql.sql para crear el usuario con permisos limitados (conectado como root)


4. Crear el archivo .env en la raíz del proyecto

Copiar .env.example y completar con los datos reales:

DB_HOST=localhost
DB_USER=clinica_user
DB_PASSWORD=clinica_pass_2026
DB_NAME=prog3_turnos
JWT_SECRET=grupoad
PORT=3000
CORS_ORIGIN=*


⚠️ No usar root como usuario de base de datos.



5. Iniciar el servidor

bashnpm run dev

El servidor queda disponible en http://localhost:3000


📚 Documentación Swagger

Con el servidor corriendo, acceder a:

http://localhost:3000/api/v1/api-docs

Para autenticarse en Swagger:


Hacer POST /api/v1/auth/login con las credenciales
Copiar el token de la respuesta
Clic en el botón Authorize 🔒 (arriba a la derecha)
Pegar el token y confirmar
Todos los endpoints protegidos quedan habilitados automáticamente



🔐 Roles y permisos

RolValorPermisosMédico1Ver y marcar sus propios turnos como atendidosPaciente2Crear turnos, ver sus turnos, listar médicos y especialidadesAdministrador3Acceso completo a todos los endpoints


🚀 Endpoints disponibles

Todos los endpoints requieren autenticación JWT excepto /auth/login y /auth/register.

🔑 Auth

MétodoEndpointRolesDescripciónPOST/api/v1/auth/login—Iniciar sesión, retorna JWTPOST/api/v1/auth/register—Registrar usuario (paciente, médico o admin)

🏥 Especialidades

MétodoEndpointRolesDescripciónGET/api/v1/especialidades2, 3Listar todas las especialidades activasGET/api/v1/especialidades/:id2, 3Obtener una especialidad por IDPOST/api/v1/especialidades3Crear especialidadPUT/api/v1/especialidades/:id3Editar especialidadDELETE/api/v1/especialidades/:id3Eliminar (soft delete)

👨‍⚕️ Médicos

MétodoEndpointRolesDescripciónGET/api/v1/medicos2, 3Listar médicos (con filtro ?especialidad=1)GET/api/v1/medicos/:id2, 3Obtener médico por IDPOST/api/v1/medicos/:id/obras-sociales3Asociar médico con obra socialDELETE/api/v1/medicos/:id/obras-sociales/:idOS3Desasociar médico de obra social

🏦 Obras Sociales

MétodoEndpointRolesDescripciónGET/api/v1/obras-sociales2, 3Listar obras sociales activasGET/api/v1/obras-sociales/:id2, 3Obtener obra social por IDPOST/api/v1/obras-sociales3Crear obra socialPUT/api/v1/obras-sociales/:id3Editar obra socialDELETE/api/v1/obras-sociales/:id3Eliminar (soft delete)

🧑‍🤝‍🧑 Pacientes

MétodoEndpointRolesDescripciónGET/api/v1/pacientes3Listar todos los pacientesPUT/api/v1/pacientes/:id/obra-social3Actualizar obra social de un paciente

📅 Turnos

MétodoEndpointRolesDescripciónGET/api/v1/turnos1, 2, 3Listar turnos según rol del usuarioPOST/api/v1/turnos2, 3Crear turno (calcula valor_total automáticamente)PATCH/api/v1/turnos/:id/atendido1Marcar turno como atendidoGET/api/v1/turnos/estadisticas3Estadísticas del mes (via stored procedure)GET/api/v1/turnos/reporte-pdf3Descargar reporte PDF de turnos


🧠 Reglas de negocio


Soft delete: los registros nunca se eliminan físicamente, se marca activo = 0
valor_total se calcula automáticamente al crear un turno:

Obra social particular (es_particular = 1): valor_total = valor_consulta
Obra social con descuento (es_particular = 0): valor_total = valor_consulta - (porcentaje_descuento / 100 × valor_consulta)



Estadísticas generadas exclusivamente via stored procedure sp_estadisticas()
PDF incluye cantidad de turnos, atendidos, pendientes, recaudación total y detalle por turno



🏗️ Arquitectura

El proyecto sigue una arquitectura de 3 capas:

routes/ → controllers/ → services/ → repositories/ → MySQL


routes: endpoints, validaciones (express-validator) y control de acceso (JWT + roles)
controllers: reciben req/res, llaman al service, devuelven la respuesta HTTP
services: lógica de negocio y reglas del dominio
repositories: acceso a la base de datos (queries SQL puras)



🛠️ Tecnologías


Runtime: Node.js (ESM)
Framework: Express
Base de datos: MySQL 2
Autenticación: JSON Web Tokens (jsonwebtoken)
Documentación: Swagger UI (swagger-jsdoc + swagger-ui-express)
Validaciones: express-validator
Logs: Morgan
Archivos: Multer
PDF: PDFKit



📊 Estado del proyecto


 Conexión a base de datos con usuario sin root
 Arquitectura 3 capas (repositories / services / controllers)
 CRUD completo de especialidades
 CRUD completo de obras sociales
 Gestión de médicos y asociaciones con obras sociales
 Gestión de pacientes y asociaciones con obras sociales
 Autenticación JWT
 Autorización por roles (médico / paciente / administrador)
 Gestión de turnos con cálculo automático de valor_total
 Transacciones MySQL en operaciones críticas
 Estadísticas via stored procedure
 Generación de reportes PDF
 Documentación Swagger
 Middlewares: Morgan, Multer, express-validator
 CORS configurable
 Variables de entorno
 Soft delete en todas las entidades