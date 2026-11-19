import conexao from '../../db.js';

// Lista todos os clientes
export function listar(callback) {
    const sql = "SELECT id_cliente, nome, cpf_cnpj, email, telefone, endereco FROM cliente ORDER BY id_cliente";
    conexao.query(sql, callback);
}

// Cadastra um cliente
export function criar(dados, callback) {
    const sql = "INSERT INTO cliente (nome, cpf_cnpj, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)";
    conexao.query(sql, [dados.nome, dados.cpf_cnpj, dados.email, dados.telefone, dados.endereco], callback);
}

// Atualiza um cliente
export function atualizar(id, dados, callback) {
    const sql = "UPDATE cliente SET nome = ?, cpf_cnpj = ?, email = ?, telefone = ?, endereco = ? WHERE id_cliente = ?";
    conexao.query(sql, [dados.nome, dados.cpf_cnpj, dados.email, dados.telefone, dados.endereco, id], callback);
}

// Exclui um cliente
export function excluir(id, callback) {
    const sql = "DELETE FROM cliente WHERE id_cliente = ?";
    conexao.query(sql, [id], callback);
}