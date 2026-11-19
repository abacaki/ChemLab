document.getElementById("form-cadastro")?.addEventListener("submit", async event => {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const cpf_cnpj = document.getElementById("cpf_cnpj").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("conf_senha").value;
  const mensagem = document.getElementById("mensagem-cadastro");

  if (senha !== confirmar) {
    mensagem.textContent = "As senhas não são iguais.";
    return;
  }

  try {
    // Envia os dados para a API em Express
    const resposta = await fetch("http://localhost:3000/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, cpf_cnpj, telefone, email, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mensagem.textContent = dados.mensagem || "Erro ao cadastrar conta.";
      return;
    }

    // Guarda apenas os dados básicos da sessão para mostrar o nome na loja
    localStorage.setItem("chemlab_sessao", JSON.stringify({
      id: dados.id,
      nome,
      email
    }));

    mensagem.textContent = "Conta criada com sucesso! Indo para a loja...";
    setTimeout(() => {
      location.href = "index.html";
    }, 700);

  } catch (erro) {
    mensagem.textContent = "Não foi possível conectar ao servidor.";
  }
});