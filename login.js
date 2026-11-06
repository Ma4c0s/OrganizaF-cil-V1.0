const form = document.getElementById("formCadastro");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario");
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");
  const mensagem = document.getElementById("mensagem");

  let valido = true;

  limparErros();

  // Usuário
  if (usuario.value.length < 3) {
    mostrarErro(usuario, "Mínimo 3 caracteres");
    valido = false;
  }

  // Email
  if (!validarEmail(email.value)) {
    mostrarErro(email, "Email inválido");
    valido = false;
  }

  // Senha
  if (senha.value.length < 6) {
    mostrarErro(senha, "Mínimo 6 caracteres");
    valido = false;
  }

  if (valido) {
    mensagem.textContent = "Cadastro realizado com sucesso!";
    mensagem.className = "sucesso";
    form.reset();
    window.location.href = "telaPrincipal.html";
  }
});

function mostrarErro(input, mensagem) {
  const campo = input.parentElement;
  const erro = campo.querySelector(".erro");
  erro.textContent = mensagem;
}

function limparErros() {
  document.querySelectorAll(".erro").forEach(e => e.textContent = "");
  document.getElementById("mensagem").textContent = "";
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/*Revelador de senha*/
const senhaInput = document.getElementById("senha");
const toggleSenha = document.getElementById("toggleSenha");

toggleSenha.addEventListener("click", () => {
  if (senhaInput.type === "password") {
    senhaInput.type = "text";
    toggleSenha.textContent = "🙈";
  } else {
    senhaInput.type = "password";
    toggleSenha.textContent = "👁️";
  }
});

