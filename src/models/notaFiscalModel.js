import conexao from '../../db.js';

// Lista todas as notas fiscais
export function listar(callback) {
    const sql = "SELECT * FROM nota_fiscal ORDER BY id_nota";
    conexao.query(sql, callback);
};

// Cadastra uma nota fiscal
export function criar(dados, callback) {
    const sql = "INSERT INTO nota_fiscal (chave_acesso, data_emissao, id_venda) VALUES (?, ?, ?)";
    conexao.query(sql, [dados.chave_acesso, dados.data_emissao, dados.id_venda], callback);
};

// Atualiza uma nota fiscal
export function atualizar(id, dados, callback) {
    const sql = "UPDATE nota_fiscal SET chave_acesso = ?, data_emissao = ?, id_venda = ? WHERE id_nota = ?";
    conexao.query(sql, [dados.chave_acesso, dados.data_emissao, dados.id_venda, id], callback);
};

// Exclui uma nota fiscal
export function excluir(id, callback) {
    const sql = "DELETE FROM nota_fiscal WHERE id_nota = ?";
    conexao.query(sql, [id], callback);
};