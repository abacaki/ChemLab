
const express = require('express');
const router = express.Router();

const produtoController = require('../controllers/produtoController');
const autenticacao = require('../middlewares/autenticacao');
const validarId = require('../middlewares/validarId');

// Consultar produtos sem precisar fazer login
router.get('/', produtoController.listar);
router.get('/:id', validarId, produtoController.buscarPorId);

// Operações administrativas
router.post('/', autenticacao, produtoController.criar);
router.put('/:id', autenticacao, validarId, produtoController.atualizar);
router.delete('/:id', autenticacao, validarId, produtoController.excluir);

module.exports = router;
