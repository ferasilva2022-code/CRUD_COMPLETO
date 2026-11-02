// remoção das linhas
async function excluir(id){
    const retorno = await fetch("../../php/Fernanda/linha_excluir.php?id=" + id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert(resposta.mensagem);
        window.location.reload();
    }else{
        alert(resposta.mensagem);
    }
}
