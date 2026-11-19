const API_URL = "http://localhost:3000";

const formularioLogin = document.getElementById("form-login");

formularioLogin?.addEventListener("submit", async event => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem_login");

  if (!email || !senha) {
    mensagem.textContent = "Preencha o e-mail e a senha.";
    return;
  }

  try {
    // 1. Busca os usuários cadastrados na API
    const respostaUsuarios = await fetch(`${API_URL}/usuarios`);
    if (!respostaUsuarios.ok) {
      mensagem.textContent = "Erro ao consultar usuários no servidor.";
      return;
    }

    const usuarios = await respostaUsuarios.json();

    // 2. Verifica se existe um usuário com esse login (e-mail) e senha
    const usuarioEncontrado = usuarios.find(
      u => u.login?.toLowerCase() === email && u.senha === senha
    );

    if (!usuarioEncontrado) {
      mensagem.textContent = "E-mail ou senha inválidos.";
      return;
    }

    // 3. Busca o nome do cliente vinculado para exibir na loja
    let nomeCliente = usuarioEncontrado.nome || email;
    const respostaClientes = await fetch(`${API_URL}/clientes`);
    if (respostaClientes.ok) {
      const clientes = await respostaClientes.json();
      const cliente = clientes.find(
        c => (c.id_cliente ?? c.id) === usuarioEncontrado.id_cliente
      );
      if (cliente?.nome) nomeCliente = cliente.nome;
    }

    // 4. Salva a sessão no mesmo padrão usado pelo cadastro.js e carrinho.js
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