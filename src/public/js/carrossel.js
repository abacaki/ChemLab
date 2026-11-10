
const listaProdutos = document.getElementById('listaProdutos');
const botaoAnterior = document.getElementById('anterior');
const botaoProximo = document.getElementById('proximo');

let produtos = [];
let indiceAtual = 0;

// Busca os produtos na API
async function carregarProdutos() {
    try {
        const resposta = await fetch('http://localhost:3000/api/produtos');

        if (!resposta.ok) {
            throw new Error('Não foi possível carregar os produtos.');
        }

        produtos = await resposta.json();

        // Exibe os produtos
        mostrarProdutos();

    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);

        if (listaProdutos) {
            listaProdutos.innerHTML =
                '<p>Não foi possível carregar os produtos.</p>';
        }
    }
}

// Mostra até três produtos por vez
function mostrarProdutos() {
    if (!listaProdutos) return;

    listaProdutos.innerHTML = '';

    const produtosExibidos = produtos.slice(indiceAtual, indiceAtual + 3);

    produtosExibidos.forEach(produto => {
        const card = document.createElement('article');

        card.classList.add('cardProduto');

        card.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>${produto.descricao || 'Sem descrição disponível.'}</p>
            <p>Preço: R$ ${Number(produto.preco).toFixed(2)}</p>
            <p>Estoque: ${produto.estoque}</p>
        `;

        listaProdutos.appendChild(card);
    });
}

// Avança os produtos
if (botaoProximo) {
    botaoProximo.addEventListener('click', () => {
        if (indiceAtual + 3 < produtos.length) {
            indiceAtual += 3;
            mostrarProdutos();
        }
    });
}

// Volta os produtos
if (botaoAnterior) {
    botaoAnterior.addEventListener('click', () => {
        if (indiceAtual - 3 >= 0) {
            indiceAtual -= 3;
            mostrarProdutos();
        }
    });
}

// Inicia o carregamento
carregarProdutos();
