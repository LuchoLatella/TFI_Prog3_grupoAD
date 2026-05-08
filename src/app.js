const express = require('express');
const pacientesRoutes = require('./routes/pacientes.routes');
const notFound = require('./middlewares/notFound');

const app = express();

app.use(express.json());

app.use('/api/v1/pacientes', pacientesRoutes);

app.use(notFound);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
