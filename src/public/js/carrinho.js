const produtos = [
  { id: 1, nome: "Béquer de vidro 250 ml", categoria: "Vidrarias", descricao: "Recipiente graduado para uso em laboratório.", preco: 18.90, imagem: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=700&q=80" },
  { id: 2, nome: "Erlenmeyer 500 ml", categoria: "Vidrarias", descricao: "Frasco de vidro para misturas e soluções.", preco: 32.50, imagem: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=700&q=80" },
  { id: 3, nome: "Kit de tubos de ensaio", categoria: "Vidrarias", descricao: "Tubos para amostras e experimentos.", preco: 24.90, imagem: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&w=700&q=80" },
  { id: 4, nome: "Óculos de proteção", categoria: "Acessórios", descricao: "Proteção ocular para atividades laboratoriais.", preco: 29.90, imagem: "https://images.unsplash.com/photo-1581093458791-9d42e3c5e8a8?auto=format&fit=crop&w=700&q=80" },
  { id: 5, nome: "Microscópio educacional", categoria: "Equipamentos", descricao: "Equipamento para observação de amostras.", preco: 389.00, imagem: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=700&q=80" },
  { id: 6, nome: "Pipeta graduada", categoria: "Vidrarias", descricao: "Instrumento para medição e transferência.", preco: 16.00, imagem: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=700&q=80" },
  { id: 7, nome: "Balança de precisão", categoria: "Equipamentos", descricao: "Pesagem de pequenas quantidades.", preco: 249.90, imagem: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=700&q=80" },
  { id: 8, nome: "Solução indicadora", categoria: "Reagentes", descricao: "Produto demonstrativo para catálogo acadêmico.", preco: 42.00, imagem: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=700&q=80" }
];

const destaque = 6;

//guardar o carrinho no navegador.
const chave_carrinho = "chemlab_carrinho";

// Recupera os produtos que já estavam salvos no carrinho.
// JSON.parse transforma o texto armazenado em um array JavaScript.
// Se não existir nenhum carrinho salvo, começa com um array vazio.
let carrinho = JSON.parse(localStorage.getItem(chave_carrinho) || "[]");

// Define a categoria inicial como Todos.
let categoriaAtual = "Todos";


// Transforma um número em formato de moeda brasileira (R$).
// Exemplo: 18.90 será exibido como R$ 18,90.
const formatarMoeda = valor => valor.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});


// Recebe uma lista de produtos e mostra os produtos na página.
// Caso nenhuma lista seja informada, utiliza todos os produtos.
function mostrarProdutos(lista = produtos) {

  // Busca no HTML o espaço onde os produtos serão exibidos.
  const area = document.getElementById("lista-produtos");

  // Busca o elemento que mostra a quantidade de resultados.
  const quantidade = document.getElementById("quantidade-resultados");

  // Se a área dos produtos não existir no HTML, interrompe a função.
  if (!area) return;

  // Mostra somente os primeiros 6 produtos da lista.
  const exibidos = lista.slice(0, destaque);

  // Atualiza a quantidade de produtos exibidos na tela.
  quantidade.textContent = `${exibidos.length} produto(s)`;

  // Verifica se a lista está vazia.
  if (exibidos.length === 0) {

    // Mostra uma mensagem informando que nenhum produto foi encontrado.
    area.innerHTML = '<p class="no-products">Nenhum produto encontrado. Tente outra busca.</p>';

    // Atualiza o carrossel, caso exista essa função.
    window.atualizarCarrossel?.(true);

    // Encerra a função.
    return;
  }

  // Percorre os produtos e cria um cartão HTML para cada um.
  // O map transforma cada produto em um trecho de HTML.
  area.innerHTML = exibidos.map(produto => `

    <article class="product-card">

      <div class="product-image">

        <!-- Exibe a imagem e o nome do produto como texto alternativo. -->
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">

        <!-- Mostra a categoria do produto. -->
        <span class="product-tag">${produto.categoria}</span>

      </div>

      <div class="product-info">

        <span class="product-category">${produto.categoria}</span>

        <!-- Mostra o nome do produto. -->
        <h3>${produto.nome}</h3>

        <!-- Mostra a descrição do produto. -->
        <p class="product-description">${produto.descricao}</p>

        <div class="product-bottom">

          <!-- Mostra o preço formatado em reais. -->
          <strong class="product-price">${formatarMoeda(produto.preco)}</strong>

          <!-- Botão que adiciona o produto ao carrinho. -->
          <button class="add-button" type="button" data-add="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho">+</button>

        </div>
      </div>
    </article>

  `).join("");

  // Atualiza o carrossel depois de exibir os produtos.
  window.atualizarCarrossel?.(true);
}

// Salva o carrinho no localStorage do navegador.
// JSON.stringify transforma o array em texto para poder armazená-lo.
function salvarCarrinho() {
  localStorage.setItem(chave_carrinho, JSON.stringify(carrinho));
}

// Recebe o ID de um produto e adiciona ele ao carrinho.
function adicionarAoCarrinho(id) {

  // Procura o produto na lista utilizando seu ID.
  // Number converte o ID recebido para número.
  const produto = produtos.find(item => item.id === Number(id));

  // Se o produto não existir, interrompe a função.
  if (!produto) return;

  // Verifica se o produto já está no carrinho.
  const itemExistente = carrinho.find(item => item.id === produto.id);

  // Se já existir, aumenta sua quantidade em 1.
  if (itemExistente) {
    itemExistente.quantidade++;

  } else {

    // Se não existir, adiciona uma cópia do produto
    // ao carrinho com quantidade inicial igual a 1.
    carrinho.push({ ...produto, quantidade: 1 });
  }

  // Salva as alterações no navegador.
  salvarCarrinho();

  // Atualiza a exibição do carrinho.
  mostrarCarrinho();
}


// Recebe o ID do produto e a variação da quantidade.
// Exemplo: 1 aumenta uma unidade; -1 diminui uma unidade.
function alterarQuantidade(id, variacao) {

  // Procura o produto dentro do carrinho.
  const item = carrinho.find(produto => produto.id === Number(id));

  // Se o produto não for encontrado, encerra a função.
  if (!item) return;

  // Altera a quantidade do produto.
  item.quantidade += variacao;

  // Se a quantidade chegar a zero ou menos, remove o produto.
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(produto => produto.id !== Number(id));
  }

  // Salva as alterações no navegador.
  salvarCarrinho();

  // Atualiza a exibição do carrinho.
  mostrarCarrinho();
}



// Remove completamente um produto do carrinho utilizando seu ID.
function removerDoCarrinho(id) {

  // Cria um novo array contendo todos os produtos,
  // menos aquele que possui o ID informado.
  carrinho = carrinho.filter(item => item.id !== Number(id));

  // Salva o carrinho atualizado.
  salvarCarrinho();

  // Atualiza a tela do carrinho.
  mostrarCarrinho();
}



// Atualiza todas as informações do carrinho na página.
function mostrarCarrinho() {

  // Busca os elementos do HTML que serão atualizados.
  const area = document.getElementById("itens-carrinho");
  const contador = document.getElementById("contador-carrinho");
  const subtotalItens = document.getElementById("subtotal-itens");
  const subtotal = document.getElementById("subtotal-carrinho");
  const total = document.getElementById("total-carrinho");
  const botaoFinalizar = document.getElementById("finalizar-compra");

  // Soma a quantidade de todos os produtos do carrinho.
  const quantidadeTotal = carrinho.reduce((soma, item) => soma + item.quantidade, 0);

  // Atualiza o contador de produtos no ícone do carrinho.
  if (contador) contador.textContent = quantidadeTotal;

  // Se a área do carrinho não existir, encerra a função.
  if (!area) return;

  // Calcula o valor total multiplicando o preço pela quantidade
  // de cada produto e somando todos os resultados.
  const valorTotal = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  // Atualiza a quantidade total de itens.
  subtotalItens.textContent = quantidadeTotal;

  // Atualiza o valor do subtotal.
  subtotal.textContent = formatarMoeda(valorTotal);

  // Atualiza o valor total da compra.
  total.textContent = formatarMoeda(valorTotal);

  // Desabilita o botão de finalizar compra quando o carrinho estiver vazio.
  botaoFinalizar.disabled = carrinho.length === 0;

  // Verifica se o carrinho está vazio.
  if (carrinho.length === 0) {

    // Exibe uma mensagem informando que não existem produtos no carrinho.
    area.innerHTML = `
      <div class="empty-cart">
        <span>🛒</span>
        <strong>Seu carrinho está vazio</strong>
        <small>Adicione produtos do catálogo para começar.</small>
      </div>`;

    // Encerra a função.
    return;
  }

  // Percorre os produtos do carrinho e cria o HTML de cada item.
  area.innerHTML = carrinho.map(item => `

    <div class="cart-row">

      <div>

        <!-- Mostra o nome do produto. -->
        <div class="cart-product-name">${item.nome}</div>

        <!-- Mostra o preço individual do produto. -->
        <div class="cart-product-price">${formatarMoeda(item.preco)} cada</div>

      </div>

      <div class="quantity-control">

        <!-- Botão para diminuir a quantidade. -->
        <button type="button" data-minus="${item.id}" aria-label="Diminuir quantidade">−</button>

        <!-- Mostra a quantidade atual do produto. -->
        <span>${item.quantidade}</span>

        <!-- Botão para aumentar a quantidade. -->
        <button type="button" data-plus="${item.id}" aria-label="Aumentar quantidade">+</button>

      </div>

      <!-- Botão para remover completamente o produto. -->
      <button class="remove-item" type="button" data-remove="${item.id}" aria-label="Remover produto">×</button>

    </div>

  `).join("");
}



// Adiciona um evento de clique ao documento inteiro.
// Assim, conseguimos identificar os cliques nos botões
// mesmo quando eles são criados dinamicamente pelo JavaScript.
document.addEventListener("click", event => {

  // Identifica se o usuário clicou no botão de adicionar.
  const adicionar = event.target.closest("[data-add]");

  // Identifica se o usuário clicou no botão de aumentar.
  const aumentar = event.target.closest("[data-plus]");

  // Identifica se o usuário clicou no botão de diminuir.
  const diminuir = event.target.closest("[data-minus]");

  // Identifica se o usuário clicou no botão de remover.
  const remover = event.target.closest("[data-remove]");

  // Identifica se o usuário clicou em uma categoria.
  const categoria = event.target.closest("[data-category]");

  // Identifica se o usuário clicou em um filtro.
  const filtro = event.target.closest("[data-filter]");

  // Executa a função de adicionar o produto.
  if (adicionar) adicionarAoCarrinho(adicionar.dataset.add);

  // Aumenta a quantidade do produto em uma unidade.
  if (aumentar) alterarQuantidade(aumentar.dataset.plus, 1);

  // Diminui a quantidade do produto em uma unidade.
  if (diminuir) alterarQuantidade(diminuir.dataset.minus, -1);

  // Remove completamente o produto do carrinho.
  if (remover) removerDoCarrinho(remover.dataset.remove);

  // Verifica se uma categoria foi selecionada.
  if (categoria) {

    // Atualiza a categoria selecionada.
    categoriaAtual = categoria.dataset.category;

    // Desloca a página suavemente até a seção de produtos.
    document.querySelector("#produtos").scrollIntoView({ behavior: "smooth" });

    // Atualiza os produtos exibidos.
    atualizarCatalogo();
  }

  // Verifica se um filtro foi selecionado.
  if (filtro) {

    // Atualiza a categoria com o filtro escolhido.
    categoriaAtual = filtro.dataset.filter;

    // Atualiza o catálogo de produtos.
    atualizarCatalogo();
  }
});


// Atualiza os produtos conforme a categoria e a pesquisa.
function atualizarCatalogo() {

  // Pega o texto digitado na caixa de pesquisa.
  // O toLowerCase transforma o texto em letras minúsculas.
  const termo = (document.getElementById("busca-produtos")?.value || "").toLowerCase();

  // Filtra os produtos de acordo com a categoria e o texto pesquisado.
  const filtrados = produtos.filter(produto => {

    // Verifica se o produto pertence à categoria selecionada.
    // Se a categoria for Todos, aceita qualquer produto.
    const combinaCategoria = categoriaAtual === "Todos" || produto.categoria === categoriaAtual;

    // Verifica se o nome ou a descrição possuem o texto pesquisado.
    const combinaBusca = produto.nome.toLowerCase().includes(termo) ||
      produto.descricao.toLowerCase().includes(termo);

    // Retorna verdadeiro somente se as duas condições forem atendidas.
    return combinaCategoria && combinaBusca;
  });

  // Percorre todos os botões de filtro existentes na página.
  document.querySelectorAll("[data-filter]").forEach(botao => {

    // Adiciona a classe active ao botão da categoria selecionada.
    // Remove essa classe dos outros botões.
    botao.classList.toggle("active", botao.dataset.filter === categoriaAtual);
  });

  // Mostra na página somente os produtos filtrados.
  mostrarProdutos(filtrados);
}

// Adiciona um evento de input ao campo de pesquisa.
// Toda vez que o usuário digitar, o catálogo será atualizado.
document.getElementById("busca-produtos")?.addEventListener("input", atualizarCatalogo);


// Adiciona um evento de clique ao botão de finalizar compra.
document.getElementById("finalizar-compra")?.addEventListener("click", () => {

  // Verifica se o carrinho está vazio.
  // Se estiver, não permite continuar.
  if (carrinho.length === 0) return;

  // Exibe uma mensagem informando que a finalização
  // ainda não está conectada ao back-end.
  alert("Carrinho pronto! A próxima etapa é conectar a finalização da compra à API da ChemLab.");
});


// O evento pageshow é executado quando a página é exibida.
// Isso ajuda a manter o carrinho atualizado ao voltar
// de carrinho.html para index.html.
window.addEventListener("pageshow", () => {

  // Recupera novamente os dados salvos no navegador.
  carrinho = JSON.parse(localStorage.getItem(chave_carrinho) || "[]");

  // Atualiza as informações do carrinho na tela.
  mostrarCarrinho();
});

// Executa a função para mostrar os produtos do catálogo.
mostrarProdutos();

// Executa a função para mostrar os itens do carrinho.
mostrarCarrinho();
