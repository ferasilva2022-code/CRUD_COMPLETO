document.addEventListener("DOMContentLoaded", () => {
    // Garante que exista a "tabela" itinerarios no localStorage (cria vazia se não existir)
    verificaItinerarios();
    // Lê os dados do localStorage e monta a tabela HTML na tela
    carregaRegistros();

    // adicionei valores pra saber se o usuário clicou em Editar/Excluir
    const parametros = new URLSearchParams(window.location.search);    // URLSearchParams lê os parâmetros que vêm depois do "?" na URL
    const acao = parametros.get("acao"); // "alterar" ou "excluir"
    const id = parametros.get("id");     // id do registro clicado

    // Monta a URL "limpa" (sem os parâmetros ?id=...&acao=...) pra poder
    
    // redirecionar de volta pra essa mesma página depois de excluir/salvar
    const url = window.location.origin + window.location.pathname;

    // Se veio "acao" e "id" na URL, significa que o usuário clicou em Editar ou Excluir
    // então já executamos a ação correspondente assim que a página carrega
    if(acao !== null && id !== null){
        executaAcao(acao, id, url);
    }

    // Evento de clique do botão "Adicionar" (parte do CREATE do CRUD)
    document.getElementById("btnAdicionar").addEventListener("click", () => {
        // Pega os valores digitados/selecionados no formulário
        var codigoLinha = document.getElementById("codigoLinha").value;
        var sentido = document.getElementById("sentido").value;
        var ativo = document.getElementById("ativo").value; // vem como texto "true"/"false" do <select>
//
        // Validação simples: campos obrigatórios não podem estar vazios
        if(codigoLinha == "" || sentido == ""){
            document.getElementById("msgForm").textContent = "Preencha código da linha e sentido.";
            return; // para a execução aqui, não deixa continuar e salvar
        }

        // Limpa mensagem de erro caso tenha passado na validação
        document.getElementById("msgForm").textContent = "";

        // Monta o objeto que representa uma "linha" da tabela itinerario
        var obj = {
            id_itinerario: geraNovoId(), // gera um ID novo (chave primária)
            codigo_linha: codigoLinha,
            sentido: sentido,
            ativo: ativo == "true" // converte o texto "true"/"false" pra booleano de verdade
        };
//
        // Lê o array atual do localStorage, adiciona o novo objeto no final
        var itinerarios = JSON.parse(localStorage.getItem("itinerarios"));
        itinerarios.push(obj);
        //e salva o array atualizado de volta (sempre como texto/JSON)
        localStorage.setItem("itinerarios", JSON.stringify(itinerarios));
        // Recarrega a página pra mostrar a tabela atualizada
        window.location.reload();
    });
});

// Função de "inicialização": se ainda não existe a chave "itinerarios" no
// localStorage, cria ela com um array vazio "[]". Evita erro de "null" nas outras funções.
function verificaItinerarios(){
    var itinerarios = localStorage.getItem("itinerarios");
    if(itinerarios == null){
        localStorage.setItem("itinerarios", JSON.stringify([]));
    }
}

// Gera um novo ID pro próximo registro, pegando o maior ID já existente + 1
// (simula o auto-incremento de uma chave primária de banco de dados)
function geraNovoId(){
    var itinerarios = JSON.parse(localStorage.getItem("itinerarios"));

    // Se a lista estiver vazia, começa do ID 1
    if(itinerarios.length == 0){
        return 1;
    }

    // Percorre todos os itens procurando o maior id_itinerario já usado
    var maiorId = 0;
    itinerarios.forEach((item) => {
        if(item.id_itinerario > maiorId){
            maiorId = item.id_itinerario;
        }
    });

    return maiorId + 1;
}

