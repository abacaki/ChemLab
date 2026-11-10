import "dotenv/config";
import express from "express";
import cors from "cors";
import conexao from "./db.js";

// Importa o middleware responsável por tratar erros
import tratarErro from "./src/middlewares/tratarErro.js";

// Importa as rotas de cada parte do sistema
import clienteRoutes from "./src/routes/clienteRoutes.js";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import produtoRoutes from "./src/routes/produtoRoutes.js";
import carrinhoRoutes from "./src/routes/carrinhoRoutes.js";
import itemPedidoRoutes from "./src/routes/itemPedidoRoutes.js";
import pedidoRoutes from "./src/routes/pedidoRoutes.js";
import vendaRoutes from "./src/routes/vendaRoutes.js";
import notaFiscalRoutes from "./src/routes/notaFiscalRoutes.js";

const app = express();

const PORTA = Number(process.env.PORT || process.env.PORTA || 3000);

app.use(cors());

// Permite receber e interpretar dados no formato JSON
app.use(express.json());

// Permite receber dados enviados por formulários
app.use(express.urlencoded({ extended: true }));

// Cria uma rota inicial para verificar se a API está funcionando
app.get("/", (req, res) => {
    
    res.status(200).json({ mensagem: "API do ChemLab funcionando" });
});

// Define o endereço das rotas de carrinhos
app.use("/carrinhos", carrinhoRoutes);

// Define o endereço das rotas de clientes
app.use("/clientes", clienteRoutes);

// Define o endereço das rotas de usuários
app.use("/usuarios", usuarioRoutes);

// Define o endereço das rotas de produtos
app.use("/produtos", produtoRoutes);

// Define o endereço das rotas dos itens dos pedidos
app.use("/itens-pedido", itemPedidoRoutes);

// Define o endereço das rotas de pedidos
app.use("/pedidos", pedidoRoutes);

// Define o endereço das rotas de vendas
app.use("/vendas", vendaRoutes);

// Define o endereço das rotas de notas fiscais
app.use("/notas-fiscais", notaFiscalRoutes);

// Middleware para identificar endereços que não existem na API
app.use((req, res) => {
    // Retorna o status 404 quando uma rota não é encontrada
    res.status(404).json({ erro: "Rota não encontrada" });
});

// Middleware responsável por tratar os erros da aplicação
app.use(tratarErro);

// Tenta conectar ao banco de dados antes de iniciar o servidor
conexao.connect((erro) => {

    // Verifica se ocorreu algum erro na conexão
    if (erro) {

        // Mostra a mensagem de erro no terminal
        console.error("Erro ao conectar ao banco:", erro.code || erro.message);

        // Encerra a aplicação porque não foi possível conectar ao banco
        process.exit(1);
    }

    // Informa que a conexão com o banco foi realizada
    console.log("Conectado ao banco de dados");

    // Inicia o servidor utilizando a porta definida anteriormente
    const servidor = app.listen(PORTA, () => {

        //Mostra no Terminal
        console.log(`Servidor iniciado em http://localhost:${PORTA}`);
    });

    // Verifica se ocorreu algum erro ao iniciar o servidor
    servidor.on("error", (erro) => {

        console.error("Erro ao iniciar servidor:", erro.code || erro.message);

        // Encerra a conexão com o banco
        conexao.end(() => process.exit(1));
    });
});
