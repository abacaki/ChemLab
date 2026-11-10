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
    const { data_pedido, status_pedido, valor_total, id_cliente } = req.body ?? {};

    if (!data_pedido || !status_pedido || !valor_total || !id_cliente) {
        return res.status(400).json({ 
            erro: "Informe data_pedido, status_pedido, valor_total e id_cliente." 
        });
    }

    const dados = { data_pedido, status_pedido, valor_total, id_cliente };

    pedidoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Pedido cadastrado com sucesso!",
            id: resultado.insertId
        });
    });
}

// Atualiza um pedido
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { data_pedido, status_pedido, valor_total, id_cliente } = req.body ?? {};

    if (!data_pedido || !status_pedido || !valor_total || !id_cliente) {
        return res.status(400).json({ 
            erro: "Informe data_pedido, status_pedido, valor_total e id_cliente para atualizar." 
        });
    }

    const dados = { data_pedido, status_pedido, valor_total, id_cliente };

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