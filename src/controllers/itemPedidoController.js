import * as itemPedidoModel from "../models/itemPedidoModel.js";

// Lista todos os itens dos pedidos
export function listar(req, res, next) {
    itemPedidoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

// Cadastra um item no pedido
export function criar(req, res, next) {
    const { id_produto, quantidade, preco_unitario, id_pedido, subtotal } = req.body ?? {};

    if (!id_produto || !quantidade || !preco_unitario || !id_pedido || subtotal === undefined) {
        return res.status(400).json({ 
            erro: "Informe id_produto, quantidade, preco_unitario, id_pedido e subtotal." 
        });
    }

    const dados = { id_produto, quantidade, preco_unitario, id_pedido, subtotal };

    itemPedidoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Item cadastrado com sucesso!",
            id: resultado.insertId
        });
    });
}

// Atualiza um item do pedido
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { id_produto, quantidade, preco_unitario, id_pedido, subtotal } = req.body ?? {};

    if (!id_produto || !quantidade || !preco_unitario || !id_pedido || subtotal === undefined) {
        return res.status(400).json({ 
            erro: "Informe id_produto, quantidade, preco_unitario, id_pedido e subtotal para atualizar." 
        });
    }

    const dados = { id_produto, quantidade, preco_unitario, id_pedido, subtotal };

    itemPedidoModel.atualizar(id, dados, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Item do pedido não encontrado." });
        }
        return res.status(200).json({ mensagem: "Item do pedido atualizado com sucesso!" });
    });
}

// Exclui um item do pedido
export function excluir(req, res, next) {
    const id = req.params.id;

    itemPedidoModel.excluir(id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Item do pedido não encontrado." });
        }
        return res.status(200).json({ mensagem: "Item do pedido excluído com sucesso!" });
    });
}