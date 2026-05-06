// iniciando CRUD

import { Router } from "express";
import { body, param } from "express-validator";

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
router.get(
  "/:id",
  param("id").isInt().withMessage("El ID debe ser numérico"),
  getEspecialidadById
);

// POST crear
router.post(
  "/",
  body("nombre")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 3 }).withMessage("Mínimo 3 caracteres"),
  createEspecialidad
);

// PUT editar
router.put(
  "/:id",
  param("id").isInt(),
  body("nombre").notEmpty(),
  updateEspecialidad
);

// DELETE lógico
router.delete(
  "/:id",
  param("id").isInt(),
  deleteEspecialidad
);

export default router;