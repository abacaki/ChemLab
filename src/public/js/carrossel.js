// Pega os elementos principais do carrossel no HTML.
const trilho = document.getElementById("lista-produtos");
const botaoAnterior = document.getElementById("anterior");
const botaoProximo = document.getElementById("proximo");
const boxIndicadores = document.getElementById("indicadores");

// Controla em qual card o carrossel está e evita cliques seguidos durante a animação.
let posicaoAtual = 0;
let totalProdutos = 0;
let animando = false;
let tempoAnimacao = null;
  
// Define quantos produtos aparecem lado a lado conforme o tamanho da tela.
function verQuantosCabem() {
  if (window.innerWidth <= 600) {
    return 1;
  }
  if (window.innerWidth <= 950) {
    return 2;
  }
  return 3;
}

// Descobre qual é o índice real do produto ativo (descontando os clones das pontas).
function pegarIndiceReal() {
  const visiveis = verQuantosCabem();

  if (totalProdutos <= visiveis) {
    return 0;
  }

  let real = (posicaoAtual - visiveis) % totalProdutos;
  if (real < 0) {
    real = real + totalProdutos;
  }
  return real;
}

// Desloca o trilho para a posição atual, ligando ou desligando a transição suave.
function moverTrilho(comAnimacao) {
  if (!trilho) return;

  const visiveis = verQuantosCabem();

  if (comAnimacao) {
    trilho.style.transition = "transform 0.4s ease";
  } else {
    trilho.style.transition = "none";
  }

  // Calcula o deslocamento contando a largura de 1 card + 20px de espaçamento.
  trilho.style.transform = `translateX(calc(-${posicaoAtual} * ((100% + 20px) / ${visiveis})))`;

  // Quando reposiciona sem animação, força o navegador a aplicar a mudança na hora.
  if (!comAnimacao) {
    trilho.offsetHeight;
  }
}

// Cria as bolinhas indicadoras embaixo do carrossel.
function montarIndicadores() {
  if (!boxIndicadores || !trilho) return;

  const visiveis = verQuantosCabem();

  // Se houver 3 ou menos produtos no filtro, esconde as bolinhas.
  if (totalProdutos <= visiveis) {
    boxIndicadores.innerHTML = "";
    return;
  }

  const ativo = pegarIndiceReal();
  let htmlBolinhas = "";

  for (let i = 0; i < totalProdutos; i++) {
    const classeAtiva = i === ativo ? "ativo" : "";
    htmlBolinhas += `<span data-posicao="${i}" class="${classeAtiva}"></span>`;
  }

  boxIndicadores.innerHTML = htmlBolinhas;
}

// Troca a bolinha destacada conforme o usuário navega pelos produtos.
function atualizarIndicadores() {
  if (!boxIndicadores) return;

  const ativo = pegarIndiceReal();
  const bolinhas = boxIndicadores.querySelectorAll("span");

  for (let i = 0; i < bolinhas.length; i++) {
    if (i === ativo) {
      bolinhas[i].classList.add("ativo");
    } else {
      bolinhas[i].classList.remove("ativo");
    }
  }
}

// Quando o slide para em um clone, pula em silêncio para o card original equivalente.
function ajustarLoopInfinito() {
  if (!animando) return;
  animando = false;

  const visiveis = verQuantosCabem();
  if (totalProdutos <= visiveis) return;

  // Se passou do 6º produto (entrou nos clones do fim), volta para o início real.
  if (posicaoAtual >= totalProdutos + visiveis) {
    posicaoAtual = posicaoAtual - totalProdutos;
    moverTrilho(false);
  }
  // Se voltou antes do 1º produto (entrou nos clones do começo), vai para o fim real.
  else if (posicaoAtual < visiveis) {
    posicaoAtual = posicaoAtual + totalProdutos;
    moverTrilho(false);
  }
}

