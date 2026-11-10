import express from 'express';
import * as carrinhoController from '../controllers/carrinhoController.js';
import validarId from '../middlewares/validarId.js';

const router = express.Router();

router.get('/', carrinhoController.listar);
router.post('/', carrinhoController.criar);
router.put('/:id', validarId, carrinhoController.atualizar);
router.delete('/:id', validarId, carrinhoController.excluir);

export default router;