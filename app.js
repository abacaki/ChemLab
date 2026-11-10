
// Carrega as configurações do arquivo .env.
// Nele ficam armazenadas informações como a porta do servidor
// e outras configurações que não devem ficar diretamente no código.
require("dotenv").config();

// Importa o Express, responsável por criar o servidor
// e gerenciar as rotas da aplicação.
const express = require("express");

// Importa o CORS, que permite que o front-end
// faça requisições para o back-end.
const cors = require("cors");

// Importa o módulo Path, utilizado para trabalhar
// com caminhos de arquivos e pastas.
const path = require("path");

// Cria a aplicação utilizando o Express.
const app = express();


// CONFIGURAÇÕES DO SERVIDOR

// Permite que aplicações de outras origens
// possam acessar a API do ChemLab.
app.use(cors());

// Permite que o servidor receba dados enviados
// no formato JSON nas requisições.
app.use(express.json());

// Permite receber dados enviados através de formulários.
// O extended: true permite interpretar objetos e arrays.
app.use(express.urlencoded({ extended: true }));


// ARQUIVOS PÚBLICOS DO FRONT-END

// Informa ao Express que os arquivos da pasta public
// podem ser acessados pelo navegador.
// Exemplo: HTML, CSS, JavaScript e imagens.
app.use(express.static(path.join(__dirname, "public")));


// ROTAS DA API

// Cada rota conecta um endereço da API
// ao arquivo responsável por controlar suas operações.

// Rotas relacionadas ao cadastro e gerenciamento de clientes.
app.use("/api/clientes", require("./src/routes/clienteRoutes"));

// Rotas relacionadas aos usuários do sistema.
app.use("/api/usuarios", require("./src/routes/usuarioRoutes"));

// Rotas responsáveis pelo cadastro e gerenciamento dos produtos.
app.use("/api/produtos", require("./src/routes/produtoRoutes"));

// Rotas responsáveis pelo gerenciamento dos carrinhos de compras.
app.use("/api/carrinhos", require("./src/routes/carrinhoRoutes"));

// Rotas responsáveis pelos itens adicionados aos pedidos.
app.use("/api/itens-pedido", require("./src/routes/itemPedidoRoutes"));

// Rotas responsáveis pelo gerenciamento dos pedidos.
app.use("/api/pedidos", require("./src/routes/pedidoRoutes"));

// Rotas responsáveis pelo registro e gerenciamento das vendas.
app.use("/api/vendas", require("./src/routes/vendaRoutes"));

// Rotas responsáveis pela emissão e consulta de notas fiscais.
app.use("/api/notas-fiscais", require("./src/routes/notaFiscalRoutes"));

// Rotas responsáveis pela autenticação e login dos usuários.
app.use("/api/auth", require("./src/routes/authRoutes"));


// ROTA NÃO ENCONTRADA

// Caso alguém tente acessar um endereço que não existe
// na aplicação, o servidor retorna o status HTTP 404.
app.use((req, res) => {
    res.status(404).json({
        erro: "Rota não encontrada."
    });
});


// TRATAMENTO DE ERROS

// Importa o middleware responsável por capturar
// e tratar erros que acontecem durante a execução da API.
app.use(require("./src/middlewares/tratarErro"));


// INICIALIZAÇÃO DO SERVIDOR

// Define a porta do servidor.
// Primeiro tenta utilizar a porta definida no arquivo .env.
// Caso ela não exista, utiliza a porta 3000.
const PORT = process.env.PORT || 3000;

// Inicia o servidor e mostra uma mensagem no terminal
// informando o endereço em que o ChemLab está funcionando.
app.listen(PORT, () => {
    console.log(`ChemLab rodando em http://localhost:${PORT}`);
});