// Inicia o movimento para o próximo ou anterior.
function irParaSlide(novaPosicao) {
  const visiveis = verQuantosCabem();

  // Não faz nada se couber tudo na tela ou se já estiver deslizando.
  if (totalProdutos <= visiveis || animando) return;

  animando = true;
  posicaoAtual = novaPosicao;
  moverTrilho(true);
  atualizarIndicadores();

  // Garante que o ajuste invisível aconteça mesmo se o transitionend atrasar.
  clearTimeout(tempoAnimacao);
  tempoAnimacao = setTimeout(ajustarLoopInfinito, 450);
}

// Monta os clones nas pontas e inicia o carrossel (também usada ao filtrar produtos).
function atualizarCarrossel(voltarAoInicio = true) {
  if (!trilho) return;

  const indiceAnterior = voltarAoInicio ? 0 : pegarIndiceReal();

  // Apaga clones antigos antes de criar os novos.
  const clonesAntigos = trilho.querySelectorAll(".product-card.clone");
  for (let i = 0; i < clonesAntigos.length; i++) {
    clonesAntigos[i].remove();
  }

  const cardsOriginais = Array.from(trilho.querySelectorAll(".product-card"));
  totalProdutos = cardsOriginais.length;
  const visiveis = verQuantosCabem();

  clearTimeout(tempoAnimacao);
  animando = false;

  // Se tiver poucos produtos no filtro atual, deixa parado e trava as setas.
  if (totalProdutos <= visiveis) {
    posicaoAtual = 0;
    trilho.style.transition = "none";
    trilho.style.transform = "translateX(0px)";
    if (botaoAnterior) botaoAnterior.disabled = true;
    if (botaoProximo) botaoProximo.disabled = true;
    montarIndicadores();
    return;
  }

  // Copia os últimos produtos para antes do 1º (permite voltar direto do 1º para o 6º).
  const ultimosCards = cardsOriginais.slice(-visiveis);
  for (let i = ultimosCards.length - 1; i >= 0; i--) {
    const clone = ultimosCards[i].cloneNode(true);
    clone.classList.add("clone");
    clone.setAttribute("aria-hidden", "true");
    trilho.prepend(clone);
  }

  // Copia os primeiros produtos para depois do último (permite seguir direto do 6º para o 1º).
  const primeirosCards = cardsOriginais.slice(0, visiveis);
  for (let i = 0; i < primeirosCards.length; i++) {
    const clone = primeirosCards[i].cloneNode(true);
    clone.classList.add("clone");
    clone.setAttribute("aria-hidden", "true");
    trilho.append(clone);
  }

  // Posiciona no primeiro card real (logo depois dos clones do início).
  posicaoAtual = visiveis + (indiceAnterior % totalProdutos);
  moverTrilho(false);

  if (botaoAnterior) botaoAnterior.disabled = false;
  if (botaoProximo) botaoProximo.disabled = false;
  montarIndicadores();
}

// Avisa quando a transição CSS termina para fazer a troca invisível dos clones.
if (trilho) {
  trilho.addEventListener("transitionend", function (event) {
    if (event.target !== trilho || event.propertyName !== "transform") return;
    clearTimeout(tempoAnimacao);
    ajustarLoopInfinito();
  });
}

// Avança 1 card ao clicar na seta da direita.
if (botaoProximo) {
  botaoProximo.addEventListener("click", function () {
    irParaSlide(posicaoAtual + 1);
  });
}

// Volta 1 card ao clicar na seta da esquerda.
if (botaoAnterior) {
  botaoAnterior.addEventListener("click", function () {
    irParaSlide(posicaoAtual - 1);
  });
}

// Vai direto para o produto correspondente ao clicar em uma bolinha.
if (boxIndicadores) {
  boxIndicadores.addEventListener("click", function (event) {
    const bolinha = event.target.closest("span[data-posicao]");
    if (!bolinha) return;

    const visiveis = verQuantosCabem();
    const posicaoEscolhida = Number(bolinha.dataset.posicao);
    irParaSlide(visiveis + posicaoEscolhida);
  });
}

// Reajusta o carrossel se o tamanho da janela mudar.
window.addEventListener("resize", function () {
  atualizarCarrossel(false);
});

// Inicia o carrossel quando a página termina de carregar.
atualizarCarrossel();