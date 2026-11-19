// Constante que guarda o nome da chave
// utilizada para identificar os dados do usuário.
const CHAVE_USUARIO = "chemlab_usuario";

// Constante que guarda o nome da chave
// utilizada para identificar a sessão do usuário conectado.
const CHAVE_SESSAO = "chemlab_sessao";


function usuarioLogado() {
// JSON.parse transformar em js
  return JSON.parse(localStorage.getItem(CHAVE_SESSAO) || "null");
}


function atualizarCabecalhoConta() {

  // Chama a função usuarioLogado() para verificar
  // se existe algum usuário conectado.
  const sessao = usuarioLogado();

  // Procura no HTML o elemento que possui a classe login-link.
  const entrar = document.querySelector(".login-link");

  // Verifica se o elemento existe e se o usuário está conectado.
  if (entrar && sessao) {

    // Altera o texto do link para mostrar o primeiro nome do usuário.
    // split(" ") separa o nome em palavras e [0] pega a primeira.
    // Caso não exista um nome, utiliza a palavra "cliente".
    entrar.textContent = "Olá, " + (sessao.nome || "cliente").split(" ")[0];

    // Impede que o link direcione para outra página.
    entrar.href = "#";

    // Adiciona um evento para identificar quando o usuário clicar no nome.
    entrar.addEventListener("click", e => {

      // Impede o comportamento padrão do link.
      e.preventDefault();

     
      if (confirm("Deseja sair da sua conta?")) {

        localStorage.removeItem(CHAVE_SESSAO);

        // Atualiza a página para mostrar o menu sem usuário conectado.
        location.reload();
      }
    });
  }
}

// Espera o documento HTML
document.addEventListener("DOMContentLoaded", atualizarCabecalhoConta);
