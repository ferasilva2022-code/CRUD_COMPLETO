document.getElementById("enviar").addEventListener("click", () => {
    login();
});
async function login(){
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    const fd = new FormData();
    fd.append("email", email);
    fd.append("senha", senha);
    const retorno = await fetch("../php/login.php",{
            method: "POST",
            body: fd
        }
    );
    // se o PHP der erro (ex.: MySQL desligado) não vem JSON, e o catch evita que o botão "não faça nada"
    const resposta = await retorno.json().catch(() => null);
    if(resposta == null){
        alert("Erro no servidor. Confira se o MySQL está ligado no XAMPP.");
    }else if(resposta.status == "ok"){
        window.location.href = "../home/Fernanda/linha.html";
    }else{
        alert("Credenciais invalidas.");
    }
}
