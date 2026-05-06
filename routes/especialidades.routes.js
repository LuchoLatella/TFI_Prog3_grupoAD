// iniciando CRUD

import { Router } from "express";
import {
  getEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad
} from "../controllers/especialidades.controller.js";  //agregando el controlador

const router = Router();

router.get("/", getEspecialidades);
router.post("/", createEspecialidad);

export default router;