// caminhos relativos à PÁGINA que inclui este script (home/Fernanda/), não à pasta js/
async function valida_sessao(){
    const retorno = await fetch("../../php/valida_sessao.php");
    const resposta = await retorno.json();
    if(resposta.status == "nok"){
        window.location.href = '../../login/';
    }
    // devolve o usuário logado (nome e tipo) para a página decidir o que mostrar
    return resposta.data;
}
