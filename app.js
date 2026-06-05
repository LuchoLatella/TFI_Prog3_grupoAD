import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { mkdirSync } from 'fs';
import { createRequire } from 'module';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();
mkdirSync('uploads', { recursive: true });

const require = createRequire(import.meta.url);
const swaggerUi = require('swagger-ui-express');

import authRoutes from './routes/auth.routes.js';
import especialidadesRoutes from './routes/especialidades.routes.js';
import obrasSocialesRoutes from './routes/obras_sociales.routes.js';
import medicosRoutes from './routes/medicos.routes.js';
import pacientesRoutes from './routes/pacientes.routes.js';
import turnosRoutes from './routes/turnos.routes.js';

const app = express();

app.use(cors({origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
            description: 'API REST para gestión de clínica médica'
        },
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./routes/*.js']
});

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth',          authRoutes);
app.use('/api/v1/especialidades', especialidadesRoutes);
app.use('/api/v1/obras-sociales', obrasSocialesRoutes);
app.use('/api/v1/medicos',        medicosRoutes);
app.use('/api/v1/pacientes',      pacientesRoutes);
app.use('/api/v1/turnos',         turnosRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ mensaje: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
