function validarId(req, res, next) {

    // Recebe o ID enviado pela URL
    const id = req.params.id;

    // Verifica se o ID é um número inteiro positivo
    if (!id || !/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            erro: "ID inválido. Informe um número inteiro positivo."
        });
    }

    // Se estiver correto, continua a requisição
    next();
}

module.exports = validarId;
