import conexao from '../../db.js';

// Lista todos os clientes
export function listar(callback) {
    const sql = "SELECT * FROM cliente ORDER BY id_cliente";
    conexao.query(sql, callback);
};

// Cadastra um cliente
export function criar(dados, callback) {
    const sql = "INSERT INTO cliente (nome, email, telefone) VALUES (?, ?, ?)";
    conexao.query(sql, [dados.nome, dados.email, dados.telefone], callback);
};

// Atualiza um cliente
export function atualizar(id, dados, callback) {
    const sql = "UPDATE cliente SET nome = ?, email = ?, telefone = ? WHERE id_cliente = ?";
    conexao.query(sql, [dados.nome, dados.email, dados.telefone, id], callback);
};

// Exclui um cliente
export function excluir(id, callback) {
    const sql = "DELETE FROM cliente WHERE id_cliente = ?";
    conexao.query(sql, [id], callback);
};