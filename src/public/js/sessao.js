/*ADMINS AUTORIZADOS
Lista de e-mails que podem administrar
os produtos da loja ChemLab.*/
const admins = [
  "yuri.saito@admin.com",
  "outroadmin@exemplo.com"
];


/*RECUPERAR A SESSÃO DO USUÁRIO*/
// e transforma o JSON em um objeto JavaScript.
const sessao = JSON.parse(
  localStorage.getItem("chemlab_sessao")
);
// Encontra o link de login no menu de navegação.
const linkEntrar = document.querySelector(
  'a[href="login.html"]'
);
/*VERIFICAR SE O USUÁRIO É ADMINISTRADOR*/
// Verifica se existe uma sessão e se o e-mail
// do usuário está na lista de administradores.
//
// toLowerCase() transforma o e-mail em minúsculas.
// includes() verifica se o e-mail está na lista.
// Boolean() transforma o resultado em true ou false.
//
// window.ehAdmin permite consultar essa informação
// em outros arquivos JavaScript.
window.ehAdmin = Boolean(
  sessao &&
  admins.includes(sessao.email?.toLowerCase())
);


/* ==========================================
   EXIBIR INFORMAÇÕES DO USUÁRIO CONECTADO
========================================== */

// Verifica se existe uma sessão e se o link
// de login foi encontrado no HTML.
if (sessao && linkEntrar) {

  // Obtém o primeiro nome do usuário.
  // Se o nome não existir, utiliza o e-mail.
  //
  // split(" ") divide o texto nos espaços.
  // [0] pega o primeiro elemento da lista.
  const primeiroNome = (
    sessao.nome || sessao.email
  ).split(" ")[0];


  /* ==========================================
     SUBSTITUIR O LINK DE LOGIN
  ========================================== */

  // Substitui o link "Entrar" por uma área
  // que mostra o nome do usuário e o botão Sair.
  //
  // outerHTML substitui o próprio elemento HTML.
  // ${primeiroNome} insere o nome do usuário.
  linkEntrar.outerHTML = `
    <div class="sessao-usuario">

      <!-- Mostra uma mensagem de boas-vindas -->
      <span class="usuario-ola">
        Olá, <strong>${primeiroNome}</strong>
      </span>

      <!-- Botão utilizado para encerrar a sessão -->
      <button
        type="button"
        class="btn-sair"
        id="btn-sair"
      >
        Sair
      </button>

    </div>
  `;


  /* ==========================================
     MOSTRAR BOTÃO DE ADMINISTRADOR
  ========================================== */

  // Verifica se o usuário possui autorização
  // para administrar os produtos.
  if (window.ehAdmin) {

    // Localiza o menu principal do HTML
    // e adiciona um link para cadastrar produtos.
    //
    // beforeend adiciona o link no final do menu.
    // O botão só aparece para administradores.
    document.getElementById("main-nav")
      ?.insertAdjacentHTML(
        "beforeend",
        `
          <a
            href="cadastro_produto.html"
            class="nav-link nav-admin"
          >
            + Produto
          </a>
        `
      );
  }


  /* ==========================================
     FUNCIONAMENTO DO BOTÃO SAIR
  ========================================== */

  // Localiza o botão Sair e adiciona um evento
  // para executar uma ação quando ele for clicado.
  document.getElementById("btn-sair")
    .addEventListener("click", () => {

      // Remove os dados da sessão do navegador.
      localStorage.removeItem("chemlab_sessao");

      // Redireciona o usuário para a página inicial.
      location.href = "index.html";

    });

}


/* ==========================================
   FUNÇÃO PARA EDITAR PRODUTOS
========================================== */

// Cria uma função global que recebe o ID
// do produto que será editado.
//
// A página cadastro_produto.html recebe o ID
// pela URL para identificar qual produto editar.
window.editarProduto = (id) => {

  // Redireciona para a página de cadastro
  // enviando o ID do produto pela URL.
  //
  // Exemplo:
  // cadastro_produto.html?id=5
  location.href = `cadastro_produto.html?id=${id}`;

};


/* ==========================================
   FUNÇÃO PARA EXCLUIR PRODUTOS
========================================== */

// Cria uma função global assíncrona
// que recebe o ID do produto a ser excluído.
//
// async permite utilizar await dentro da função.
window.excluirProduto = async (id) => {


  /* ==========================================
     CONFIRMAR A EXCLUSÃO
  ========================================== */

  // Exibe uma caixa de confirmação ao usuário.
  //
  // confirm() retorna true se confirmar
  // e false se cancelar.
  //
  // O ! significa negação.
  // Se o usuário cancelar, return interrompe
  // a execução da função.
  if (!confirm(
    "Deseja realmente excluir este produto?"
  )) return;


  /* ==========================================
     ENVIAR REQUISIÇÃO PARA O BACK-END
  ========================================== */

  // Envia uma requisição DELETE para a API.
  //
  // O ${id} identifica qual produto será excluído.
  //
  // await espera a resposta do servidor
  // antes de continuar a execução.
  const resposta = await fetch(
    `http://localhost:3000/produtos/${id}`,
    {
      // DELETE solicita a exclusão do produto.
      method: "DELETE"
    }
  );


  /* ==========================================
     VERIFICAR A RESPOSTA DO SERVIDOR
  ========================================== */

  // Verifica se a requisição foi bem-sucedida.
  if (resposta.ok) {

    // Atualiza a página para mostrar
    // a lista de produtos atualizada.
    location.reload();

  } else {

    // Exibe uma mensagem caso a exclusão falhe.
    alert("Erro ao excluir o produto.");

  }

};
