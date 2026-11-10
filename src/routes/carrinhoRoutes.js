
const express = require('express');
const router = express.Router();

const carrinhoController = require('../controllers/carrinhoController');
const autenticacao = require('../middlewares/autenticacao');
const validarId = require('../middlewares/validarId');

router.get('/', autenticacao, carrinhoController.listar);
router.get('/:id', autenticacao, validarId, carrinhoController.buscarPorId);
router.post('/', autenticacao, carrinhoController.criar);
router.put('/:id', autenticacao, validarId, carrinhoController.atualizar);
router.delete('/:id', autenticacao, validarId, carrinhoController.excluir);

module.exports = router;
