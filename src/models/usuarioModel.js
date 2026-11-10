import conexao from '../../db.js';

// Lista todos os usuários
export function listar(callback) {
    const sql = "SELECT * FROM usuario ORDER BY id_usuario";
    conexao.query(sql, callback);
};

// Cadastra um usuário
export function criar(dados, callback) {
    const sql = "INSERT INTO usuario (login, senha, verificado, id_cliente) VALUES (?, ?, ?, ?)";
    conexao.query(sql, [dados.login, dados.senha, dados.verificado, dados.id_cliente], callback);
};

// Atualiza um usuário
export function atualizar(id, dados, callback) {
    const sql = "UPDATE usuario SET login = ?, senha = ?, verificado = ?, id_cliente = ? WHERE id_usuario = ?";
    conexao.query(sql, [dados.login, dados.senha, dados.verificado, dados.id_cliente, id], callback);
};

// Exclui um usuário
export function excluir(id, callback) {
    const sql = "DELETE FROM usuario WHERE id_usuario = ?";
    conexao.query(sql, [id], callback);
};