// conexión a la base de datos MySQL y configuración dotenv para cargar las variables de entorno desde el archivo .env

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool =mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

});
