import express from 'express';
import * as pedidoController from '../controllers/pedidoController.js';
import validarId from '../middlewares/validarId.js';

const router = express.Router();

router.get('/', pedidoController.listar);
router.post('/', pedidoController.criar);
router.post('/:id/finalizar', validarId, pedidoController.finalizar);
router.put('/:id', validarId, pedidoController.atualizar);
router.delete('/:id', validarId, pedidoController.excluir);

export default router;