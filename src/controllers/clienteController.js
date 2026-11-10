import * as clienteModel from "../models/clienteModel.js";

// Lista todos os clientes
export function listar(req, res, next) {
    clienteModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

// Cadastra um cliente
export function criar(req, res, next) {
    const { nome, email, telefone } = req.body ?? {};

    if (!nome || !email) {
        return res.status(400).json({ erro: "Informe pelo menos nome e email." });
    }

    const dados = { nome, email, telefone };

    clienteModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso!",
            id: resultado.insertId
        });
    });
}

// Atualiza um cliente
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { nome, email, telefone } = req.body ?? {};

    if (!nome || !email) {
        return res.status(400).json({ erro: "Informe pelo menos nome e email para atualizar." });
    }

    const dados = { nome, email, telefone };

    clienteModel.atualizar(id, dados, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Cliente não encontrado." });
        }
        return res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });
    });
}

// Exclui um cliente
export function excluir(req, res, next) {
    const id = req.params.id;

    clienteModel.excluir(id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Cliente não encontrado." });
        }
        return res.status(200).json({ mensagem: "Cliente excluído com sucesso!" });
    });
}