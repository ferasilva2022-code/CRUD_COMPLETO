<?php
    include_once('conexao.php');
    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    // ?? '' evita aviso do PHP se algum campo não vier do front
    $nome     = trim($_POST['nome'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $senha    = $_POST['senha'] ?? '';
    $telefone = trim($_POST['telefone'] ?? '');
    // quem se cadastra pela tela de login é sempre usuário comum;
    // o tipo é definido aqui e não vem do front, para ninguém virar admin sozinho
    $tipo     = 'usuario';

    if($nome == '' || $email == '' || $senha == ''){
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Nome, email e senha são obrigatórios.',
            'data'      => []
        ];
    }else{
        // não deixa cadastrar o mesmo email duas vezes (o login é pelo email)
        $stmt = $conexao->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmt->bind_param("s",$email);
        $stmt->execute();
        $existe = $stmt->get_result()->num_rows > 0;
        $stmt->close();

        if($existe){
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Já existe um usuário com esse email.',
                'data'      => []
            ];
        }else{
            // Preparando para inserção no banco de dados
            $stmt = $conexao->prepare("
            INSERT INTO usuarios(nome, email, senha, tipo, telefone) VALUES(?,?,?,?,?)");
            $stmt->bind_param("sssss",$nome, $email, $senha, $tipo, $telefone);
            $stmt->execute();

            if($stmt->affected_rows > 0){
                $retorno = [
                    'status'    => 'ok',
                    'mensagem'  => 'Cadastro realizado! Agora é só entrar com seu email e senha.',
                    'data'      => []
                ];
            }else{
                $retorno = [
                    'status'    => 'nok',
                    'mensagem'  => 'Falha ao realizar o cadastro.',
                    'data'      => []
                ];
            }
            $stmt->close();
        }
    }

    $conexao->close();

    header("Content-type:application/json;charset=utf-8");
    echo json_encode($retorno);
