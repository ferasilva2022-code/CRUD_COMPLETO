document.getElementById("cadastrar").addEventListener("click", () => {
    cadastrar();
});

async function cadastrar(){
    var nome     = document.getElementById("cadNome").value;
    var email    = document.getElementById("cadEmail").value;
    var senha    = document.getElementById("cadSenha").value;
    var tipo     = document.getElementById("cadTipo").value;
    var telefone = document.getElementById("cadTelefone").value;

    if(nome.trim() == "" || email.trim() == "" || senha.trim() == ""){
        alert("Preencha nome, email e senha.");
        return;
    }

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("email", email);
    fd.append("senha", senha);
    fd.append("tipo", tipo);
    fd.append("telefone", telefone);

    const retorno = await fetch("../php/cadastro.php",
        {
          method: 'POST',
          body: fd
        });
    // se o PHP der erro (ex.: MySQL desligado) não vem JSON
    const resposta = await retorno.json().catch(() => null);
    if(resposta == null){
        alert("Erro no servidor. Confira se o MySQL está ligado no XAMPP.");
    }else if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        // volta para a tela de login
        window.location.href = "index.html";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}
