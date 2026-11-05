// Importa a conexão com o banco
import conectarBanco from '../../db.js';
// Cria a classe Produto
class Produto {
    // Lista todos os produtos
    static async listar() {
        const conexao = conectarBanco();
        const resultado = await conexao.query(
            'SELECT * FROM produto'
        );
        return resultado;
    }
    // Busca produto pelo ID
    static async buscarPorId(id) {
        const conexao = conectarBanco();
        const resultado = await conexao.query(
            'SELECT * FROM produto WHERE id_produto = ?',
            [id]
        );
        return resultado;
    }
}
// Exporta a classe
export default Produto;