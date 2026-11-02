<?php
include_once ('../valida_admin.php'); // só admin cadastra por aqui (o cadastro público é o php/cadastro.php)
include_once ('../conexao.php');
$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

$nome     = trim($_POST['nome'] ?? '');
$email    = trim($_POST['email'] ?? '');
$senha    = $_POST['senha'] ?? '';
$tipo     = $_POST['tipo'] ?? '';
$telefone = trim($_POST['telefone'] ?? '');

if($tipo != 'admin' && $tipo != 'usuario'){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Tipo inválido. Use admin ou usuario.',
        'data' => []
    ];
}else if($nome == '' || $email == '' || $senha == ''){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Nome, email e senha são obrigatórios.',
        'data' => []
    ];
}else{
    // verifica se o email ja esta sendo utilizado
    $busca = $conexao->prepare("SELECT id FROM usuarios WHERE email = ?");
    $busca->bind_param('s', $email);
    $busca->execute();
    $existe = $busca->get_result()->num_rows > 0;
    $busca->close();

    if($existe){
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Já existe um usuário com esse email.',
            'data' => []
        ];
    }else{
        $stmt = $conexao->prepare("INSERT INTO usuarios (nome, email, senha, tipo, telefone) VALUES (?,?,?,?,?)");
        $stmt->bind_param('sssss', $nome, $email, $senha, $tipo, $telefone);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            $retorno = [
                'status' => 'ok',
                'mensagem' => 'Usuário cadastrado com sucesso',
                'data' => ['id' => $conexao->insert_id]
            ];
        }else{
            $retorno = [
                'status' => 'nok',
                'mensagem' => 'Falha ao cadastrar o usuário',
                'data' => []
            ];
        }
        $stmt->close();
    }
}
$conexao->close();

header("Content-type:application/json;charset=utf-8");
echo json_encode($retorno);
?>
