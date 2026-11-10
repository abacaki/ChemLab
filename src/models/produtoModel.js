
import conexao from '../../db.js';

// Lista todos os produtos
export function listar(callback) {
    const sql = "SELECT * FROM produto ORDER BY id_produto";
    conexao.query(sql, callback);
};

// Cadastra um produto
export function criar(dados, callback) {
    const sql = "INSERT INTO produto (nome, descricao, estoque, preco) VALUES (?, ?, ?, ?)";
    conexao.query(sql, [dados.nome, dados.descricao, dados.estoque, dados.preco], callback);
};

// Atualiza um produto
export function atualizar(id, dados, callback) {
    const sql = "UPDATE produto SET nome = ?, descricao = ?, estoque = ?, preco = ? WHERE id_produto = ?";
    conexao.query(sql, [dados.nome, dados.descricao, dados.estoque, dados.preco, id], callback);
};

// Exclui um produto
export function excluir(id, callback) {
    const sql = "DELETE FROM produto WHERE id_produto = ?";
    conexao.query(sql, [id], callback);
};
