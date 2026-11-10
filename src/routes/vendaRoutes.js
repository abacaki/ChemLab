import express from 'express';
import * as vendaController from '../controllers/vendaController.js';
import validarId from '../middlewares/validarId.js';

const router = express.Router();

router.get('/', vendaController.listar);
router.post('/', vendaController.criar);
router.put('/:id', validarId, vendaController.atualizar);
router.delete('/:id', validarId, vendaController.excluir);

export default router;