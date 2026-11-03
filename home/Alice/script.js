// CRUD de pontos: JavaScript envia/recebe JSON dos seis arquivos PHP.
const API = '../../php/Alice/';
const formPonto = document.getElementById('FormPonto');
const mensagem = document.getElementById('mensagem');
const container = document.getElementById('Pontos');
const detalhes = document.getElementById('detalhes');
let idEdicao = null;

function avisar(texto, erro = false) {
    mensagem.textContent = texto;
    mensagem.style.color = erro ? '#b42332' : '#176a39';
}

// Faz a requisição e converte a resposta PHP (JSON) em objeto JavaScript.
async function requisitar(arquivo, dados = null) {
    const opcoes = dados === null ? {} : {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    };
    const resposta = await fetch(API + arquivo, opcoes);
    const texto = await resposta.text();
    let resultado;
    try { resultado = JSON.parse(texto); }
    catch (erro) { throw new Error('PHP não retornou JSON (HTTP ' + resposta.status + '). Confira o log do PHP.'); }
    if (!resposta.ok || resultado.status !== 'ok') {
        throw new Error(resultado.mensagem || 'Falha na operação.');
    }
    return resultado.data;
}

function dadosFormulario() {
    if (!formPonto.reportValidity()) return null;
    return {
        id: Number(document.getElementById('id').value),
        nome: document.getElementById('nome').value.trim(),
        tipo: document.getElementById('tipo').value,
        latitude: Number(document.getElementById('latitude').value),
        longitude: Number(document.getElementById('longitude').value)
    };
}

function limparCampos() {
    formPonto.reset();
    document.getElementById('id').readOnly = false;
    document.getElementById('btn_salvar').disabled = false;
    document.getElementById('btn_alterar').disabled = true;
    idEdicao = null;
}


formPonto.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const dados = dadosFormulario();
    if (!dados) return;
    try {
        await requisitar('ponto_novo.php', dados);
        limparCampos();
        avisar('Ponto cadastrado com sucesso!');
        await listar();
    } catch (erro) { avisar(erro.message, true); }
});


async function listar() {
    try {
        const pontos = await requisitar('ponto_listar.php');
        mostrarPontos(pontos);
    } catch (erro) {
        container.textContent = 'Erro ao listar: ' + erro.message;
    }
}


async function buscar() {
    const termo = document.getElementById('busca').value.trim();

    try {
        const pontos = await requisitar(
            'ponto_busca.php?q=' + encodeURIComponent(termo)
        );
        mostrarPontos(pontos);
    } catch (erro) {
        avisar(erro.message, true);
    }
}

// Mostra os registros sem inserir texto do banco como HTML.
function mostrarPontos(pontos) {
    container.replaceChildren();
    if (pontos.length === 0) {
        container.textContent = 'Nenhum ponto encontrado.';
        return;
    }
    for (const ponto of pontos) {
        const linha = document.createElement('div');
        linha.className = 'item-ponto';
        const descricao = document.createElement('p');
        descricao.textContent = `#${ponto.id} — ${ponto.nome} | Tipo: ${ponto.tipo} | Lat: ${ponto.latitude} | Lon: ${ponto.longitude}`;
        linha.appendChild(descricao);
        for (const [texto, acao] of [['Detalhes', detalhar], ['Editar', carregar], ['Excluir', excluir]]) {
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.textContent = texto;
            botao.addEventListener('click', () => acao(Number(ponto.id)));
            linha.appendChild(botao);
        }
        container.appendChild(linha);
    }
}

// DETALHAR: busca somente um ponto pelo ID.
async function detalhar(id) {
    try {
        const ponto = await requisitar('ponto_detalhe.php?id=' + encodeURIComponent(id));
        detalhes.hidden = false;
        detalhes.textContent = `Detalhes do ponto #${ponto.id}: ${ponto.nome} — ${ponto.tipo}. Latitude: ${ponto.latitude}, longitude: ${ponto.longitude}.`;
    } catch (erro) { avisar(erro.message, true); }
}

// Carrega os dados do banco no formulário para edição.
async function carregar(id) {
    try {
        const ponto = await requisitar('ponto_detalhe.php?id=' + encodeURIComponent(id));
        document.getElementById('id').value = ponto.id;
        document.getElementById('nome').value = ponto.nome;
        document.getElementById('tipo').value = ponto.tipo;
        document.getElementById('latitude').value = ponto.latitude;
        document.getElementById('longitude').value = ponto.longitude;
        document.getElementById('id').readOnly = true;
        document.getElementById('btn_salvar').disabled = true;
        document.getElementById('btn_alterar').disabled = false;
        idEdicao = Number(ponto.id);
        avisar('Editando ponto #' + idEdicao + '. Altere os campos e clique em Alterar ponto.');
        formPonto.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (erro) { avisar(erro.message, true); }
}

// ALTERAR: UPDATE no MySQL.
document.getElementById('btn_alterar').addEventListener('click', async () => {
    if (idEdicao === null) return avisar('Escolha um ponto para editar.', true);
    const dados = dadosFormulario();
    if (!dados) return;
    dados.id = idEdicao;
    try {
        await requisitar('ponto_alterar.php', dados);
        limparCampos();
        avisar('Ponto alterado com sucesso!');
        await listar();
    } catch (erro) { avisar(erro.message, true); }
});

// EXCLUIR: DELETE no MySQL.

async function excluir(id) {
    if (!confirm("Deseja realmente excluir o ponto #" + id + "?")) {
        return; }
    const dados = new FormData();
    dados.append("id", id);

    try {
        const retorno = await fetch("../../php/Alice/ponto_excluir.php", {
            method: "POST",
            body: dados });
        const resposta = await retorno.json();
        alert(resposta.mensagem);
        if (resposta.status === "ok") {
            if (idEdicao === id) limparCampos();
            detalhes.hidden = true;
            await listar(); }

    } catch (erro) {
        alert("Erro ao excluir: " + erro.message);
    }
}

document.getElementById('btn_limpar').addEventListener('click', () => { limparCampos(); avisar(''); });
document.getElementById('btn_buscar').addEventListener('click', buscar);
document.getElementById('btn_todos').addEventListener('click', () => {
    document.getElementById('busca').value = '';
    listar();
});
document.getElementById('busca').addEventListener('keydown', evento => {
    if (evento.key === 'Enter') { evento.preventDefault(); buscar(); }
});

listar();
