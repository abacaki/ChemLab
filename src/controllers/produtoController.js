import * as produtoModel from "../models/produtoModel.js";

// Lista todos os produtos
export function listar(req, res, next) {
    produtoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

// Cadastra um produto
export function criar(req, res, next) {
    const { nome, descricao, preco, estoque } = req.body ?? {};

    if (!nome || !descricao || preco === undefined || estoque === undefined) {
        return res.status(400).json({ 
            erro: "Informe nome, descricao, preco e estoque." 
        });
    }

    const dados = { nome, descricao, preco, estoque };

    produtoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            id: resultado.insertId
        });
    });
}

// Atualiza um produto
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { nome, descricao, preco, estoque } = req.body ?? {};

    if (!nome || !descricao || preco === undefined || estoque === undefined) {
        return res.status(400).json({ 
            erro: "Informe nome, descricao, preco e estoque para atualizar." 
        });
    }

    const dados = { nome, descricao, preco, estoque };

    produtoModel.atualizar(id, dados, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Produto não encontrado." });
        }
        return res.status(200).json({ mensagem: "Produto atualizado com sucesso!" });
    });
}

// Exclui um produto
export function excluir(req, res, next) {
    const id = req.params.id;

    produtoModel.excluir(id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Produto não encontrado." });
        }
        return res.status(200).json({ mensagem: "Produto excluído com sucesso!" });
    });
}