const api = "http://localhost:3000";

document.getElementById("form-login")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem_login");

  if (!email || !senha) {
    mensagem.textContent = "Preencha o e-mail e a senha.";
    return;
  }

  try {

    const respostaUsuarios = await fetch(`${api}/usuarios`);
    if (!respostaUsuarios.ok) {
      mensagem.textContent = "Erro ao consultar usuários no servidor.";
      return;
    }

    const usuarios = await respostaUsuarios.json();
    const usuarioEncontrado = usuarios.find(
      (u) => u.login?.trim().toLowerCase() === email && u.senha === senha
    );

    if (!usuarioEncontrado) {
      mensagem.textContent = "E-mail ou senha inválidos.";
      return;
    }


    let nomeCliente = usuarioEncontrado.nome || email;
    const respostaClientes = await fetch(`${api}/clientes`);
    if (respostaClientes.ok) {
      const clientes = await respostaClientes.json();
      const cliente = clientes.find(
        (c) => (c.id_cliente ?? c.id) === usuarioEncontrado.id_cliente
      );
      if (cliente?.nome) nomeCliente = cliente.nome;
    }

    localStorage.setItem("chemlab_sessao", JSON.stringify({
      id_cliente: usuarioEncontrado.id_cliente,
      nome: nomeCliente,
      email: usuarioEncontrado.login
    }));

    mensagem.textContent = "Login realizado com sucesso! Indo para a loja...";
    setTimeout(() => {
      location.href = "index.html";
    }, 700);

  } catch (erro) {
    mensagem.textContent = "Não foi possível conectar ao servidor.";
  }
});