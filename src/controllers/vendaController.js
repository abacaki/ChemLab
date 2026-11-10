import * as vendaModel from "../models/vendaModel.js";

// Lista todas as vendas
export function listar(req, res, next) {
    vendaModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

// Cadastra uma venda
export function criar(req, res, next) {
    const { data_venda, forma_pagamento, valor_pago, id_pedido } = req.body ?? {};

    if (!data_venda || !forma_pagamento || !valor_pago || !id_pedido) {
        return res.status(400).json({ 
            erro: "Informe data_venda, forma_pagamento, valor_pago e id_pedido." 
        });
    }

    const dados = { data_venda, forma_pagamento, valor_pago, id_pedido };

    vendaModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Venda cadastrada com sucesso!",
            id: resultado.insertId
        });
    });
}

// Atualiza uma venda
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { data_venda, forma_pagamento, valor_pago, id_pedido } = req.body ?? {};

    if (!data_venda || !forma_pagamento || !valor_pago || !id_pedido) {
        return res.status(400).json({ 
            erro: "Informe data_venda, forma_pagamento, valor_pago e id_pedido para atualizar." 
        });
    }

    const dados = { data_venda, forma_pagamento, valor_pago, id_pedido };

    vendaModel.atualizar(id, dados, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Venda não encontrada." });
        }
        return res.status(200).json({ mensagem: "Venda atualizada com sucesso!" });
    });
}

// Exclui uma venda
export function excluir(req, res, next) {
    const id = req.params.id;

    vendaModel.excluir(id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Venda não encontrada." });
        }
        return res.status(200).json({ mensagem: "Venda excluída com sucesso!" });
    });
}