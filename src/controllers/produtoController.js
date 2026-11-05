// Importa o Model
import Produto from '../models/produtoModel.js';

class ProdutoController {
    // Lista todos os produtos
    static async listar(req, res) {
        try {
            const produtos = await Produto.listar();
            res.json(produtos);
        } catch (erro) {
            res.status(500).json({
                mensagem: 'Erro ao listar produtos'
            });
        }
    }
    // Busca produto pelo ID
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const produto = await Produto.buscarPorId(id);
            if (produto.length === 0) {
                return res.status(404).json({
                    mensagem: 'Produto não encontrado'
                });
            }
            res.json(produto[0]);
        } catch (erro) {
            res.status(500).json({
                mensagem: 'Erro ao buscar produto'
            });

        }
    }
}
export default ProdutoController;