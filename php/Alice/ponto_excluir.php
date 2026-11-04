<?php
include_once('../valida_admin.php'); // só admin pode alterar os dados
include_once('../conexao.php');

$retorno = [
    'status' => 'nok',
    'mensagem' => 'Não foi possível excluir o ponto',
    'data' => []
];

$id = (int)($_POST['id'] ?? 0);

try {
    $stmt = $conexao->prepare("DELETE FROM ponto WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Ponto excluído com sucesso',
            'data' => [] 
            ];
    }
    $stmt->close();
    } 
catch (mysqli_sql_exception $erro) {
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Não foi possível excluir. O ponto pode estar vinculado a outro registro.',
        'data' => []
    ];
}
$conexao->close();
header("Content-type:application/json;charset=utf-8");
echo json_encode($retorno);
?>
