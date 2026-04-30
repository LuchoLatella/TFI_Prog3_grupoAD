// iniciando CRUD

import Router from "express";
import {
    getEspecialidades,
    createEspecialidad,
} from "../controllers/especialidades.controller.js";

const router = Router();

router.get("/", getEspecialidades);
router.post("/", createEspecialidad);

export default router;