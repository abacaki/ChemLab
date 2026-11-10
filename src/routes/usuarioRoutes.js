import express from 'express';
import * as usuarioController from '../controllers/usuarioController.js';
import validarId from '../middlewares/validarId.js';

const router = express.Router();

router.get('/', usuarioController.listar);
router.post('/', usuarioController.criar);
router.put('/:id', validarId, usuarioController.atualizar);
router.delete('/:id', validarId, usuarioController.excluir);

export default router;