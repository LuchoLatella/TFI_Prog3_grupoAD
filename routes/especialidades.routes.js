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

// GET todos
router.get("/", getEspecialidades);

// GET por ID
router.get("/:id", getEspecialidadById);

// POST crear
router.post("/", createEspecialidad);

// PUT editar
router.put("/:id", updateEspecialidad);

// DELETE lógico
router.delete("/:id", deleteEspecialidad);

export default router;