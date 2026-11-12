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
    const { chave_acesso, data_emissao, id_venda } = req.body ?? {};

    if (!chave_acesso || !id_venda) {
        return res.status(400).json({ 
            erro: "Informe chave_acesso e id_venda." 
        });
    }

    const dados = {
        chave_acesso,
        data_emissao: data_emissao || new Date(),
        id_venda
    };

    notaFiscalModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Nota fiscal cadastrada com sucesso!",
            id: resultado.insertId
        });
    });
}

// Atualiza uma nota fiscal
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { chave_acesso, data_emissao, id_venda } = req.body ?? {};

    if (!chave_acesso && !data_emissao && !id_venda) {
        return res.status(400).json({ 
            erro: "Informe ao menos um campo para atualizar." 
        });
    }

    const dados = {
        chave_acesso: chave_acesso || null,
        data_emissao: data_emissao || new Date(),
        id_venda: id_venda || null
    };

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