// caminhos relativos à PÁGINA que inclui este script (home/<nome>/), não à pasta js/
async function valida_sessao(){
    const retorno = await fetch("../../php/valida_sessao.php");
    const resposta = await retorno.json();
    if(resposta.status == "nok"){
        window.location.href = '../../login/';
    }
    // devolve o usuário logado (nome e tipo) para a página decidir o que mostrar
    return resposta.data;
}

// Roda em toda página que inclui este script:
// 1) sem login -> vai para a tela de login
// 2) coloca o nome do usuário na navbar (o botão Logoff já está no HTML de cada página)
// 3) admin: o <body> ganha a classe "admin" e os elementos .somente-admin aparecem (regra no style.css)
// 4) usuário comum numa página marcada com <body data-somente-admin> -> volta para Linhas
async function controle_acesso(){
    const usuario = await valida_sessao();
    if(!usuario.tipo) return null; // sem sessão: o valida_sessao já mandou para o login

    document.getElementById("usuarioLogado").textContent = usuario.nome;

    if(usuario.tipo == "admin"){
        document.body.classList.add("admin");
    }else if(document.body.hasAttribute("data-somente-admin")){
        alert("Apenas administradores podem acessar esta página.");
        window.location.href = "../Fernanda/linha.html";
        return null;
    }
    return usuario;
}

async function logoff(){
    const retorno = await fetch("../../php/logoff.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = '../../login/';
    }
}

// começa assim que o script carrega;
// a página que precisar saber quem está logado usa:  const usuario = await sessao;
const sessao = controle_acesso();
