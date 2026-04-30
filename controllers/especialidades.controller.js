
import { pool } from "../config/db.js";

export const getEspecialidades = async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM especialidades WHERE activo = 1");
    res.json(rows);
};

export const createEspecialidad = async (req, res) => {
    const { nombre } = req.body;

    const [result] = await pool.query("INSERT INTO especialidades (nombre) VALUES (?)", [nombre]

    );

    res.json({ id: result.insertId, nombre });
}