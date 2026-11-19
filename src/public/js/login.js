// Formulário de login da ChemLab.
// A validação visual funciona; a autenticação será conectada à rota real
// depois de confirmarmos o endereço e os campos esperados pelo back-end.

const formularioLogin = document.getElementById("form-login");

formularioLogin?.addEventListener("submit", async event => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem_login");

  if (!email || !senha) {
    mensagem.textContent = "Preencha o e-mail e a senha.";
    return;
  }

  mensagem.textContent = "Formulário preenchido. A integração com a API será configurada na próxima etapa.";
});
