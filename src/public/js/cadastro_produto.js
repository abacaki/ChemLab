const api = "http://localhost:3000";
const admins = ["yuri.saito@admin.com", "outroadmin@exemplo.com"];
const sessao = JSON.parse(localStorage.getItem("chemlab_sessao"));

// BLOQUEIO DE ACESSO
if (!sessao || !sessao.email || !admins.includes(sessao.email.toLowerCase())) {
  location.href = "index.html";
}

const parametros = new URLSearchParams(location.search);
const idEditar = parametros.get("id");

// SE TIVER ID NA URL, CARREGA OS DADOS DO PRODUTO NO FORMULÁRIO
async function carregarProdutoParaEdicao() {
  if (!idEditar) {
    return;
  }

  const titulo = document.querySelector(".bem-vindo");
  const botaoSubmit = document.querySelector("#form-produto button[type='submit']");

  if (titulo) {
    titulo.textContent = "Editar Produto";
  }
  if (botaoSubmit) {
    botaoSubmit.innerHTML = "Salvar alterações <span>→</span>";
  }

  try {
    const resposta = await fetch(api + "/produtos");
    const produtos = await resposta.json();
    let produtoEncontrado = null;

    for (let i = 0; i < produtos.length; i++) {
      const idAtual = produtos[i].id_produto || produtos[i].id;
      if (String(idAtual) === String(idEditar)) {
        produtoEncontrado = produtos[i];
        break;
      }
    }

    if (!produtoEncontrado) {
      return;
    }

    document.getElementById("nome").value = produtoEncontrado.nome;
    document.getElementById("categoria").value = produtoEncontrado.categoria || "Reagentes";
    document.getElementById("descricao").value = produtoEncontrado.descricao;
    document.getElementById("preco").value = produtoEncontrado.preco;
    document.getElementById("estoque").value = produtoEncontrado.estoque;
    document.getElementById("imagem").value = produtoEncontrado.imagem || "";
  } catch (erro) {
    console.error("Erro ao carregar produto:", erro);
  }
}

carregarProdutoParaEdicao();

// SALVAR (CADASTRA SE FOR NOVO, ATUALIZA SE FOR EDIÇÃO)
const formProduto = document.getElementById("form-produto");

if (formProduto) {
  formProduto.addEventListener("submit", async function (event) {
    event.preventDefault();

    const mensagem = document.getElementById("mensagem_produto");
    const imagemDigitada = document.getElementById("imagem").value.trim();

    const produto = {
      nome: document.getElementById("nome").value.trim(),
      categoria: document.getElementById("categoria").value,
      descricao: document.getElementById("descricao").value.trim(),
      preco: Number(document.getElementById("preco").value),
      estoque: Number(document.getElementById("estoque").value),
      imagem: imagemDigitada !== "" ? imagemDigitada : null
    };

    let url = api + "/produtos";
    let metodo = "POST";

    if (idEditar) {
      url = api + "/produtos/" + idEditar;
      metodo = "PUT";
    }

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        mensagem.textContent = dados.erro || "Erro ao salvar produto.";
        return;
      }

      if (idEditar) {
        mensagem.textContent = "Produto atualizado com sucesso!";
        setTimeout(function () {
          location.href = "produtos.html";
        }, 700);
      } else {
        mensagem.textContent = "Produto cadastrado com sucesso!";
        formProduto.reset();
      }
    } catch (erro) {
      mensagem.textContent = "Não foi possível conectar ao servidor.";
    }
  });
}