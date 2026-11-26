const apiUrl = "http://localhost:3000";

let todosOsProdutos = [];
let categoriaSelecionada = "Todos";
let textoBusca = "";

// MENU MOBILE
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", function () {
    const aberto = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(aberto));
  });
}

// BUSCA PRODUTOS NO SERVIDOR
async function carregarProdutos() {
  const container = document.getElementById("lista-produtos");
  const contador = document.getElementById("quantidade-resultados");

  try {
    const resposta = await fetch(apiUrl + "/produtos");
    todosOsProdutos = await resposta.json();
    renderizarProdutos();
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    if (container) {
      container.innerHTML = '<p class="no-products">Não foi possível carregar os produtos.</p>';
    }
    if (contador) {
      contador.textContent = "0 produtos encontrados";
    }
  }
}

// ENCONTRA O OBJETO DO PRODUTO PELO ID E ENVIA PARA O CARRINHO
function comprarProduto(id) {
  const produto = todosOsProdutos.find(function (item) {
    return String(item.id_produto || item.id) === String(id);
  });

  if (produto && typeof adicionarAoCarrinho === "function") {
    adicionarAoCarrinho(produto);
  }
}

// FILTRA E MONTA OS CARDS NA TELA
function renderizarProdutos() {
  const container = document.getElementById("lista-produtos");
  const contador = document.getElementById("quantidade-resultados");

  if (!container) {
    return;
  }

  const filtrados = [];

  for (let i = 0; i < todosOsProdutos.length; i++) {
    const item = todosOsProdutos[i];
    const categoriaItem = item.categoria || "Geral";
    const nomeItem = (item.nome || "").toLowerCase();
    const descricaoItem = (item.descricao || "").toLowerCase();
    const buscaMinuscula = textoBusca.toLowerCase();

    const bateCategoria = categoriaSelecionada === "Todos" || categoriaItem === categoriaSelecionada;
    const bateBusca = buscaMinuscula === "" || nomeItem.includes(buscaMinuscula) || descricaoItem.includes(buscaMinuscula);

    if (bateCategoria && bateBusca) {
      filtrados.push(item);
    }
  }

  if (contador) {
    if (filtrados.length === 1) {
      contador.textContent = "1 produto encontrado";
    } else {
      contador.textContent = filtrados.length + " produtos encontrados";
    }
  }

  if (filtrados.length === 0) {
    container.innerHTML = '<p class="no-products">Nenhum produto encontrado para este filtro.</p>';
    return;
  }

  let htmlCards = "";

  for (let i = 0; i < filtrados.length; i++) {
    const produto = filtrados[i];
    const id = produto.id_produto || produto.id;
    const categoria = produto.categoria || "Geral";
    const imagem = produto.imagem ? produto.imagem : "../images/becker.png";
    const precoFormatado = Number(produto.preco).toFixed(2).replace(".", ",");
    const estoque = Number(produto.estoque);
    const semEstoque = estoque <= 0;

    let tagHtml = "";
    if (semEstoque) {
      tagHtml = '<span class="product-tag">Esgotado</span>';
    } else {
      tagHtml = '<span class="product-tag">' + estoque + ' em estoque</span>';
    }

    let botaoAddHtml = "";
    if (semEstoque) {
      botaoAddHtml = '<button class="add-button" type="button" disabled title="Produto esgotado">+</button>';
    } else {
      botaoAddHtml = '<button class="add-button" type="button" onclick="comprarProduto(' + id + ')" title="Adicionar ao carrinho">+</button>';
    }

    let botoesAdminHtml = "";
    if (window.ehAdmin) {
      botoesAdminHtml =
        '<div class="admin-card-actions">' +
          '<button type="button" class="btn-editar" onclick="editarProduto(' + id + ')">Editar</button>' +
          '<button type="button" class="btn-excluir" onclick="excluirProduto(' + id + ')">Excluir</button>' +
        '</div>';
    }

    htmlCards +=
      '<article class="product-card">' +
        '<div class="product-image">' +
          tagHtml +
          '<img src="' + imagem + '" alt="' + produto.nome + '">' +
        '</div>' +
        '<div class="product-info">' +
          '<span class="product-category">' + categoria + '</span>' +
          '<h3>' + produto.nome + '</h3>' +
          '<p class="product-description">' + produto.descricao + '</p>' +
          '<div class="product-bottom">' +
            '<span class="product-price">R$ ' + precoFormatado + '</span>' +
            botaoAddHtml +
          '</div>' +
          botoesAdminHtml +
        '</div>' +
      '</article>';
  }

  container.innerHTML = htmlCards;
}

// EVENTOS DOS BOTÕES DE CATEGORIA
const botoesFiltro = document.querySelectorAll("#filtros-categoria .filter-button");

for (let i = 0; i < botoesFiltro.length; i++) {
  botoesFiltro[i].addEventListener("click", function () {
    for (let j = 0; j < botoesFiltro.length; j++) {
      botoesFiltro[j].classList.remove("active");
    }
    this.classList.add("active");
    categoriaSelecionada = this.getAttribute("data-filter");
    renderizarProdutos();
  });
}

// EVENTO DO CAMPO DE BUSCA
const campoBusca = document.getElementById("busca-produtos");

if (campoBusca) {
  campoBusca.addEventListener("input", function () {
    textoBusca = this.value.trim();
    renderizarProdutos();
  });
}

carregarProdutos();