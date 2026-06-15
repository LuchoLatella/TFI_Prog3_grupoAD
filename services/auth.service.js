import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import { pool } from '../config/db.js';
import * as AuthRepository from '../repositories/auth.repository.js';

// Hash SHA-256 de la contraseña
const hash = (pass) => createHash('sha256').update(pass).digest('hex');

export const login = async (email, contrasenia) => {
    const user = await AuthRepository.findByEmail(email);

    // Mismo mensaje para email inexistente o contraseña incorrecta (seguridad)
    if (!user || user.contrasenia !== hash(contrasenia)) {
        const error = new Error('Credenciales incorrectas');
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: user.id_usuario, rol: user.rol, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    return { token, rol: user.rol };
};

export const register = async (datos, fotoPath) => {
    const { documento, apellido, nombres, email, contrasenia, rol } = datos;

    // Verificar que el email no esté en uso
    const existente = await AuthRepository.findByEmailAny(email);
    if (existente) {
        const error = new Error('Ya existe un usuario registrado con ese email');
        error.status = 409;
        throw error;
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const id_usuario = await AuthRepository.insertUsuario(conn, {
            documento,
            apellido,
            nombres,
            email,
            contrasenia: hash(contrasenia),
            foto_path: fotoPath ?? '',
            rol
        });

        // Según el rol, insertar en la tabla correspondiente
        if (Number(rol) === 1) {
            // Médico: requiere matrícula, especialidad, descripción y valor de consulta
            const { matricula, id_especialidad, descripcion, valor_consulta } = datos;
            await AuthRepository.insertMedico(conn, {
                id_usuario, matricula, id_especialidad, descripcion, valor_consulta
            });
        } else if (Number(rol) === 2) {
            // Paciente: requiere obra social
            const { id_obra_social } = datos;
            await AuthRepository.insertPaciente(conn, { id_usuario, id_obra_social });
        }
        // Rol 3 (admin): solo se inserta en usuarios, no tiene tabla propia

        await conn.commit();
        return { id_usuario, email, rol: Number(rol) };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};
