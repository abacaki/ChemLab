
const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');
const autenticacao = require('../middlewares/autenticacao');
const validarId = require('../middlewares/validarId');

router.get('/', autenticacao, usuarioController.listar);
router.get('/:id', autenticacao, validarId, usuarioController.buscarPorId);
router.put('/:id', autenticacao, validarId, usuarioController.atualizar);
router.delete('/:id', autenticacao, validarId, usuarioController.excluir);

module.exports = router;
