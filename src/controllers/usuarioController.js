import * as usuarioModel from "../models/usuarioModel.js";

// Lista todos os usuários
export function listar(req, res, next) {
    usuarioModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

// Cadastra um usuário
export function criar(req, res, next) {
    const { login, senha, verificado, id_cliente } = req.body ?? {};

    if (!login || !senha || !id_cliente || verificado === undefined) {
        return res.status(400).json({ 
            erro: "Informe login, senha, id_cliente e verificado." 
        });
    }

    const dados = { login, senha, verificado, id_cliente };

    usuarioModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            id: resultado.insertId
        });
    });
}

// Atualiza um usuário
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { login, senha, verificado, id_cliente } = req.body ?? {};

    if (!login || !senha || !id_cliente || verificado === undefined) {
        return res.status(400).json({ 
            erro: "Informe login, senha, id_cliente e verificado para atualizar." 
        });
    }

    const dados = { login, senha, verificado, id_cliente };

    usuarioModel.atualizar(id, dados, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }
        return res.status(200).json({ mensagem: "Usuário atualizado com sucesso!" });
    });
}

// Exclui um usuário
export function excluir(req, res, next) {
    const id = req.params.id;

    usuarioModel.excluir(id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }
        return res.status(200).json({ mensagem: "Usuário excluído com sucesso!" });
    });
}