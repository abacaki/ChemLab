
const express = require('express');
const router = express.Router();

const notaFiscalController = require('../controllers/notaFiscalController');
const autenticacao = require('../middlewares/autenticacao');
const validarId = require('../middlewares/validarId');

router.get('/', autenticacao, notaFiscalController.listar);
router.get('/:id', autenticacao, validarId, notaFiscalController.buscarPorId);
router.post('/', autenticacao, notaFiscalController.criar);
router.put('/:id', autenticacao, validarId, notaFiscalController.atualizar);
router.delete('/:id', autenticacao, validarId, notaFiscalController.excluir);

module.exports = router;
