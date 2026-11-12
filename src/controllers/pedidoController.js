import * as pedidoModel from "../models/pedidoModel.js";

// Lista todos os pedidos
export function listar(req, res, next) {
    pedidoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

// Cadastra um pedido
export function criar(req, res, next) {
    const { data_pedido, status_pedido, valor_total, id_cliente, id_carrinho } = req.body ?? {};

    if (!id_cliente) {
        return res.status(400).json({ erro: "Informe o id_cliente." });
    }

    const dados = {
        data_pedido: data_pedido || new Date(),
        status_pedido: status_pedido ?? 1,
        valor_total: valor_total ?? 0.00,
        id_cliente,
        id_carrinho: id_carrinho || null
    };

    pedidoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Pedido criado com sucesso!",
            id: resultado.insertId
        });
    });
}

// Finaliza um pedido
export function finalizar(req, res, next) {
    const id = req.params.id;

    pedidoModel.finalizar(id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Pedido não encontrado." });
        }
        return res.status(200).json({ mensagem: "Pedido finalizado com sucesso!" });
    });
}

// Atualiza um pedido
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { data_pedido, status_pedido, valor_total, id_cliente, id_carrinho } = req.body ?? {};

    if (status_pedido === undefined && valor_total === undefined && !id_cliente && !id_carrinho) {
        return res.status(400).json({ erro: "Informe ao menos um campo para atualizar." });
    }

    const dados = {
        data_pedido: data_pedido || new Date(),
        status_pedido: status_pedido ?? 1,
        valor_total: valor_total ?? 0.00,
        id_cliente: id_cliente || null,
        id_carrinho: id_carrinho || null
    };

    pedidoModel.atualizar(id, dados, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Pedido não encontrado." });
        }
        return res.status(200).json({ mensagem: "Pedido atualizado com sucesso!" });
    });
}

// Exclui um pedido
export function excluir(req, res, next) {
    const id = req.params.id;

    pedidoModel.excluir(id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Pedido não encontrado." });
        }
        return res.status(200).json({ mensagem: "Pedido excluído com sucesso!" });
    });
}