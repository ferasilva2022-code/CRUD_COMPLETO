
//CADASTRAR AS LINHAS
const formCadastroLinha = document.getElementById('formularioCadastroLinha'); //puxando o formulário la do html das linhas

document.addEventListener('DOMContentLoaded', () =>{
    carregarLinhas();
});

formCadastroLinha.addEventListener('submit', async(event) =>{
    event.preventDefault(); // esse trem serve para a página não recarregar
    
    const erros = validarFormLinha();
    mostrarErros(erros);
    if (Object.keys(erros).length > 0) return; // se der erro, para aqui.

    // fazendo a ponte de envio dos dados do form => servidor
    let formData = new FormData(formCadastroLinha); // aqui extrai os valores digitados
    let dados = Object.fromEntries(formData); // tranforma os valores em objeto
    formCadastroLinha.reset(); // limpa o formulário (depois de pegar os dados)

    const resposta = await fetch ("http://localhost/busmap/php/Fernanda/linha_novo.php", {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(dados) // envia uma requisição em formato de texto - LEMBRA DE LIGAR O APACHE FERNANDA!
    });

    let respostaJSON = await resposta.json().catch(()=> ({})); // espera a resposta do PHP
    alert(respostaJSON.mensagem); // mostra se a linha foi inserida ou deu erro
    carregarLinhas(); // recarrega a lista depois de gravar no banco

    // Até aqui o código rodou e as funções que foram chamadas até agr deram certo
    // NÃO TOCA EM NADA DAQUI PRA CIMA FERNANDA!
 });


async function carregarLinhas() {
    const tbody = document.getElementById('linhacards');
    if (!tbody) return;
    // Limpa a tabela para evitar duplicação
    tbody.innerHTML = '';
    // // Pega a lista do localStorage ou inicializa com a linha padrão
    // let listaLinhas = JSON.parse(localStorage.getItem('linhas_de_onibus'));
    // if (listaLinhas== null) {
    //     listaLinhas = [{ id: 'B02', nome: 'Maracanã/Cabral', forma_pagamento:'Somente Cartão', status: 'Ativa', valor_tarifa: 'R$6,00' }];
    //     localStorage.setItem('linhas_de_onibus', JSON.stringify(listaLinhas));
    // }
    const retorno = await fetch ("http://localhost/busmap/php/Fernanda/linha_detalhe.php");
    const resposta = await retorno.json();
    // Percorre a lista criando as linhas (<tr>) da tabela
    for (let obj of resposta.data) {
        tbody.innerHTML += `
            <tr>
                <td>${obj.id}</td>
                <td>${obj.nome}</td>
                <td>${obj.forma_de_pagamento}</td>
                <td>${obj.status_linha}</td>
                <td>${obj.valor_tarifa}</td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm" onclick="editarLinha('${obj.id}')">Editar</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="excluir('${obj.id}')">Remover</button>
                </td>
            </tr>`;
    }
}

const Validar = {
    vazio: v => v.trim() === '',
    minLen: (v, n) => v.trim().length >= n,
    };


function validarFormLinha(){
    let nomeLinha = document.getElementById('nomeLinha').value;
    let idLinha = document.getElementById('idLinha').value;

    const erros ={};
    if(Validar.vazio(nomeLinha)){
        erros.nomeLinha = 'Nome obrigatório';
        alert('Preencha o nome da linha');
    }
    if(!Validar.minLen(idLinha,3)){
        erros.idLinha ='Mínimo 3 caracteres';
        alert('o ID deve conter no mínimo 3 caracteres');
    }
        return erros;
} // se estiver tudo ok => objeto vazio = sem erros

// função qque mostra os erros
 function mostrarErros(erros){
    limparErros();
    Object.entries(erros).forEach(([campo,msg]) => {
        document.getElementById(campo)?.classList.add('input-erro');

        const span = document.getElementById('erro-' + campo);
        if (span) {span.textContent= msg};
    }); // função que mostra caso alguma caca aconteça
}


function limparErros(){
    document.querySelectorAll('.input-erro').forEach(el => el.classList.remove('input-erro'));
    document.querySelectorAll('.msg-erro').forEach(el=>el.textContent=''); 
} // limpa os erros