import express from "express";
import * as clienteController from "../controllers/clienteController.js";

const router = express.Router();

router.get("/", clienteController.listar);
router.post("/", clienteController.criar);
router.put("/:id", clienteController.atualizar);
router.delete("/:id", clienteController.excluir);

export default router;