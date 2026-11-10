
const express = require('express');
const router = express.Router();

const vendaController = require('../controllers/vendaController');
const autenticacao = require('../middlewares/autenticacao');
const validarId = require('../middlewares/validarId');

router.get('/', autenticacao, vendaController.listar);
router.get('/:id', autenticacao, validarId, vendaController.buscarPorId);
router.post('/', autenticacao, vendaController.criar);
router.put('/:id', autenticacao, validarId, vendaController.atualizar);
router.delete('/:id', autenticacao, validarId, vendaController.excluir);

module.exports = router;
