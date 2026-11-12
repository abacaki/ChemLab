
import conexao from '../../db.js';

// Lista todos os itens dos pedidos
export function listar(callback) {
    const sql = "SELECT * FROM item_pedido ORDER BY id_item";
    conexao.query(sql, callback);
};

// Cadastra um item no pedido
export function criar(dados, callback) {
    const sql = "INSERT INTO item_pedido (id_produto, quantidade, preco_unitario, id_pedido) VALUES (?, ?, ?, ?)";
    conexao.query(sql, [dados.id_produto, dados.quantidade, dados.preco_unitario, dados.id_pedido], callback);
};

// Atualiza um item do pedido
export function atualizar(id, dados, callback) {
    const sql = "UPDATE item_pedido SET id_produto = ?, quantidade = ?, preco_unitario = ?, id_pedido = ? WHERE id_item = ?";
    conexao.query(sql, [dados.id_produto, dados.quantidade, dados.preco_unitario, dados.id_pedido, id], callback);
};

// Exclui um item do pedido
export function excluir(id, callback) {
    const sql = "DELETE FROM item_pedido WHERE id_item = ?";
    conexao.query(sql, [id], callback);
};
