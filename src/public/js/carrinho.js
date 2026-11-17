const API = "http://localhost:3000/api";

let produtos = [];
let carrinho = JSON.parse(localStorage.getItem("chemlab_carrinho")) || [];

// Carrega os produtos do banco de dados
async function carregarProdutos() {
    const resposta = await fetch(`${API}/produtos`);
    const dados = await resposta.json();

    produtos = Array.isArray(dados) ? dados : dados.produtos || [];

    mostrarProdutos();
}

// Exibe os produtos na tela
function mostrarProdutos() {
    const lista = document.getElementById("lista-produtos");

    lista.innerHTML = "";

    produtos.forEach(produto => {
        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <p>R$ ${produto.preco}</p>
            <button onclick="adicionarAoCarrinho(${produto.id_produto})">
                Adicionar
            </button>
        `;

        lista.appendChild(card);
    });
}

// Adiciona um produto ao carrinho
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id_produto === id);

    if (!produto) return;

    const item = carrinho.find(p => p.id === id);

    if (item) {
        item.quantidade++;
    } else {
        carrinho.push({
            id: id,
            nome: produto.nome,
            preco: Number(produto.preco),
            quantidade: 1
        });
    }

    salvarCarrinho();
    mostrarCarrinho();
}

// Salva o carrinho no navegador
function salvarCarrinho() {
    localStorage.setItem(
        "chemlab_carrinho",
        JSON.stringify(carrinho)
    );
}

// Exibe os produtos do carrinho e calcula o total
function mostrarCarrinho() {
    const lista = document.getElementById("itens-carrinho");

    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach(item => {
        total += item.preco * item.quantidade;

        lista.innerHTML += `
            <p>${item.nome} - ${item.quantidade} unidade(s)</p>
        `;
    });

    document.getElementById("total-carrinho").textContent =
        total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
}

// Remove um produto do carrinho
function removerProduto(id) {
    carrinho = carrinho.filter(item => item.id !== id);

    salvarCarrinho();
    mostrarCarrinho();
}

// Finaliza a compra
async function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Carrinho vazio!");
        return;
    }

    alert("Compra pronta para ser enviada!");

    // A integração com a rota de checkout
    // deve ser feita conforme o back-end.
}

// Inicia o sistema
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    mostrarCarrinho();
});
