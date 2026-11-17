const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');
const abaLogin = document.getElementById('abaLogin');
const abaCadastro = document.getElementById('abaCadastro');
const msg = document.getElementById('mensagem');

function mostrar(texto, tipo) {
  msg.textContent = texto;
  msg.className = 'mensagem ' + tipo;
}

function trocarAba(cadastro) {
  formLogin.classList.toggle('oculto', cadastro);
  formCadastro.classList.toggle('oculto', !cadastro);
  abaLogin.classList.toggle('ativa', !cadastro);
  abaCadastro.classList.toggle('ativa', cadastro);
  mostrar('', '');
}
abaLogin.addEventListener('click', () => trocarAba(false));
abaCadastro.addEventListener('click', () => trocarAba(true));

// Função única que conversa com a API
async function chamarApi(url, corpo) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo)
  });
  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(dados.erro || 'Erro ao comunicar com o servidor');
  return dados;
}

// LOGIN
formLogin.addEventListener('submit', async (event) => {
  event.preventDefault(); // impede o navegador de recarregar a página
  const login = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  if (!login || !senha) return mostrar('Preencha e-mail e senha.', 'erro');

  try {
    const dados = await chamarApi('/api/auth/login', { login, senha });
    localStorage.setItem('chemlab_token', dados.token);               // sessão no navegador
    localStorage.setItem('chemlab_cliente', JSON.stringify(dados.cliente));
    window.location.href = 'index.html';
  } catch (e) {
    mostrar(e.message, 'erro');
  }
});

// CADASTRO
formCadastro.addEventListener('submit', async (event) => {
  event.preventDefault();
  const corpo = {
    nome: document.getElementById('cadNome').value.trim(),
    email: document.getElementById('cadEmail').value.trim(),
    telefone: document.getElementById('cadTelefone').value.trim(),
    senha: document.getElementById('cadSenha').value
  };
  if (Object.values(corpo).some((v) => !v)) return mostrar('Preencha todos os campos.', 'erro');

  try {
    const dados = await chamarApi('/api/auth/registrar', corpo);
    formCadastro.reset();
    trocarAba(false);
    mostrar(dados.mensagem, 'ok');
  } catch (e) {
    mostrar(e.message, 'erro');
  }
});
