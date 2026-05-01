// Creando la Conexión a la base de datos API

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("API funcionando correctamente");          //en caso de que la API esté funcionando correctamente, muestra este mensaje 
});

const PORT = process.env.PORT || 3000;              //definimos el puerto en el que se ejecutará la API, si no se especifica, se usará el puerto 3000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// probando la BBDD MySQL, importando el pool de conexiones desde el archivo db.js y realizando una consulta para verificar la conexión

import { pool } from "./config/db.js";

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ ok: true, rows }); // Devuelve el resultado de la consulta
  } catch (error) {
    res.status(500).json({ error: error.message }); // Devuelve el error en caso de falla
  }
})

// importando las rutas de especialidades y usándolas en la aplicación
import especialidadesRoutes from "./routes/especialidades.routes.js";
app.use("/especialidades", especialidadesRoutes);