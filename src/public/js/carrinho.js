window.imagensPorId = {
  1: "../images/becker.png",
  2: "../images/becker.png",
  3: "../images/becker.png"
};

const imagemPadraoCarrinho = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80";
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function atualizarContador() {
  const contador = document.getElementById("contador-carrinho");
  if (!contador) return;
  const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  contador.textContent = totalItens;
}

function adicionarAoCarrinho(produto) {
  const idProduto = produto.id ?? produto.id_produto;
  const existente = carrinho.find((item) => String(item.id) === String(idProduto));

  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({
      id: idProduto,
      nome: produto.nome ?? produto.nome_produto ?? "Produto",
      preco: Number(produto.preco ?? produto.preco_unitario ?? 0),
      imagem:
        (window.imagensPorId && window.imagensPorId[idProduto]) ||
        produto.imagem ||
        imagemPadraoCarrinho,
      quantidade: 1
    });
  }

  salvarCarrinho();
  atualizarContador();
}

function alterarQuantidade(idProduto, delta) {
  const index = carrinho.findIndex((item) => String(item.id) === String(idProduto));
  if (index === -1) return;

  carrinho[index].quantidade += delta;

  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }

  salvarCarrinho();
  atualizarContador();
  renderizarCarrinho();
}

function removerDoCarrinho(idProduto) {
  carrinho = carrinho.filter((item) => String(item.id) !== String(idProduto));
  salvarCarrinho();
  atualizarContador();
  renderizarCarrinho();
}

function renderizarCarrinho() {
  const container = document.getElementById("itens-carrinho");
  const elItens = document.getElementById("subtotal-itens");
  const elSubtotal = document.getElementById("subtotal-carrinho");
  const elTotal = document.getElementById("total-carrinho");

  if (!container) return;

  const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  const valorTotal = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  if (elItens) elItens.textContent = totalItens;
  if (elSubtotal) elSubtotal.textContent = formatarMoeda(valorTotal);
  if (elTotal) elTotal.textContent = formatarMoeda(valorTotal);

  if (carrinho.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <span>🛒</span>
        <strong>Seu carrinho está vazio</strong>
        <small>Adicione produtos do catálogo para começar.</small>
      </div>
    `;
    return;
  }

  container.innerHTML = carrinho.map((item) => {
    const imgSrc =
      (window.imagensPorId && window.imagensPorId[item.id]) ||
      item.imagem ||
      imagemPadraoCarrinho;

    return `
      <article class="cart-item">
        <img src="${imgSrc}" alt="${item.nome}" onerror="this.src='${imagemPadraoCarrinho}'">
        <div class="cart-item-info">
          <h3>${item.nome}</h3>
          <span class="cart-item-price">${formatarMoeda(item.preco)} cada</span>
        </div>
        <div class="cart-item-controls">
          <button type="button" class="qty-btn" data-action="diminuir" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
          <span class="cart-item-qty">${item.quantidade}</span>
          <button type="button" class="qty-btn" data-action="aumentar" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
          <button type="button" class="remove-btn" data-action="remover" data-id="${item.id}">Remover</button>
        </div>
      </article>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarContador();
  renderizarCarrinho();

  document.getElementById("itens-carrinho")?.addEventListener("click", (e) => {
    const botao = e.target.closest("button[data-action]");
    if (!botao) return;

    const id = botao.dataset.id;
    const acao = botao.dataset.action;

    if (acao === "aumentar") alterarQuantidade(id, 1);
    if (acao === "diminuir") alterarQuantidade(id, -1);
    if (acao === "remover") removerDoCarrinho(id);
  });

  document.getElementById("finalizar-compra")?.addEventListener("click", () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio. Adicione produtos antes de finalizar.");
      return;
    }

    const formaPagamento = document.getElementById("forma-pagamento")?.value || "PIX";
    alert(`Pedido finalizado com sucesso!\nForma de pagamento: ${formaPagamento}`);

    carrinho = [];
    salvarCarrinho();
    atualizarContador();
    renderizarCarrinho();
  });

  document.getElementById("menu-toggle")?.addEventListener("click", () => {
    document.getElementById("main-nav")?.classList.toggle("open");
  });
});