// Função do READ do CRUD: lê os dados salvos e monta a tabela HTML
function carregaRegistros(){
    var itinerarios = JSON.parse(localStorage.getItem("itinerarios"));

    // Se não tem nenhum registro salvo, mostra uma mensagem em vez da tabela
    if(itinerarios.length == 0){
        document.getElementById("listaItinerarios").innerHTML = "<p>Nenhum itinerário cadastrado ainda.</p>";
        return;
    }

    // Parte inicial da tabela (abre <table>, cabeçalho <thead> e abre <tbody>)
    var tabelaP1 = `<table border="1" cellpadding="6">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Código da Linha</th>
                            <th>Sentido</th>
                            <th>Situação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>`;
//
    // Parte final da tabela (fecha <tbody> e </table>)
    var tabelaP2 = `</tbody>
                    </table>`;

    // Aqui montei, um forEach, uma linha <tr> de tabela pra cada
    // item que estiver salvo no localStorage
    var tabelaMeio = "";
    itinerarios.forEach((item) => {
        tabelaMeio += `<tr>
                            <td>#${item.id_itinerario}</td>
                            <td>${item.codigo_linha}</td>
                            <td>${item.sentido}</td>
                            <td>${badgeStatus(item.ativo)}</td>
                            <td>
                                <a href='itinerario.html?id=${item.id_itinerario}&acao=alterar'>Editar</a>
                                &nbsp;|&nbsp;
                                <a href='itinerario.html?id=${item.id_itinerario}&acao=excluir'>Excluir</a>
                            </td>
                        </tr>`;
    });
//
    // Junta as 3 partes (abertura + linhas + fechamento) e insere no HTML da página
    var tabelaFinal = tabelaP1 + tabelaMeio + tabelaP2;
    document.getElementById("listaItinerarios").innerHTML = tabelaFinal;
}

// Função que trata as ações vindas pela URL: "excluir" (DELETE) e "alterar" (UPDATE)
// Recebe a ação, o id do registro clicado, e a url "limpa" pra redirecionar depois
function executaAcao(acao, id, url){
    var itinerarios = JSON.parse(localStorage.getItem("itinerarios"));
    // findIndex procura a POSIÇÃO (índice) do item no array cujo id bate com o id recebido
    // usei == (não ===) porque o "id" que vem da URL é string e o id_itinerario é number
    var indice = itinerarios.findIndex((item) => item.id_itinerario == id);

    if(acao == 'excluir'){
        // DELETE: splice(indice, 1) remove 1 item a partir daquela posição do array
        itinerarios.splice(indice, 1);
        alert("Itinerário excluído com sucesso!");

        // Salva o array já sem o item excluído
        localStorage.setItem("itinerarios", JSON.stringify(itinerarios));
        // Redireciona pra página limpa (sem os parâmetros ?id=...&acao=...)
        window.location.href = url;

    }else if(acao == 'alterar'){
        // UPDATE (parte 1): pega o objeto que será editado e preenche o formulário
        // com os dados atuais dele, pra o usuário poder ver e alterar
        var obj = itinerarios[indice];
        document.getElementById("codigoLinha").value = obj.codigo_linha;
        document.getElementById("sentido").value = obj.sentido;
        document.getElementById("ativo").value = obj.ativo ? "true" : "false";
        // Desabilita o botão "Adicionar" enquanto estiver editando,
        // pra não criar um registro novo por engano
        document.getElementById("btnAdicionar").disabled = true;

//
        // Mostra o botão "Salvar", que só aparece no modo de edição
        document.getElementById("btnSalvar").style.display = "inline-block";

        // UPDATE (parte 2): quando clicar em "Salvar", pega os valores atuais
        // do formulário e sobrescreve os dados do item no array, na mesma posição (indice)
        document.getElementById("btnSalvar").addEventListener("click", () => {
            itinerarios[indice].codigo_linha = document.getElementById("codigoLinha").value;
            itinerarios[indice].sentido = document.getElementById("sentido").value;
            itinerarios[indice].ativo = document.getElementById("ativo").value == "true";
            // Salva o array já atualizado de volta no localStorage
            localStorage.setItem("itinerarios", JSON.stringify(itinerarios));
            // Redireciona de volta pra página limpa
            window.location.href = url;
        });
//
    }else{
        // Caso a "acao" da URL não seja nem "alterar" nem "excluir" (não deveria acontecer)
        console.log("Algo deu muito errado");
    }
}

// Função auxiliar só pra transformar o booleano "ativo" em um texto mais bonito pra tela
function badgeStatus(ativo){
    return ativo ? "Ativo" : "Inativo";
}