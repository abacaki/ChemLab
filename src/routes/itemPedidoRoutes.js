import express from 'express';
import * as itemPedidoController from '../controllers/itemPedidoController.js';
import validarId from '../middlewares/validarId.js';

const router = express.Router();

router.get('/', itemPedidoController.listar);
router.post('/', itemPedidoController.criar);
router.put('/:id', validarId, itemPedidoController.atualizar);
router.delete('/:id', validarId, itemPedidoController.excluir);

export default router;