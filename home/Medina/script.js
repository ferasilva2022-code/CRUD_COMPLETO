// CRIANDO USUARIO 
document.getElementById("adicionar-btn").addEventListener("click", () => {
    let nomeUsuario = document.getElementById("nome").value; 
    let idadeUsuario = document.getElementById("idade").value;
    let emailUsuario = document.getElementById("email").value;
    let senhaUsuario = document.getElementById("senha").value;
    let cargoUsuario = document.getElementById("cargo").value;

    if(nomeUsuario == "" || emailUsuario == "" || senhaUsuario == "" || cargoUsuario == ""){
        alert("Preencha todos os campos necessarios: nome, email, senha e cargo");
        return;
    }

    if(idadeUsuario == ""){
        idadeUsuario = "Não informado";
    }

    let usuario = {
        nome: nomeUsuario,
        idade: idadeUsuario,
        email: emailUsuario,
        senha: senhaUsuario,
        cargo: cargoUsuario,
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios"));

    if(usuarios === null){
        usuarios = [];
    }

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    listarUsuarios();
    limparCampos();
})

// LISTANDO USUARIOS
function listarUsuarios(){
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    document.getElementById("lista-usuarios").innerHTML = "";
     if (usuarios === null) {
        usuarios = [];
     }
    usuarios.forEach((usuario, index) =>{
        let usuarioHTML = document.createElement("tr");
        usuarioHTML.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.idade}</td>
            <td>${usuario.email}</td>
            <td>${usuario.cargo}</td>

            <td>
                <button type="button" class="btn btn-warning btn-sm" onclick="carregar(${index})">Alterar</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="remover(${index})">Remover</button>
            </td>
        `;

        document.getElementById("lista-usuarios").appendChild(usuarioHTML);
    });
}

function carregar(indice){
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    let objUsuario = usuarios[indice];
    document.getElementById("nome").value = objUsuario.nome;
    document.getElementById("idade").value = objUsuario.idade;
    document.getElementById("email").value = objUsuario.email;
    document.getElementById("senha").value = objUsuario.senha;
    document.getElementById("cargo").value = objUsuario.cargo;
    document.getElementById("botoes").innerHTML = `<button class="btn btn-primary px-4" id="alterar-btn" onclick='alterar(${indice})'>Alterar</button>`;
}

function alterar(indice){
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    let nome = document.getElementById("nome").value;
    let idade = document.getElementById("idade").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    let cargo = document.getElementById("cargo").value;

    if(nome == "" || email == "" || senha == "" || cargo == ""){
        alert("Preencha todos os campos necessarios: nome, email, senha e cargo");
        return;
    }

    if(idade == ""){
        idade = "Não informado";
    }

    usuarios[indice].nome = nome;
    usuarios[indice].idade = idade;
    usuarios[indice].email = email;
    usuarios[indice].senha = senha;
    usuarios[indice].cargo = cargo;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    listarUsuarios();
    limparCampos();

}

function remover(indice){
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    usuarios.splice(indice, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    listarUsuarios();
}

function limparCampos(){
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("cargo").value = "cliente";

    document.getElementById("botoes").innerHTML = `<button type="button" id="adicionar-btn" class="btn btn-primary px-4">Adicionar</button>`;
}

document.getElementById("mostrar-senha").addEventListener("click", () => {
    let senha = document.getElementById("senha");
    let icone = document.querySelector("#mostrar-senha i");

    if (senha.type === "password") {
        senha.type = "text";
        icone.classList.replace("bi-eye", "bi-eye-slash");
    } else {
        senha.type = "password";
        icone.classList.replace("bi-eye-slash", "bi-eye");
    }
});

listarUsuarios();