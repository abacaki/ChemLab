const endpointProdutos = "http://localhost:3000/produtos";
const imagemPadrao = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80";

let todosProdutos = [];
let produtosDestaque = [];
let categoriaAtual = "Todos";
let textoBusca = "";
let indiceAtual = 0;

async function carregarProdutos() {
  const grade = document.getElementById("lista-produtos");
  if (!grade) return;

  try {
    const resposta = await fetch(endpointProdutos);
    if (!resposta.ok) throw new Error("Erro ao buscar produtos.");

    const dados = await resposta.json();

    todosProdutos = dados.map((item) => {
      const idProduto = item.id_produto ?? item.id;
      return {
        id: idProduto,
        nome: item.nome_produto ?? item.nome ?? "Produto sem nome",
        descricao: item.descricao ?? "Equipamento laboratorial.",
        preco: Number(item.preco_unitario ?? item.preco ?? 0),
        categoria: item.categoria ?? "Geral",
        estoque: item.estoque ?? 0,
        imagem: item.imagem || imagemPadrao
      };
    });

    filtrarProdutos();
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    grade.innerHTML = `<p class="no-products">Erro ao conectar com o servidor.</p>`;
  }
}

function filtrarProdutos() {
  const filtrados = todosProdutos.filter((produto) => {
    const mesmaCategoria =
      categoriaAtual === "Todos" ||
      produto.categoria.toLowerCase() === categoriaAtual.toLowerCase();

    const mesmaBusca = produto.nome.toLowerCase().includes(textoBusca.toLowerCase());

    return mesmaCategoria && mesmaBusca;
  });

  produtosDestaque = filtrados.slice(0, 6);
  indiceAtual = 0;
  mostrarCarrossel();
}

function mostrarCarrossel() {
  const grade = document.getElementById("lista-produtos");
  const contador = document.getElementById("quantidade-resultados");
  const indicadores = document.getElementById("indicadores");

  if (!grade) return;

  if (contador) {
    contador.textContent =
      produtosDestaque.length === 1
        ? "1 produto em destaque"
        : `${produtosDestaque.length} produtos em destaque`;
  }

  if (produtosDestaque.length === 0) {
    grade.innerHTML = `<p class="no-products">Nenhum produto encontrado.</p>`;
    if (indicadores) indicadores.innerHTML = "";
    return;
  }

  const visiveis = produtosDestaque.slice(indiceAtual, indiceAtual + 3);

  grade.innerHTML = visiveis.map((produto) => `
    <article class="product-card">
      <a class="product-image" href="produtos.html">
        <span class="product-tag">Estoque: ${produto.estoque}</span>
        <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='${imagemPadrao}'">
      </a>
      <div class="product-info">
        <span class="product-category">${produto.categoria}</span>
        <h3><a href="produtos.html">${produto.nome}</a></h3>
        <p class="product-description">${produto.descricao}</p>
        <div class="product-bottom">
          <span class="product-price">R$ ${produto.preco.toFixed(2).replace(".", ",")}</span>
          <button type="button" class="add-button" data-id="${produto.id}" ${produto.estoque <= 0 ? "disabled" : ""}>+</button>
        </div>
        ${window.ehAdmin ? `
          <div class="admin-card-actions">
            <button type="button" class="btn-editar" onclick="editarProduto(${produto.id})">Editar</button>
            <button type="button" class="btn-excluir" onclick="excluirProduto(${produto.id})">Excluir</button>
          </div>
        ` : ""}
      </div>
    </article>
  `).join("");

  if (indicadores) {
    const totalPassos = Math.max(1, produtosDestaque.length - 2);
    let bolinhas = "";
    for (let i = 0; i < totalPassos; i++) {
      bolinhas += `<button type="button" class="${i === indiceAtual ? "active" : ""}" data-slide="${i}"></button>`;
    }
    indicadores.innerHTML = bolinhas;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();

  document.getElementById("lista-produtos")?.addEventListener("click", (e) => {
    const botao = e.target.closest(".add-button");
    if (!botao) return;

    const produto = todosProdutos.find((p) => Number(p.id) === Number(botao.dataset.id));
    if (produto && produto.estoque > 0 && typeof adicionarAoCarrinho === "function") {
      adicionarAoCarrinho(produto);
      botao.textContent = "✓";
      setTimeout(() => (botao.textContent = "+"), 700);
    }
  });

  document.getElementById("indicadores")?.addEventListener("click", (e) => {
    const dot = e.target.closest("button[data-slide]");
    if (!dot) return;
    indiceAtual = Number(dot.dataset.slide);
    mostrarCarrossel();
  });

  document.getElementById("anterior")?.addEventListener("click", () => {
    const maxIndice = Math.max(0, produtosDestaque.length - 3);
    indiceAtual = indiceAtual > 0 ? indiceAtual - 1 : maxIndice;
    mostrarCarrossel();
  });

  document.getElementById("proximo")?.addEventListener("click", () => {
    const maxIndice = Math.max(0, produtosDestaque.length - 3);
    indiceAtual = indiceAtual < maxIndice ? indiceAtual + 1 : 0;
    mostrarCarrossel();
  });

  document.getElementById("busca-produtos")?.addEventListener("input", (e) => {
    textoBusca = e.target.value;
    filtrarProdutos();
  });

  document.querySelectorAll("#filtros-categoria .filter-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector("#filtros-categoria .active")?.classList.remove("active");
      btn.classList.add("active");
      categoriaAtual = btn.dataset.filter;
      filtrarProdutos();
    });
  });

  document.querySelectorAll(".category-card[data-category]").forEach((card) => {
    card.addEventListener("click", () => {
      categoriaAtual = card.dataset.category;
      document.querySelectorAll("#filtros-categoria .filter-button").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === categoriaAtual);
      });
      filtrarProdutos();
      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.getElementById("menu-toggle")?.addEventListener("click", () => {
    document.getElementById("main-nav")?.classList.toggle("open");
  });
});