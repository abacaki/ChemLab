
const express = require('express');
const router = express.Router();

const itemPedidoController = require('../controllers/itemPedidoController');
const autenticacao = require('../middlewares/autenticacao');
const validarId = require('../middlewares/validarId');

router.get('/', autenticacao, itemPedidoController.listar);
router.get('/:id', autenticacao, validarId, itemPedidoController.buscarPorId);
router.post('/', autenticacao, itemPedidoController.criar);
router.put('/:id', autenticacao, validarId, itemPedidoController.atualizar);
router.delete('/:id', autenticacao, validarId, itemPedidoController.excluir);

module.exports = router;
