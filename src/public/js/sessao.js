// ADMINS AUTORIZADOS
const admins = [
  "yuri.saito@admin.com",
  "outroadmin@exemplo.com"
];

const sessao = JSON.parse(localStorage.getItem("chemlab_sessao"));
const linkEntrar = document.querySelector('a[href="login.html"]');
window.ehAdmin = Boolean(sessao && admins.includes(sessao.email?.toLowerCase()));

if (sessao && linkEntrar) {
  const primeiroNome = (sessao.nome || sessao.email).split(" ")[0];

  linkEntrar.outerHTML = `
    <div class="sessao-usuario">
      <span class="usuario-ola">Olá, <strong>${primeiroNome}</strong></span>
      <button type="button" class="btn-sair" id="btn-sair">Sair</button>
    </div>
  `;

  if (window.ehAdmin) {
    document.getElementById("main-nav")?.insertAdjacentHTML(
      "beforeend",
      `<a href="cadastro_produto.html" class="nav-link nav-admin">+ Produto</a>`
    );
  }

  document.getElementById("btn-sair").addEventListener("click", () => {
    localStorage.removeItem("chemlab_sessao");
    location.href = "index.html";
  });
}

window.editarProduto = (id) => {
  location.href = `cadastro_produto.html?id=${id}`;
};

window.excluirProduto = async (id) => {
  if (!confirm("Deseja realmente excluir este produto?")) return;

  const resposta = await fetch(`http://localhost:3000/produtos/${id}`, {
    method: "DELETE"
  });

  if (resposta.ok) {
    location.reload();
  } else {
    alert("Erro ao excluir o produto.");
  }
};