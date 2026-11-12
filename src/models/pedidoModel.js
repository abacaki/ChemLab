import conexao from '../../db.js';

// Lista todos os pedidos
export function listar(callback) {
    const sql = "SELECT * FROM pedido ORDER BY id_pedido";
    conexao.query(sql, callback);
};

// Cadastra um pedido
export function criar(dados, callback) {
    const sql = "INSERT INTO pedido (data_pedido, status_pedido, valor_total, id_cliente, id_carrinho) VALUES (?, ?, ?, ?, ?)";
    conexao.query(sql, [dados.data_pedido, dados.status_pedido, dados.valor_total, dados.id_cliente, dados.id_carrinho], callback);
};

// Atualiza um pedido
export function atualizar(id, dados, callback) {
    const sql = "UPDATE pedido SET data_pedido = ?, status_pedido = ?, valor_total = ?, id_cliente = ?, id_carrinho = ? WHERE id_pedido = ?";
    conexao.query(sql, [dados.data_pedido, dados.status_pedido, dados.valor_total, dados.id_cliente, dados.id_carrinho, id], callback);
};

// Exclui um pedido
export function excluir(id, callback) {
    const sql = "DELETE FROM pedido WHERE id_pedido = ?";
    conexao.query(sql, [id], callback);
};