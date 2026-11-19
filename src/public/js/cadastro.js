// addEventListener("submit") identifica quando o formulário é enviado.
document.getElementById("form-cadastro")?.addEventListener("submit", event => {

  // Impede que a página seja recarregada automaticamente
  // quando o formulário for enviado.
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("conf_senha").value;
  const mensagem = document.getElementById("mensagem_cadastro");


  // Verifica se a senha e a confirmação são diferentes.
  if (senha !== confirmar) {

    mensagem.textContent = "As senhas não são iguais.";
    return;
  }


  // Busca no localStorage uma conta que já foi cadastrada.
  // JSON.parse transforma os dados armazenados em um objeto JavaScript.
  // Se não existir nenhuma conta, utiliza null.
  const usuarioAtual = JSON.parse(localStorage.getItem("chemlab_usuario") || "null");


  // Verifica se já existe uma conta cadastrada com o mesmo e-mail.
  // ?. permite acessar o email somente se usuarioAtual existir.
  if (usuarioAtual?.email === email) {

    mensagem.textContent = "Já existe uma conta cadastrada com esse e-mail.";
    return;
  }

  localStorage.setItem("chemlab_usuario", JSON.stringify({ nome, email, senha }));


  // Salva os dados da sessão do usuário.
  // Isso permite que o sistema identifique que ele acabou de entrar na conta.
  localStorage.setItem("chemlab_sessao", JSON.stringify({ nome, email }));

  mensagem.textContent = "Conta criada com sucesso! Indo para a loja...";

  setTimeout(() => {

    location.href = "index.html";

  }, 700);
});
