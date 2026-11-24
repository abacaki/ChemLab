const endpointProdutos = "http://localhost:3000/produtos";
const imagemPadrao = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80";

let todosProdutos = [];
let categoriaAtual = "Todos";
let textoBusca = "";

async function carregarCatalogo() {
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
        descricao: item.descricao ?? "Item para uso laboratorial.",
        preco: Number(item.preco_unitario ?? item.preco ?? 0),
        categoria: item.categoria ?? "Geral",
        estoque: item.estoque ?? 0,
        imagem: item.imagem || imagemPadrao
      };
    });

    renderizarCatalogo();
  } catch (erro) {
    console.error("Erro ao carregar catálogo:", erro);
    grade.innerHTML = `<p class="no-products">Erro ao conectar com o servidor.</p>`;
  }
}

function renderizarCatalogo() {
  const grade = document.getElementById("lista-produtos");
  const contador = document.getElementById("quantidade-resultados");

  const filtrados = todosProdutos.filter((produto) => {
    const mesmaCategoria =
      categoriaAtual === "Todos" ||
      produto.categoria.toLowerCase() === categoriaAtual.toLowerCase();

    const mesmaBusca = produto.nome.toLowerCase().includes(textoBusca.toLowerCase());

    return mesmaCategoria && mesmaBusca;
  });

  if (contador) {
    contador.textContent =
      filtrados.length === 1 ? "1 produto encontrado" : `${filtrados.length} produtos encontrados`;
  }

  if (filtrados.length === 0) {
    grade.innerHTML = `<p class="no-products">Nenhum produto encontrado.</p>`;
    return;
  }

  grade.innerHTML = filtrados.map((produto) => `
    <article class="product-card">
      <div class="product-image">
        <span class="product-tag">Estoque: ${produto.estoque}</span>
        <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='${imagemPadrao}'">
      </div>
      <div class="product-info">
        <span class="product-category">${produto.categoria}</span>
        <h3>${produto.nome}</h3>
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
}

document.addEventListener("DOMContentLoaded", () => {
  carregarCatalogo();

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

  document.getElementById("busca-produtos")?.addEventListener("input", (e) => {
    textoBusca = e.target.value;
    renderizarCatalogo();
  });

  document.querySelectorAll("#filtros-categoria .filter-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector("#filtros-categoria .active")?.classList.remove("active");
      btn.classList.add("active");
      categoriaAtual = btn.dataset.filter;
      renderizarCatalogo();
    });
  });

  document.getElementById("menu-toggle")?.addEventListener("click", () => {
    document.getElementById("main-nav")?.classList.toggle("open");
  });
});