import express from 'express';

import ProdutoController from '../controllers/produtoController.js';
const router = express.Router();
// Rota para listar produtos
router.get('/', ProdutoController.listar);
// Rota para buscar produto pelo ID
router.get('/:id', ProdutoController.buscarPorId);
export default router;