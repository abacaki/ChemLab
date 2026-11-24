const api = "http://localhost:3000";
const imagemPadraoCarrinho = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80";
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// UTILITÁRIOS
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

  let totalItens = 0;
  for (let i = 0; i < carrinho.length; i++) {
    totalItens += carrinho[i].quantidade;
  }

  contador.textContent = totalItens;
}

// MANIPULAÇÃO DO CARRINHO COM TRAVA DE ESTOQUE
function adicionarAoCarrinho(produto) {
  const idProduto = produto.id ?? produto.id_produto;
  const existente = carrinho.find((item) => String(item.id) === String(idProduto));
  const estoqueMax = Number(produto.estoque ?? existente?.estoque ?? 0);

  if (estoqueMax <= 0) {
    alert("Produto sem estoque no momento.");
    return;
  }

  if (existente && existente.quantidade + 1 > estoqueMax) {
    alert(`Estoque máximo atingido (${estoqueMax} unidade(s)).`);
    return;
  }

  if (existente) {
    existente.quantidade += 1;
    existente.estoque = estoqueMax;
  } else {
    carrinho.push({
      id: idProduto,
      nome: produto.nome ?? produto.nome_produto ?? "Produto",
      preco: Number(produto.preco ?? produto.preco_unitario ?? 0),
      estoque: estoqueMax,
      imagem: produto.imagem || imagemPadraoCarrinho,
      quantidade: 1
    });
  }

  salvarCarrinho();
  atualizarContador();
}

function alterarQuantidade(idProduto, delta) {
  const index = carrinho.findIndex((item) => String(item.id) === String(idProduto));
  if (index === -1) return;

  const novaQtd = carrinho[index].quantidade + delta;

  if (delta > 0 && carrinho[index].estoque !== undefined && novaQtd > carrinho[index].estoque) {
    alert(`Estoque máximo atingido (${carrinho[index].estoque} unidade(s)).`);
    return;
  }

  carrinho[index].quantidade = novaQtd;

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

// RENDERIZAÇÃO
function renderizarCarrinho() {
  const container = document.getElementById("itens-carrinho");
  const elItens = document.getElementById("subtotal-itens");
  const elSubtotal = document.getElementById("subtotal-carrinho");
  const elTotal = document.getElementById("total-carrinho");

  if (!container) return;

  let totalItens = 0;
  let valorTotal = 0;

  for (let i = 0; i < carrinho.length; i++) {
    totalItens += carrinho[i].quantidade;
    valorTotal += carrinho[i].preco * carrinho[i].quantidade;
  }

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

  let html = "";
  for (let i = 0; i < carrinho.length; i++) {
    const item = carrinho[i];
    const imgSrc = item.imagem || imagemPadraoCarrinho;

    html += `
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
  }

  container.innerHTML = html;
}

// EVENTOS E FINALIZAÇÃO COMPLETA DA COMPRA
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

  document.getElementById("finalizar-compra")?.addEventListener("click", async () => {
    const sessao = JSON.parse(localStorage.getItem("chemlab_sessao"));

    if (!sessao || !sessao.id_cliente) {
      alert("Você precisa entrar na sua conta para finalizar a compra.");
      location.href = "login.html";
      return;
    }

    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio. Adicione produtos antes de finalizar.");
      return;
    }

    let valorTotal = 0;
    for (let i = 0; i < carrinho.length; i++) {
      valorTotal += carrinho[i].preco * carrinho[i].quantidade;
    }

    const formaPagamento = document.getElementById("forma-pagamento")?.value || "PIX";

    try {
      // 1. Confere o estoque atual no banco antes de fechar o pedido
      const resProdutos = await fetch(`${api}/produtos`);
      const listaProdutos = resProdutos.ok ? await resProdutos.json() : [];

      for (let i = 0; i < carrinho.length; i++) {
        const item = carrinho[i];
        const prodBanco = listaProdutos.find((p) => String(p.id_produto) === String(item.id));

        if (prodBanco && item.quantidade > prodBanco.estoque) {
          alert(`Estoque insuficiente para "${item.nome}". Disponível: ${prodBanco.estoque}.`);
          return;
        }
      }

      // 2. Cria o pedido
      const resPedido = await fetch(`${api}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status_pedido: 1,
          valor_total: valorTotal,
          id_cliente: sessao.id_cliente
        })
      });

      const dadosPedido = await resPedido.json();
      if (!resPedido.ok) {
        alert(dadosPedido.erro || "Erro ao registrar o pedido.");
        return;
      }

      // 3. Grava cada item em item_pedido e dá baixa no estoque do produto
      for (let i = 0; i < carrinho.length; i++) {
        const item = carrinho[i];

        await fetch(`${api}/itens-pedido`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantidade: item.quantidade,
            preco_unitario: item.preco,
            id_pedido: dadosPedido.id,
            id_produto: item.id
          })
        });

        const prodBanco = listaProdutos.find((p) => String(p.id_produto) === String(item.id));
        if (prodBanco) {
          const novoEstoque = Math.max(0, prodBanco.estoque - item.quantidade);

          await fetch(`${api}/produtos/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nome: prodBanco.nome,
              descricao: prodBanco.descricao,
              preco: prodBanco.preco,
              estoque: novoEstoque,
              categoria: prodBanco.categoria || "Geral",
              imagem: prodBanco.imagem || null
            })
          });
        }
      }

      // 4. Registra a venda
      const resVenda = await fetch(`${api}/vendas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forma_pagamento: formaPagamento,
          valor_pago: valorTotal,
          id_pedido: dadosPedido.id
        })
      });

      const dadosVenda = await resVenda.json();
      if (!resVenda.ok) {
        alert(dadosVenda.erro || "Erro ao registrar o pagamento.");
        return;
      }

      // 5. Gera a nota fiscal (44 dígitos numéricos)
      let chaveAcesso = "";
      for (let i = 0; i < 44; i++) {
        chaveAcesso += Math.floor(Math.random() * 10);
      }

      await fetch(`${api}/notas-fiscais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chave_acesso: chaveAcesso,
          id_venda: dadosVenda.id
        })
      });

      alert(`Pedido #${dadosPedido.id} finalizado com sucesso!\nPagamento: ${formaPagamento}\nChave NF-e: ${chaveAcesso}`);

      carrinho = [];
      salvarCarrinho();
      atualizarContador();
      renderizarCarrinho();

    } catch (erro) {
      console.error("Erro ao finalizar compra:", erro);
      alert("Não foi possível conectar ao servidor.");
    }
  });

  document.getElementById("menu-toggle")?.addEventListener("click", () => {
    document.getElementById("main-nav")?.classList.toggle("open");
  });
});