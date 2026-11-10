
const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedidoController');
const autenticacao = require('../middlewares/autenticacao');
const validarId = require('../middlewares/validarId');

router.get('/', autenticacao, pedidoController.listar);
router.get('/:id', autenticacao, validarId, pedidoController.buscarPorId);
router.post('/', autenticacao, pedidoController.criar);

// Finalizar pedido
router.post('/:id/finalizar', autenticacao, validarId, pedidoController.finalizar);

router.put('/:id', autenticacao, validarId, pedidoController.atualizar);
router.delete('/:id', autenticacao, validarId, pedidoController.excluir);

module.exports = router;
