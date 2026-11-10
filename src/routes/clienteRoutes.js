
const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController');
const autenticacao = require('../middlewares/autenticacao');
const validarId = require('../middlewares/validarId');

router.get('/', autenticacao, clienteController.listar);
router.get('/:id', autenticacao, validarId, clienteController.buscarPorId);
router.post('/', autenticacao, clienteController.criar);
router.put('/:id', autenticacao, validarId, clienteController.atualizar);
router.delete('/:id', autenticacao, validarId, clienteController.excluir);

module.exports = router;
