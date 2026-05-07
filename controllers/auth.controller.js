import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

const hash = (pass) => createHash('sha256').update(pass).digest('hex');

export const login = async (req, res) => {
    try {
        const { email, contrasenia } = req.body;
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
            [email]
        );
        const user = rows[0];
        if (!user || user.contrasenia !== hash(contrasenia)) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }
        const token = jwt.sign(
            { id: user.id_usuario, rol: user.rol, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.json({ token, rol: user.rol });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

export const register = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { documento, apellido, nombres, email, contrasenia, rol } = req.body;
        const foto_path = req.file ? req.file.filename : '';

        await conn.beginTransaction();

        const [result] = await conn.query(
            'INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [documento, apellido, nombres, email, hash(contrasenia), foto_path, rol]
        );

        const id_usuario = result.insertId;

        if (Number(rol) === 1) {
            const { matricula, id_especialidad, descripcion, valor_consulta } = req.body;
            await conn.query(
                'INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)',
                [id_usuario, id_especialidad, matricula, descripcion, valor_consulta]
            );
        } else if (Number(rol) === 2) {
            const { id_obra_social } = req.body;
            await conn.query(
                'INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)',
                [id_usuario, id_obra_social]
            );
        }

        await conn.commit();
        res.status(201).json({ id_usuario, email, rol: Number(rol) });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ mensaje: error.message });
    } finally {
        conn.release();
    }
};
