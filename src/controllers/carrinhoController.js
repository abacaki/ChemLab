import * as carrinhoModel from "../models/carrinhoModel.js";

// Lista todos os carrinhos
export function listar(req, res, next) {
    carrinhoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

// Busca um carrinho pelo ID
export function buscarPorId(req, res, next) {
    const id = req.params.id;

    carrinhoModel.buscarPorId(id, (erro, resultado) => {
        if (erro) return next(erro);
        if (!resultado || resultado.length === 0) {
            return res.status(404).json({ erro: "Carrinho não encontrado." });
        }
        return res.status(200).json(resultado[0]);
    });
}

// Cadastra um carrinho
export function criar(req, res, next) {
    const { id_cliente, status_carrinho, data_criacao } = req.body ?? {};

    if (!id_cliente || status_carrinho === undefined) {
        return res.status(400).json({ erro: "Informe o id_cliente e status_carrinho." });
    }

    const dados = {
        data_criacao: data_criacao || new Date(),
        status_carrinho: status_carrinho ?? 1,
        id_cliente
    };

    carrinhoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Carrinho criado com sucesso!",
            id: resultado.insertId
        });
    });
}

// Atualiza um carrinho
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { data_criacao, status_carrinho, id_cliente } = req.body ?? {};

    if (!id_cliente && status_carrinho === undefined && !data_criacao) {
        return res.status(400).json({ erro: "Informe ao menos um campo para atualizar." });
    }

    const dados = {
        data_criacao: data_criacao || new Date(),
        status_carrinho: status_carrinho ?? 1,
        id_cliente: id_cliente
    };

    carrinhoModel.atualizar(id, dados, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Carrinho não encontrado." });
        }
        return res.status(200).json({ mensagem: "Carrinho atualizado com sucesso!" });
    });
}

// Exclui um carrinho
export function excluir(req, res, next) {
    const id = req.params.id;

    carrinhoModel.excluir(id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Carrinho não encontrado." });
        }
        return res.status(200).json({ mensagem: "Carrinho excluído com sucesso!" });
    });
}