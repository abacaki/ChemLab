import express from 'express';
import * as produtoController from '../controllers/produtoController.js';
import validarId from '../middlewares/validarId.js';

const router = express.Router();

// Consultar produtos
router.get('/', produtoController.listar);

// Operações administrativas
router.post('/', produtoController.criar);
router.put('/:id', validarId, produtoController.atualizar);
router.delete('/:id', validarId, produtoController.excluir);

export default router;