// iniciando CRUD

import Router from "express";
import {
    getEspecialidades,
    createEspecialidad,
} from "../controllers/especialidades.controller.js";

const router = Router();

router.get("/especialidades", getEspecialidades);
router.post("/especialidades", createEspecialidad);

export default router;