import { pool } from '../config/db.js';

export const getPacientes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.id_paciente, u.id_usuario, u.documento, u.apellido, u.nombres, u.email, u.foto_path,
                   os.id_obra_social, os.nombre AS obra_social
            FROM pacientes p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
            WHERE u.activo = 1
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const asociarObraSocial = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { id_obra_social } = req.body;
        await conn.beginTransaction();
        const [result] = await conn.query(
            'UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?',
            [id_obra_social, req.params.id]
        );
        if (!result.affectedRows) {
            await conn.rollback();
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }
        await conn.commit();
        res.json({ mensaje: 'Obra social actualizada' });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ mensaje: error.message });
    } finally {
        conn.release();
    }
};
