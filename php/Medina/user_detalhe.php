<?php
include_once ('../conexao.php');
$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

$stmt = $conexao->prepare("SELECT id, nome, email, tipo, telefone FROM usuarios WHERE id = ?");
$stmt->bind_param('i', $_GET['id']);
$stmt->execute();
$resultado = $stmt->get_result();

if($resultado->num_rows > 0){
    $retorno = [
        'status' => 'ok', 
        'mensagem' => 'Consulta realizada com sucesso!', 
        'data' => [$resultado->fetch_assoc()]
    ];
}else{
    $retorno = [
        'status' => 'nok', 
        'mensagem' => 'Usuário não encontrado.', 
        'data' => []
    ];
}
$stmt->close();
$conexao->close();

header('Content-type:application/json;charset=utf-8');
echo json_encode($retorno);
?>
