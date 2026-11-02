async function excluir(id) {
    const retorno = await fetch('../../php/Medina/user_excluir.php?id=' + id);
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.reload();
    }
}
