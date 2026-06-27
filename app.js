import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { mkdirSync } from 'fs';
import { createRequire } from 'module';
import swaggerJsdoc from 'swagger-jsdoc';
import v1Router from './routes/v1/index.js';

dotenv.config({ override: true });
mkdirSync('uploads', { recursive: true });

const require = createRequire(import.meta.url);
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Clínica Médica API',
            version: '1.0.0',
            description: 'API REST para gestión de clínica médica — grupoAD'
        },
        servers: [
            { url: 'http://localhost:3000/api/v1', description: 'Servidor local' }
        ],
        tags: [
            { name: 'Auth',           description: 'Autenticación — empezar acá' },
            { name: 'Especialidades', description: 'Gestión de especialidades médicas' },
            { name: 'Obras Sociales', description: 'Gestión de obras sociales' },
            { name: 'Médicos',        description: 'Gestión de médicos' },
            { name: 'Pacientes',      description: 'Gestión de pacientes' },
            { name: 'Turnos',         description: 'Turnos, estadísticas y PDF' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./routes/v1/*.js']
});

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', v1Router);

app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ mensaje: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
