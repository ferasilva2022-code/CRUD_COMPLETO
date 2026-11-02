<?php 
include_once('../valida_admin.php'); 
include_once('../conexao.php');
$retorno = [
    'status' => '', 
    'mensagem' => '', 
    'data' => []
];

if (isset($_GET['id'])) {
    $nome     = $_POST['nome'];
    $email    = $_POST['email'];
    $senha    = $_POST['senha'];
    $tipo     = $_POST['tipo'];
    $telefone = $_POST['telefone'];

    // verifica se o email ja esta sendo utilizado por OUTRO usuario
    $busca = $conexao->prepare("SELECT id FROM usuarios WHERE email = ? AND id <> ?");
    $busca->bind_param('si', $email, $_GET['id']);
    $busca->execute();
    $existe = $busca->get_result()->num_rows > 0;
    $busca->close();

    if ($existe) {
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Já existe um usuário com esse email.',
            'data' => []
        ];
    } else {
        if ($senha != '') {
            // Senha preenchida
            $stmt = $conexao->prepare('UPDATE usuarios SET nome = ?, email = ?, senha = ?, tipo = ?, telefone = ? WHERE id = ?');
            $stmt->bind_param('sssssi', $nome, $email, $senha, $tipo, $telefone, $_GET['id']);
        } else {
            // Senha em branco
            $stmt = $conexao->prepare('UPDATE usuarios SET nome = ?, email = ?, tipo = ?, telefone = ? WHERE id = ?');
            $stmt->bind_param('ssssi', $nome, $email, $tipo, $telefone, $_GET['id']);
        }
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $retorno = [
                'status' => 'ok',
                'mensagem' => 'Usuário alterado com sucesso',
                'data' => []
            ];
        } else {
            $retorno = [
                'status' => 'nok',
                'mensagem' => 'Não foi possível alterar o usuário',
                'data' => []
            ];
        }
        $stmt->close();
    }
} else {
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Não foi possível alterar o registro sem um ID informado',
        'data' => []
    ];
}

$conexao->close();
header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
