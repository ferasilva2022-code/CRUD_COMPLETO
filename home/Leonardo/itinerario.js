// Caminhos relativos a partir de home/Leonardo/itinerario.html
// (assim funciona com qualquer nome de pasta dentro do htdocs)
const API = "../../php/Leonardo/";

// horários do itinerário que está sendo editado (o PHP de alterar precisa receber eles de volta)
let horarioInicioAtual = "00:00:00";
let horarioFimAtual = "00:00:00";

document.addEventListener("DOMContentLoaded", async () => {
    // READ: busca os itinerários no banco e monta a tabela na tela
    carregaRegistros();

    // lê os parâmetros da URL (?acao=alterar&id=1) para saber se clicou em Editar/Excluir
    const parametros = new URLSearchParams(window.location.search);
    const acao = parametros.get("acao"); // "alterar" ou "excluir"
    const id = parametros.get("id");     // id do registro clicado

    // URL "limpa" (sem ?id=...&acao=...) para voltar depois de excluir/salvar
    const url = window.location.origin + window.location.pathname;

    // Usuário logado (vem do js/valida_sessao.js)
    const usuario = await sessao;

    // só admin pode alterar/excluir (o usuário comum não pode, nem digitando a URL)
    if (acao !== null && id !== null && usuario != null && usuario.tipo == "admin") {
        executaAcao(acao, id, url);
    }

    // CREATE: botão "Adicionar"
    document.getElementById("btnAdicionar").addEventListener("click", async () => {
        const codigoLinha = document.getElementById("codigoLinha").value.trim();
        const sentido = document.getElementById("sentido").value.trim();
        const ativo = document.getElementById("ativo").value; // "true" ou "false"

        if (codigoLinha == "" || sentido == "") {
            document.getElementById("msgForm").textContent = "Preencha código da linha e sentido.";
            return;
        }
        document.getElementById("msgForm").textContent = "";

        // envia os dados em JSON para o PHP (mesmo padrão do linha.js)
        const resposta = await fetch(API + "itinerario_novo.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigoLinha: codigoLinha, sentido: sentido, ativo: ativo })
        });
        const respostaJSON = await resposta.json().catch(() => ({ mensagem: "Erro ao falar com o servidor." }));

        alert(respostaJSON.mensagem);
        if (respostaJSON.status == "ok") {
            window.location.reload();
        }
    });
});

// READ: busca todos os itinerários no PHP e monta a tabela HTML
async function carregaRegistros() {
    const lista = document.getElementById("listaItinerarios");

    let resposta;
    try {
        const retorno = await fetch(API + "itinerario_listar.php");
        resposta = await retorno.json();
    } catch (erro) {
        lista.innerHTML = "<p>Não foi possível carregar os itinerários. Confira o Apache, o MySQL e o php/conexao.php.</p>";
        return;
    }

    if (resposta.status != "ok" || resposta.data.length == 0) {
        lista.innerHTML = "<p>Nenhum itinerário cadastrado ainda.</p>";
        return;
    }

    let tabelaP1 = `<table border="1" cellpadding="6">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Código da Linha</th>
                            <th>Sentido</th>
                            <th>Situação</th>
                            <th class="somente-admin">Ações</th>
                        </tr>
                    </thead>
                    <tbody>`;
    let tabelaP2 = `</tbody>
                    </table>`;

    let tabelaMeio = "";
    resposta.data.forEach((item) => {
        tabelaMeio += `<tr>
                            <td>#${item.id}</td>
                            <td>${escapa(item.id_linha)}${item.nome_linha ? " - " + escapa(item.nome_linha) : ""}</td>
                            <td>${escapa(item.sentido)}</td>
                            <td>${escapa(item.situacao)}</td>
                            <td class="somente-admin">
                                <a href='itinerario.html?id=${item.id}&acao=alterar'>Editar</a>
                                &nbsp;|&nbsp;
                                <a href='itinerario.html?id=${item.id}&acao=excluir'>Excluir</a>
                            </td>
                        </tr>`;
    });

    lista.innerHTML = tabelaP1 + tabelaMeio + tabelaP2;
}

// DELETE e UPDATE, vindos pela URL
async function executaAcao(acao, id, url) {
    if (acao == "excluir") {
        // DELETE: pede confirmação e chama o PHP de excluir
        if (!confirm("Deseja excluir o itinerário #" + id + "?")) {
            window.location.href = url;
            return;
        }
        const retorno = await fetch(API + "itinerario_excluir.php?id=" + id);
        const resposta = await retorno.json();
        alert(resposta.mensagem);
        window.location.href = url;

    } else if (acao == "alterar") {
        // UPDATE (parte 1): busca o itinerário no banco e preenche o formulário
        const retorno = await fetch(API + "itinerario_detalhe.php?id=" + id);
        const resposta = await retorno.json();

        if (resposta.status != "ok") {
            alert(resposta.mensagem);
            window.location.href = url;
            return;
        }

        const obj = resposta.data[0];
        document.getElementById("codigoLinha").value = obj.id_linha;
        document.getElementById("sentido").value = obj.sentido;
        document.getElementById("ativo").value = obj.situacao == "Ativo" ? "true" : "false";
        horarioInicioAtual = obj.horario_inicio;
        horarioFimAtual = obj.horario_fim;

        // desabilita "Adicionar" durante a edição e mostra "Salvar Alteração"
        document.getElementById("btnAdicionar").disabled = true;
        document.getElementById("btnSalvar").style.display = "inline-block";

        // UPDATE (parte 2): ao clicar em Salvar, manda os valores para o PHP de alterar
        document.getElementById("btnSalvar").addEventListener("click", async () => {
            const codigoLinha = document.getElementById("codigoLinha").value.trim();
            const sentido = document.getElementById("sentido").value.trim();

            if (codigoLinha == "" || sentido == "") {
                document.getElementById("msgForm").textContent = "Preencha código da linha e sentido.";
                return;
            }

            const fd = new FormData();
            fd.append("id_linha", codigoLinha);
            fd.append("sentido", sentido);
            fd.append("situacao", document.getElementById("ativo").value == "true" ? "Ativo" : "Inativo");
            fd.append("horario_inicio", horarioInicioAtual);
            fd.append("horario_fim", horarioFimAtual);

            const ret = await fetch(API + "itinerario_alterar.php?id=" + id, {
                method: "POST",
                body: fd
            });
            const res = await ret.json();
            alert(res.mensagem);
            if (res.status == "ok") {
                window.location.href = url;
            }
        });

    } else {
        console.log("Ação inválida na URL");
    }
}

// evita que texto com < ou > quebre o HTML da tabela
function escapa(texto) {
    return String(texto ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
