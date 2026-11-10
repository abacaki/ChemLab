import express from 'express';
import * as notaFiscalController from '../controllers/notaFiscalController.js';
import validarId from '../middlewares/validarId.js';

const router = express.Router();

router.get('/', notaFiscalController.listar);
router.post('/', notaFiscalController.criar);
router.put('/:id', validarId, notaFiscalController.atualizar);
router.delete('/:id', validarId, notaFiscalController.excluir);

export default router;