// Recupera os dados do LocalStorage
let horarios = JSON.parse(localStorage.getItem("horarios")) || [];
const formulario = document.getElementById("formHorarios");
// Envio do formulário
formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    const id = document.getElementById("id").value;
    // Cria o objeto com os dados do formulário
    const registro = {
        codigo_linha: document.getElementById("codigoLinha").value,
        numero_ponto: document.getElementById("numeroPonto").value,
        hora: document.getElementById("hora").value,
        dia: document.getElementById("dia").value,
        tabela: Number(document.getElementById("tabela").value),
        adaptacao: document.getElementById("adaptacao").value
    };
    // Cadastro
    if (id === "") {
        registro.id_tabela_linha = gerarId();
        horarios.push(registro);
    } else {
        // Atualizacao
        atualizarRegistro(Number(id), registro);
    }
    salvarLocalStorage();
    listarRegistros();
    formulario.reset();
    document.getElementById("id").value = "";
});
// Gera o ID
function gerarId() {
    if (horarios.length === 0) {
        return 1;
    }
    return Math.max(...horarios.map(item => item.id_tabela_linha)) + 1;
}
// Salva no LocalStorage
function salvarLocalStorage() {
    localStorage.setItem("horarios", JSON.stringify(horarios));
}
// Listagem
function listarRegistros() {
    const lista = document.getElementById("listaHorarios");
    lista.innerHTML = "";

    horarios.forEach(function(item) {
        lista.innerHTML += `
        <tr>
            <td>${item.id_tabela_linha}</td>
            <td>${item.codigo_linha}</td>
            <td>${item.numero_ponto}</td>
            <td>${item.hora}</td>
            <td>${item.dia}</td>
            <td>${item.tabela}</td>
            <td>${item.adaptacao}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarRegistro(${item.id_tabela_linha})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirRegistro(${item.id_tabela_linha})">Excluir</button>
            </td>
        </tr>
        `;
    });
}
// Carrega o registro no formulário para editar
function editarRegistro(id) {
    const registro = horarios.find(item => item.id_tabela_linha === id);
    
    document.getElementById("id").value = registro.id_tabela_linha;
    document.getElementById("codigoLinha").value = registro.codigo_linha;
    document.getElementById("numeroPonto").value = registro.numero_ponto;
    document.getElementById("hora").value = registro.hora;
    document.getElementById("dia").value = registro.dia;
    document.getElementById("tabela").value = registro.tabela;
    document.getElementById("adaptacao").value = registro.adaptacao;
}
// Atualiza o registro
function atualizarRegistro(id, novosDados) {
    const indice = horarios.findIndex(item => item.id_tabela_linha === id);

    if (indice !== -1) {
        horarios[indice] = {
            id_tabela_linha: id,
            ...novosDados
        };
    }
}
// Exclui o registro
function excluirRegistro(id) {
    const confirmar = confirm("Deseja realmente excluir este horário?");

    if (confirmar) {
        horarios = horarios.filter(item => item.id_tabela_linha !== id);
        salvarLocalStorage();
        listarRegistros();
    }
}
// Cancela a edição
function cancelarEdicao() {
    formulario.reset();
    document.getElementById("id").value = "";
}

// Mostra os registros ao abrir a página
listarRegistros();