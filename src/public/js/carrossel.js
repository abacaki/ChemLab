const trilho = document.getElementById('trilho');
const grade = document.getElementById('grade');
let produtos = [];
let indice = 0;
let timer = null;

// Consome a API do back-end
async function carregarProdutos() {
  try {
    const resp = await fetch('/api/produtos');
    if (!resp.ok) throw new Error();
    produtos = await resp.json();
    renderCatalogo();
    renderCarrossel();
  } catch {
    grade.innerHTML = '<p>Não foi possível carregar o catálogo. Verifique se o servidor está rodando.</p>';
  }
}

function renderCatalogo() {
  grade.innerHTML = produtos.map((p, n) => `
    <article class="card" style="animation-delay:${n * 60}ms">
      <h3>${esc(p.nome)}</h3>
      <p>${esc(p.descricao)}</p>
      <span class="preco">${fmt(p.preco)}</span>
      <span class="estoque ${p.estoque <= 5 ? 'baixo' : ''}">${p.estoque > 0 ? p.estoque + ' em estoque' : 'Esgotado'}</span>
      <button class="btn" data-id="${p.id_produto}" ${p.estoque === 0 ? 'disabled' : ''}>Adicionar</button>
    </article>`).join('');
}

function renderCarrossel() {
  const destaques = produtos.slice(0, 5);
  trilho.innerHTML = destaques.map((p) => `
    <div class="slide">
      <h3>${esc(p.nome)}</h3>
      <p>${esc(p.descricao)}</p>
      <span class="preco">${fmt(p.preco)}</span>
      <button class="btn" data-id="${p.id_produto}" ${p.estoque === 0 ? 'disabled' : ''}>Adicionar ao carrinho</button>
    </div>`).join('');
  indice = 0;
  mover(0);
  iniciarAutoplay();
}

// move o carrossel: translateX em múltiplos de 100% (cada slide ocupa 100% da janela)
function mover(passo) {
  const total = trilho.children.length;
  if (!total) return;
  indice = (indice + passo + total) % total;
  trilho.style.transform = `translateX(-${indice * 100}%)`;
}

function iniciarAutoplay() {
  clearInterval(timer);
  timer = setInterval(() => mover(1), 5000);
}

document.getElementById('prev').addEventListener('click', () => { mover(-1); iniciarAutoplay(); });
document.getElementById('next').addEventListener('click', () => { mover(1); iniciarAutoplay(); });

// clique em "Adicionar" tanto no catálogo quanto no carrossel
function aoClicarAdicionar(e) {
  const botao = e.target.closest('button[data-id]');
  if (!botao) return;
  const produto = produtos.find((p) => p.id_produto === Number(botao.dataset.id));
  if (produto) adicionarAoCarrinho(produto);
}
grade.addEventListener('click', aoClicarAdicionar);
trilho.addEventListener('click', aoClicarAdicionar);

carregarProdutos();
