const formPonto = document.getElementById ('formPonto');
let indiceEdicao = null; //nn vai editar agr 

document.getElementById('btn_salvar').addEventListener("click", (e) => {
    e.preventDefault();
    // Pega os valores que o usuário digitou nas caixas
    let ponto = document.getElementById("ponto").value;
    let linha = document.getElementById("linha").value;
    let status = document.getElementById("ativo").value; // trocado para getElementById

    // para nn deixar cadastrar em branco
    if (!ponto || !linha) {
        alert("Preencha todos os campos!");
        return; // O 'return' para a execução da função aqui
    }

    // Busca a lista que já existe no localStorage
    // Se não existir nada ainda ai cria com o '|| []' cria um array vazio []
    let lista = JSON.parse(localStorage.getItem("pontos")) || [];

    // Adiciona o novo objeto com os dados no final 
    lista.push({ ponto: ponto, linha: linha, status: status });

    // é pra Salva o array atualizado de volta no localStorage 
    localStorage.setItem("pontos", JSON.stringify(lista));

    // Limpa as caixas de texto / atualizar a tela
    limparCampos();
    listar();
});

//Busca os dados salvos no localStorage, transforma o texto salvo de volta em um array de objetos usando JSON.parse
function listar() {
    //transforma o texto salvo de volta em um array de objetos usando JSON.parse
    let lista = JSON.parse(localStorage.getItem("pontos")) || [];
    
    //Captura a div do HTML, onde os dados serão exibidos.
    let container = document.getElementById("Pontos");

    //Limpa o conteúdo dessa div.
    container.innerHTML = "";

    let indice = 0;
    // Usando for...of igual ao modelo do professor
    for (let item of lista) {  //Percorre o array ponto por ponto. 
        container.innerHTML += `
            <div>
                <p><strong>Ponto:</strong> ${item.ponto} | <strong>Linha:</strong> ${item.linha} | <strong>Status:</strong> ${item.status}</p>
                <button onclick="carregar(${indice})">Editar</button>
                <button onclick="excluir(${indice})">Excluir</button>
            </div>
            <hr>
        `;
        indice++;
    }
}

// Função para carregar os dados no formulário para edição
function carregar(indice) {
    let lista = JSON.parse(localStorage.getItem("pontos")) || [];
    document.getElementById("ponto").value = lista[indice].ponto;
    document.getElementById("linha").value = lista[indice].linha;
    document.getElementById("ativo").value = lista[indice].status; // trocado para getElementById
    
    indiceEdicao = indice;
}

// Evento do botão Alterar
document.getElementById('btn_alterar').addEventListener("click", () => {
    if (indiceEdicao === null) {
        alert("Selecione um ponto para alterar clicando em 'Editar'.");
        return;
    }
//  Substitui o objeto antigo na posição 'indiceEdicao' pelos novos valores digitados
    let lista = JSON.parse(localStorage.getItem("pontos")) || [];
    lista[indiceEdicao] = {
        ponto: document.getElementById("ponto").value,
        linha: document.getElementById("linha").value,
        status: document.getElementById("ativo").value // trocado para getElementById
    };
// Salva no localStorage
    localStorage.setItem("pontos", JSON.stringify(lista));
    indiceEdicao = null;
    limparCampos();
    listar();
});

// Função para excluir um ponto
function excluir(indice) {
    let lista = JSON.parse(localStorage.getItem("pontos")) || [];
    lista.splice(indice, 1);
    localStorage.setItem("pontos", JSON.stringify(lista));
    listar();
}

// Limpa os inputs após cadastrar ou alterar
function limparCampos() {
    document.getElementById("ponto").value = "";
    document.getElementById("linha").value = "";
    document.getElementById("ativo").value = "ativo"; // trocado para getElementById
}

// chama a func listar ao carregar a página
listar();