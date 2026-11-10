export default function tratarErro(erro, req, res, next) {
    // Mostra o erro no terminal para ajudar na identificação
    console.error("Erro na aplicação:", erro);

    // Erro de dados duplicados no banco
    if (erro.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            erro: "Este registro já está cadastrado."
        });
    }

    // Erro de chave estrangeira
    if (
        erro.code === "ER_NO_REFERENCED_ROW_2" ||
        erro.code === "ER_ROW_IS_REFERENCED_2"
    ) {
        return res.status(400).json({
            erro: "Não foi possível realizar a operação devido a um relacionamento no banco."
        });
    }

    // Erro de conexão com o banco
    if (erro.code === "ECONNREFUSED") {
        return res.status(503).json({
            erro: "Não foi possível conectar ao banco de dados."
        });
    }

    // Erro interno não identificado
    res.status(500).json({
        erro: "Ocorreu um erro interno no servidor."
    });
}