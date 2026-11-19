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
    const { nome, cpf_cnpj, email, telefone, endereco } = req.body ?? {};

    if (!nome || !cpf_cnpj || !email || !telefone) {
        return res.status(400).json({ erro: "Preencha nome, CPF/CNPJ, e-mail e telefone." });
    }

    const dados = { nome, cpf_cnpj, email, telefone, endereco: endereco || null };

    clienteModel.criar(dados, (erro, resultado) => {
        if (erro) {
            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ erro: "E-mail ou CPF/CNPJ já cadastrado." });
            }
            return next(erro);
        }

        return res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso!",
            id: resultado.insertId
        });
    });
}

// Atualiza um cliente
export function atualizar(req, res, next) {
    const id = req.params.id;
    const { nome, cpf_cnpj, email, telefone, endereco } = req.body ?? {};

    if (!nome || !cpf_cnpj || !email || !telefone) {
        return res.status(400).json({ erro: "Preencha nome, CPF/CNPJ, e-mail e telefone para atualizar." });
    }

    const dados = { nome, cpf_cnpj, email, telefone, endereco: endereco || null };

    clienteModel.atualizar(id, dados, (erro, resultado) => {
        if (erro) {
            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ erro: "E-mail ou CPF/CNPJ já cadastrado." });
            }
            return next(erro);
        }
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