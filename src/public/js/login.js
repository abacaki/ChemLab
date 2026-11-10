
const formLogin = document.getElementById('formLogin');
const campoLogin = document.getElementById('login');
const campoSenha = document.getElementById('senha');
const mensagem = document.getElementById('mensagem');

if (formLogin) {
    formLogin.addEventListener('submit', async (event) => {
        event.preventDefault();

        const login = campoLogin.value.trim();
        const senha = campoSenha.value;

        if (!login || !senha) {
            mensagem.textContent = 'Preencha todos os campos.';
            return;
        }

        try {
            const resposta = await fetch(
                'http://localhost:3000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        login,
                        senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.erro || dados.mensagem || 'Login inválido.'
                );
            }

            // Salva o token de autenticação
            localStorage.setItem('token', dados.token);

            // Salva os dados do usuário
            localStorage.setItem(
                'usuario',
                JSON.stringify(dados.usuario || {})
            );

            mensagem.textContent = 'Login realizado com sucesso!';

            // Redireciona para a página inicial
            window.location.href = 'index.html';

        } catch (erro) {
            mensagem.textContent = erro.message;
            console.error('Erro no login:', erro);
        }
    });
}
