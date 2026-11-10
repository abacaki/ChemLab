import * as pedidoModel from "../models/pedidoModel.js";

export function listar(req, res, next) {
    pedidoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

export function criar(req, res, next) {
    const dados = req.body;
    pedidoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({ mensagem: "Pedido criado com sucesso!", id: resultado.insertId });
    });
}

export function finalizar(req, res, next) {
    const id = req.params.id;
    pedidoModel.finalizar(id, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json({ mensagem: "Pedido finalizado com sucesso!" });
    });
}

export function atualizar(req, res, next) {
    const id = req.params.id;
    const dados = req.body;
    pedidoModel.atualizar(id, dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json({ mensagem: "Pedido atualizado com sucesso!" });
    });
}

export function excluir(req, res, next) {
    const id = req.params.id;
    pedidoModel.excluir(id, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json({ mensagem: "Pedido excluído com sucesso!" });
    });
}