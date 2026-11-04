
// Elementos da página
const formulario = document.getElementById('formHorarios');
const lista = document.getElementById('listaHorarios');
const aviso = document.getElementById('mensagemHorarios');
const campoBusca = document.getElementById('buscaHorarios');

// Pasta onde estão os arquivos PHP
const caminhoPHP = '../../php/Luiz/';

// Mostra mensagens na tela
function mostrarMensagem(mensagem, tipo = 'success') {
    aviso.className = 'alert alert-' + tipo + ' mb-4';
    aviso.textContent = mensagem;
}

// Comunicação com o PHP
async function chamarPHP(arquivo, dados = null) {
    const opcoes = dados
        ? { method: 'POST', body: dados }
        : { method: 'GET' };

    const resposta = await fetch(caminhoPHP + arquivo, opcoes);
    let resultado;
    try {
        resultado = await resposta.json();
    } catch (erro) {
        throw new Error(
            'O PHP não retornou JSON. Confira o XAMPP.'
        );
    }
    if (!resposta.ok || resultado.status !== 'ok') {
        throw new Error(
            resultado.mensagem || 'Erro ao realizar operação.'
        );
    }
    return resultado;
}
// Pega os dados digitados no formulário
function dadosDoFormulario() {
    const dados = new FormData();

    dados.append(
        'codigo_linha',
        document.getElementById('codigoLinha').value.trim()
    );
    dados.append(
        'numero_ponto',
        document.getElementById('numeroPonto').value
    );
    dados.append(
        'hora',
        document.getElementById('hora').value
    );
    dados.append(
        'dia',
        document.getElementById('dia').value
    );
    dados.append(
        'tabela',
        document.getElementById('tabela').value
    );
    dados.append(
        'adaptacao',
        document.getElementById('adaptacao').value.trim()
    );

    return dados;
}

// CADASTRAR OU ATUALIZAR
formulario.addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('id').value;
    const dados = dadosDoFormulario();
    const arquivo = id
        ? 'horario_alterar.php'
        : 'horario_novo.php';

    if (id) {
        dados.append('id', id);
    }
    try {
        const resultado = await chamarPHP(arquivo, dados);
        cancelarEdicao();
        campoBusca.value = '';
        await listarRegistros();
        mostrarMensagem(resultado.mensagem);
    } catch (erro) {
        mostrarMensagem(erro.message, 'danger');
    }
});
// Cria células para a tabela
function colocarCelula(linha, valor) {
    const celula = document.createElement('td');
    celula.textContent = valor ?? '';
    linha.appendChild(celula);
}
// LISTAR REGISTROS
async function listarRegistros() {
    const termo = campoBusca.value.trim();
    const arquivo = termo
        ? 'horario_busca.php?termo=' + encodeURIComponent(termo)
        : 'horario_listar.php';
    try {
        const resultado = await chamarPHP(arquivo);
        lista.innerHTML = '';
        // Quando não existem horários
        if (resultado.data.length === 0) {
            const linha = document.createElement('tr');
            const celula = document.createElement('td');
            celula.colSpan = 8;
            celula.className = 'text-center text-secondary';
            celula.textContent = 'Nenhum horário encontrado.';
            linha.appendChild(celula);
            lista.appendChild(linha);
            return;
        }
        // Nomes dos dias
        const nomesDias = {
            dia_util: 'Dia útil',
            sabado: 'Sábado',
            domingo: 'Domingo',
            feriado: 'Feriado'
        };

        // Monta as linhas da tabela
        resultado.data.forEach(function(item) {
            const linha = document.createElement('tr');

            colocarCelula(linha, item.id_tabela_linha);
            colocarCelula(linha, item.codigo_linha);
            colocarCelula(linha, item.numero_ponto);
            colocarCelula(
                linha,
                String(item.hora).slice(0, 5)
            );
            colocarCelula(
                linha,
                nomesDias[item.dia] || item.dia
            );
            colocarCelula(linha, item.tabela);
            colocarCelula(linha, item.adaptacao);

            const acoes = document.createElement('td');

            // Botão editar
            const editar = document.createElement('button');

            editar.className = 'btn btn-warning btn-sm me-1';
            editar.type = 'button';
            editar.textContent = 'Editar';

            editar.addEventListener('click', function() {
                editarRegistro(item.id_tabela_linha);
            });

            // Botão excluir
            const excluir = document.createElement('button');

            excluir.className = 'btn btn-danger btn-sm';
            excluir.type = 'button';
            excluir.textContent = 'Excluir';

            excluir.addEventListener('click', function() {
                excluirRegistro(item.id_tabela_linha);
            });

            acoes.append(editar, excluir);
            linha.appendChild(acoes);
            lista.appendChild(linha);
        });

    } catch (erro) {
        mostrarMensagem(erro.message, 'danger');
    }
}

// EDITAR REGISTRO
async function editarRegistro(id) {
    try {
        const resultado = await chamarPHP(
            'horario_detalhe.php?id=' + encodeURIComponent(id)
        );

        const item = resultado.data[0];

        document.getElementById('id').value =
            item.id_tabela_linha;

        document.getElementById('codigoLinha').value =
            item.codigo_linha;

        document.getElementById('numeroPonto').value =
            item.numero_ponto;

        document.getElementById('hora').value =
            String(item.hora).slice(0, 5);

        document.getElementById('dia').value =
            item.dia;

        document.getElementById('tabela').value =
            item.tabela;

        document.getElementById('adaptacao').value =
            item.adaptacao;

        document.getElementById('botaoSalvar').textContent =
            'Atualizar';

        formulario.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } catch (erro) {
        mostrarMensagem(erro.message, 'danger');
    }
}
// EXCLUIR REGISTRO
async function excluirRegistro(id) {
    const confirmar = confirm(
        'Deseja realmente excluir este horário?'
    );
    if (!confirmar) {
        return;
    }
    const dados = new FormData();
    dados.append('id', id);
    try {
        const resultado = await chamarPHP(
            'horario_excluir.php',
            dados
        );
        await listarRegistros();
        mostrarMensagem(resultado.mensagem);
    } catch (erro) {
        mostrarMensagem(erro.message, 'danger');
    }
}
// CANCELAR EDIÇÃO
function cancelarEdicao() {
    formulario.reset();
    document.getElementById('id').value = '';
    document.getElementById('botaoSalvar').textContent = 'Salvar';
}
// Botão de pesquisa
document.getElementById('botaoBuscar')
    .addEventListener('click', listarRegistros);
// Limpar pesquisa
document.getElementById('limparBusca')
    .addEventListener('click', function() {
        campoBusca.value = '';
        listarRegistros();
    });
// Pesquisar pressionando Enter
campoBusca.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        listarRegistros();
    }
});
// Carrega os horários ao abrir a página
listarRegistros();
