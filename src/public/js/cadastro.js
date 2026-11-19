const api = "http://localhost:3000";

document.getElementById("form-cadastro")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const cpf_cnpj = document.getElementById("cpf_cnpj").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("conf_senha").value;
  const mensagem = document.getElementById("mensagem_cadastro");

  if (senha !== confirmar) {
    mensagem.textContent = "As senhas não são iguais.";
    return;
  }

  try {
    const resposta = await fetch(`${api}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, cpf_cnpj, email, telefone, endereco })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mensagem.textContent = dados.erro || dados.mensagem || "Erro ao cadastrar cliente.";
      return;
    }

    const idCliente = dados.id ?? dados.id_cliente ?? dados.insertId;

    const respostaUsuario = await fetch(`${api}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        login: email,
        senha,
        verificado: false,
        id_cliente: idCliente
      })
    });

    const dadosUsuario = await respostaUsuario.json();

    if (!respostaUsuario.ok) {
      mensagem.textContent = dadosUsuario.erro || dadosUsuario.mensagem || "Erro ao criar usuário.";
      return;
    }

    localStorage.setItem("chemlab_sessao", JSON.stringify({
      id_cliente: idCliente,
      nome,
      email
    }));

    mensagem.textContent = "Conta criada com sucesso! Indo para a loja...";
    setTimeout(() => {
      location.href = "index.html";
    }, 700);

  } catch (erro) {
    console.error("Erro no cadastro:", erro);
    mensagem.textContent = "Não foi possível conectar ao servidor.";
  }
});