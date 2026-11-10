import * as notaFiscalModel from "../models/notaFiscalModel.js";

// Lista todas as notas fiscais
export function listar(req, res, next) {
    notaFiscalModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

// Cadastra uma nota fiscal
export function criar(req, res, next) {
    const { data_venda, forma_pagamento, valor_pago, id_pedido } = req.body ?? {};

    if (!data_venda || !forma_pagamento || !valor_pago || !id_pedido) {
        return res.status(400).json({ 
            erro: "Informe data_venda, forma_pagamento, valor pago e id_pedido." 
        });
    }

    const dados = { data_venda, forma_pagamento, valor_pago, id_pedido };

    notaFiscalModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Nota fical cadastrada com sucesso!",
            id: resultado.insertId
        });
    });
}

// Atualiza uma nota fiscal
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { data_venda, forma_pagamento, valor_pago, id_pedido } = req.body ?? {};

    if (!data_venda || !forma_pagamento || !valor_pago || !id_pedido) {
        return res.status(400).json({ 
            erro: "Informe data_venda, forma_pagamento, valor pago e id_pedido para atualizar." 
        });
    }

    const dados = { data_venda, forma_pagamento, valor_pago, id_pedido };

    notaFiscalModel.atualizar(id, dados, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Nota Fiscal não encontrada." });
        }
        return res.status(200).json({ mensagem: "Nota Fiscal atualizada com sucesso!" });
    });
}

// Exclui uma nota fiscal
export function excluir(req, res, next) {
    const id = req.params.id;

    notaFiscalModel.excluir(id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Nota Fiscal não encontrada." });
        }
        return res.status(200).json({ mensagem: "Nota Fiscal excluída com sucesso!" });
    });
}