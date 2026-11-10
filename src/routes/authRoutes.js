
const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

// Cadastro de usuário
router.post('/cadastro', usuarioController.cadastrar);

// Login de usuário
router.post('/login', usuarioController.login);

module.exports = router;
