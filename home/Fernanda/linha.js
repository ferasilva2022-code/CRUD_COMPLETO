
//CADASTRAR AS LINHAS
const formCadastroLinha = document.getElementById('formularioCadastroLinha'); //puxando o formulário la do html das linhas
let indiceEdicao = null; // ngm vai ser editado por enqaunto

document.addEventListener('DOMContentLoaded', () =>{
    carregarLinhas();
});

formCadastroLinha.addEventListener('submit', async(event) =>{
    event.preventDefault(); // esse trem serve para a página não recarregar
    
    const erros = validarFormLinha();
    mostrarErros(erros);
    if (Object.keys(erros).length > 0) return; // se der erro, para aqui.
    
    // variáveis que vem la do html
    let nomeLinha = document.getElementById('nomeLinha').value;
    let codigoLinha = document.getElementById('codigoLinha').value;
    let checkboxStatus = document.getElementById('statusLinha');
    let statusLinha = checkboxStatus.checked ? 'Ativa' : 'Inativa';


    //LISTAGEM DAS LINHAS
    // vai la pro localStorage
    const linha = JSON.parse(localStorage.getItem('linhas_de_onibus')) || [];
    const obj = {codigo: codigoLinha, nome: nomeLinha, status:statusLinha}; // forma como os dados serão apresentados la na application
    if (indiceEdicao !== null) {
        // Edição acontecendo, então altera a posição original
        linha[indiceEdicao] = obj;
        indiceEdicao = null; // Voltou ao estado padrão
        document.getElementById('btnCadastrarLinha').textContent = 'Cadastrar';
    } else {
        // Novo registro
        linha.push(obj);
    }
    localStorage.setItem('linhas_de_onibus', JSON.stringify(linha));
    

    carregarLinhas(); // carrega as linhas com os indices atualizados
    formCadastroLinha.reset(); // limpa o formulário
    
    // fazendo a ponte de envio dos dados do form => servidor
    let formData = new FormData(formCadastroLinha); // aqui extrai os valores digitados
    let dados = Object.fromEntries(formData); // tranforma os valores em objeto

    const resposta = await fetch ("http://localhost/busmap/php/Fernanda/linha_novo.php", {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(dados) // envia uma requisição em formato de texto - LEMBRA DE LIGAR O APACHE FERNANDA!
    });

    let respostaJSON = await resposta.json().catch(()=> ({})); // espera a resposta do PHP
    
    // Até aqui o código rodou e as funções que foram chamadas até agr deram certo
    // NÃO TOCA EM NADA DAQUI PRA CIMA FERNANDA!
 });


function carregarLinhas() {
    const tbody = document.getElementById('linhacards');
    if (!tbody) return;
    // Limpa a tabela para evitar duplicação
    tbody.innerHTML = '';
    // Pega a lista do localStorage ou inicializa com a linha padrão
    let listaLinhas = JSON.parse(localStorage.getItem('linhas_de_onibus'));
    if (listaLinhas== null) {
        listaLinhas = [{ codigo: 'B02', nome: 'Maracanã/Cabral', status: 'Ativa' }];
        localStorage.setItem('linhas_de_onibus', JSON.stringify(listaLinhas));
    }
    let indice = 0;
    // Percorre a lista criando as linhas (<tr>) da tabela
    for (let obj of listaLinhas) {
        tbody.innerHTML += `
            <tr>
                <td>${obj.codigo}</td>
                <td>${obj.nome}</td>
                <td>${obj.status}</td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm" onclick="editarLinha(${indice})">Editar</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="removerLinha(${indice})">Remover</button>
                </td>
            </tr>`;
        indice++;}}

// edção das linhas
function editarLinha(indice){
   let listaLinhas = JSON.parse(localStorage.getItem('linhas_de_onibus')) || [];
   let item = listaLinhas[indice];
   if(item){
        document.getElementById('codigoLinha').value = item.codigo;
        document.getElementById('nomeLinha').value = item.nome;
        document.getElementById('statusLinha').checked = item.status === 'Ativa';
        
        indiceEdicao = indice;
        document.getElementById('btnCadastrarLinha').textContent = 'Salvar Alteração';;
        
    }
}

// remoção das linhas
function removerLinha(indice){
    let listaLinhas = JSON.parse(localStorage.getItem('linhas_de_onibus')) || [];
    listaLinhas.splice(indice,1);
    localStorage.setItem('linhas_de_onibus',JSON.stringify(listaLinhas));
    carregarLinhas();
}

const Validar = {
    vazio: v => v.trim() === '',
    minLen: (v, n) => v.trim().length >= n,
    };


function validarFormLinha(){
    let nomeLinha = document.getElementById('nomeLinha').value;
    let codigoLinha = document.getElementById('codigoLinha').value;

    const erros ={};
    if(Validar.vazio(nomeLinha)){
        erros.nomeLinha = 'Nome obrigatório';
        alert('Preencha o nome da linha');
    }
    if(!Validar.minLen(codigoLinha,3)){
        erros.codigoLinha = 'Mínimo 3 caracteres';
        alert('o código deve conter no mínimo 3 caracteres');
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