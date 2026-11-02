async function carregar(id) {
    const retorno = await fetch('../../php/Medina/user_detalhe.php?id=' + id);
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        const reg = resposta.data[0];
        document.getElementById('nome').value = reg.nome;
        document.getElementById('email').value = reg.email;
        document.getElementById('telefone').value = reg.telefone;
        document.getElementById('tipo').value = reg.tipo;
        document.getElementById('senha').value = ''; 
        document.getElementById('id').value = id;   

        document.getElementById('titulo-form').textContent = 'Alterar usuário';
        document.getElementById('enviar').textContent = 'Salvar alterações';
        document.getElementById('dica-senha').textContent = 'Deixe em branco para manter a senha atual.';
        document.getElementById('cancelar').classList.remove('d-none');

    } else {
        alert('ERRO: ' + resposta.mensagem);
    }
}

async function alterar() {
    const id = document.getElementById('id').value;
    const fd = new FormData();
    fd.append('nome', document.getElementById('nome').value);
    fd.append('email', document.getElementById('email').value);
    fd.append('senha', document.getElementById('senha').value);
    fd.append('telefone', document.getElementById('telefone').value);
    fd.append('tipo', document.getElementById('tipo').value);

    const retorno = await fetch('../../php/Medina/user_alterar.php?id=' + id, {
        method: 'POST',
        body: fd
    });
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        alert('SUCESSO: ' + resposta.mensagem);
        window.location.reload(); 
    } else {
        alert('ERRO: ' + resposta.mensagem);
    }
}