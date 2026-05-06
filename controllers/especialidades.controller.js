
// import { pool } from "../config/db.js";

// export const getEspecialidades = async (req, res) => {
//     const [rows] = await pool.query("SELECT * FROM especialidades WHERE activo = 1");
//     res.json(rows);
// };

// export const createEspecialidad = async (req, res) => {
//     const { nombre } = req.body;

//     const [result] = await pool.query("INSERT INTO especialidades (nombre) VALUES (?)", [nombre]

//     );

//     res.json({ id: result.insertId, nombre });
// }

import { pool } from "../config/db.js";

export const getEspecialidades = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM especialidades WHERE activo = 1"
    );

    res.json(rows);                                          // GET DE TODAS LAS ESPECIALIDADES ACTIVAS

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEspecialidadById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Especialidad no encontrada" });
    }
                                                                                           // GET DE UNA ESPECIALIDAD POR ID, SOLO SI ESTÁ ACTIVA
    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEspecialidad = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const [result] = await pool.query(
      "INSERT INTO especialidades (nombre) VALUES (?)",
      [nombre]
    );
                                                                        // POST PARA CREAR UNA NUEVA ESPECIALIDAD, REQUIERE EL NOMBRE EN EL CUERPO DE LA SOLICITUD
    res.status(201).json({
      id: result.insertId,
      nombre
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const [result] = await pool.query(
      "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1",
      [nombre, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Especialidad no encontrada" });
    }
                                                                                    // PUT PARA ACTUALIZAR EL NOMBRE DE UNA ESPECIALIDAD EXISTENTE, SOLO SI ESTÁ ACTIVA
    res.json({ message: "Especialidad actualizada" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};