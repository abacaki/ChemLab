import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import produtoRoutes from './src/routes/produtoRoutes.js';

dotenv.config();
const app = express();
// Permite requisições de outros endereços
app.use(cors());
// Permite receber JSON
app.use(express.json());
// Disponibiliza os arquivos do front-end
app.use(express.static('public'));
// Registra as rotas de produtos
app.use('/api/produtos', produtoRoutes);
// Define a porta do servidor
const PORTA = process.env.PORTA || 3000;
// Inicializa o servidor

app.listen(PORTA, () => {
    console.log(`ChemLab rodando na porta ${PORTA}`);
});