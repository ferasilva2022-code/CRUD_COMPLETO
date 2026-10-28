// edição das linhas: chamada pelo botão Editar do linha.html
function editarLinha(id){
    // abre a página de alteração passando o id da linha na URL
    window.location.href = "http://localhost/busmap/home/Fernanda/linha_alterar.html?id=" + id;
}

document.addEventListener("DOMContentLoaded", () => {
    // só busca se estiver na página de alteração (no linha.html não existe a tabelaLinhas)
    if(!document.getElementById("tabelaLinhas")) return;

    // linha_alterar.html?id=B02 mostra só a linha B02; sem id, mostra todas
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    buscar(id);
});

async function buscar(id){
    let endereco = "http://localhost/busmap/php/Fernanda/linha_listar.php";
    if(id){
        endereco = "http://localhost/busmap/php/Fernanda/linha_detalhe.php?id=" + id;
    }

    const retorno = await fetch(endereco);
    const resposta = await retorno.json();

    const tabela = document.getElementById("tabelaLinhas");
    tabela.innerHTML = '';

    if(resposta.status == "ok"){
        for(const linha of resposta.data){
            tabela.innerHTML += `
                <tr>
                    <td><input type="text" class="form-control" id="id-${linha.id}" value="${linha.id}">td>
                    <td><input type="text" class="form-control" id="nome-${linha.id}" value="${linha.nome}"></td>
                    <td><input type="text" class="form-control" id="formaPagamento-${linha.id}" value="${linha.forma_de_pagamento}"></td>
                    <td>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="status-${linha.id}" ${linha.status_linha == 'Ativa' ? 'checked' : ''}>
                        </div>
                    </td>
                    <td><input type="number" class="form-control" id="valorTarifa-${linha.id}" value="${linha.valor_tarifa}" step="0.01" min="0"></td>
                    <td><button type="button" class="btn btn-primary btn-sm btn-salvar" onclick="alterar('${linha.id}')">Salvar</button></td>
                </tr>
            `;
        }
    }else{
        document.getElementById("mensagem").innerText = resposta.mensagem;
    }
}

async function alterar(id){
    let id             = document.getElementById("ID-" +id).value;
    let nome           = document.getElementById("nome-" + id).value;
    let formaPagamento = document.getElementById("formaPagamento-" + id).value;
    let statusLinha    = document.getElementById("status-" + id).checked ? 'Ativa' : 'Inativa';
    let valorTarifa    = document.getElementById("valorTarifa-" + id).value;

    const fd = new FormData();
    fd.append('id', id);
    fd.append("nome", nome);
    fd.append("forma_de_pagamento", formaPagamento);
    fd.append("status_linha", statusLinha);
    fd.append("valor_tarifa", valorTarifa);

    const retorno = await fetch("http://localhost/busmap/php/Fernanda/linha_alterar.php?id=" + id,
        {
          method: 'POST',
          body: fd
        });
    const resposta = await retorno.json();
    document.getElementById("mensagem").innerText = resposta.mensagem;
}

document.getElementById("btnVoltar")?.addEventListener("click", () => {
    window.location.href = "http://localhost/busmap/home/Fernanda/linha.html";
});