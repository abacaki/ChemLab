import conexao from '../../db.js';

// Lista todos os carrinhos
export function listar(callback) {
    const sql = "SELECT * FROM carrinho ORDER BY id_carrinho";
    conexao.query(sql, callback);
};

// Cadastra um carrinho
export function criar(dados, callback) {
    const sql = "INSERT INTO carrinho (data_criacao, status_carrinho, id_cliente) VALUES (?, ?, ?)";
    conexao.query(sql, [dados.data_criacao, dados.status_carrinho, dados.id_cliente], callback);
};

// Atualiza um carrinho
export function atualizar(id, dados, callback) {
    const sql = "UPDATE carrinho SET data_criacao = ?, status_carrinho = ?, id_cliente = ? WHERE ID_carrinho = ?";
    conexao.query(sql, [dados.data_criacao, dados.status_carrinho, dados.id_cliente, id], callback);
};

// Exclui um carrinho
export function excluir(id, callback) {
    const sql = "DELETE FROM carrinho WHERE id_carrinho = ?";
    conexao.query(sql, [id], callback);
};

