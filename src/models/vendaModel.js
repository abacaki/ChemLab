import conexao from '../../db.js';

// Lista todas as vendas
export function listar(callback) {
    const sql = "SELECT * FROM venda ORDER BY id_venda";
    conexao.query(sql, callback);
};

// Cadastra uma venda
export function criar(dados, callback) {
    const sql = "INSERT INTO venda (data_venda, forma_pagamento, valor_pago, id_pedido) VALUES (?, ?, ?, ?)";
    conexao.query(sql, [dados.data_venda, dados.forma_pagamento, dados.valor_pago, dados.id_pedido], callback);
};

// Atualiza uma venda
export function atualizar(id, dados, callback) {
    const sql = "UPDATE venda SET data_venda = ?, forma_pagamento = ?, valor_pago = ?, id_pedido = ? WHERE id_venda = ?";
    conexao.query(sql, [dados.data_venda, dados.forma_pagamento, dados.valor_pago, dados.id_pedido, id], callback);
};

// Exclui uma venda
export function excluir(id, callback) {
    const sql = "DELETE FROM venda WHERE id_venda = ?";
    conexao.query(sql, [id], callback);
};