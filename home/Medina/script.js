document.addEventListener('DOMContentLoaded', () => {
    listar();
});

document.getElementById('enviar').addEventListener('click', () => {
    if (document.getElementById('id').value == '') {
        novo();
    } else {
        alterar();
    }
});

document.getElementById('buscar-btn').addEventListener('click', () => {
    buscar();
});

// ---------- LISTAR TODOS ----------
async function listar() {
    const retorno = await fetch('../../php/Medina/user_listar.php');
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        preencherTabela(resposta.data);
    }
}

// ---------- BUSCAR POR NOME OU EMAIL ----------
async function buscar() {
    const termo = document.getElementById('termo-busca').value;
    const retorno = await fetch('../../php/Medina/user_busca.php?termo=' + termo);
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        preencherTabela(resposta.data);
    } else {
        alert('ERRO: ' + resposta.mensagem);
    }
}

function preencherTabela(tabela) {
    let html = `
        <table class="table table-striped table-hover align-middle">
            <thead>
                <tr>
                    <th>ID</th><th>Nome</th><th>Email</th>
                    <th>Telefone</th><th>Tipo</th><th>Ações</th>
                </tr>
            </thead>
            <tbody>`;
    for (const u of tabela) {
        html += `
            <tr>
                <td>${u.id}</td>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.telefone || '-'}</td>
                <td>${u.tipo}</td>
                <td>
                    <a href='#' onclick='carregar(${u.id})' class='btn btn-warning btn-sm'>Alterar</a>
                    <a href='#' onclick='excluir(${u.id})' class='btn btn-danger btn-sm'>Excluir</a>
                </td>
            </tr>`;
    }
    html += '</tbody></table>';
    document.getElementById('lista').innerHTML = html;
}

// ---------- CADASTRAR ----------
async function novo() {
    const fd = new FormData();
    fd.append('nome', document.getElementById('nome').value);
    fd.append('email', document.getElementById('email').value);
    fd.append('senha', document.getElementById('senha').value);
    fd.append('telefone', document.getElementById('telefone').value);
    fd.append('tipo', document.getElementById('tipo').value);

    const retorno = await fetch('../../php/Medina/user_novo.php', {
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

// ---------- MOSTRAR / ESCONDER SENHA ----------
document.getElementById('mostrar-senha').addEventListener('click', () => {
    const senha = document.getElementById('senha');
    const icone = document.querySelector('#mostrar-senha i');
    if (senha.type === 'password') {
        senha.type = 'text';
        icone.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        senha.type = 'password';
        icone.classList.replace('bi-eye-slash', 'bi-eye');
    }
});