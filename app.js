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