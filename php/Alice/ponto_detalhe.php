<?php
include_once('../conexao.php');

$retorno = [
    'status' => 'nok',
    'mensagem' => 'Ponto não encontrado',
    'data' => []
];

$id = (int)($_GET['id'] ?? 0);

$stmt = $conexao->prepare("SELECT * FROM ponto WHERE id = ?");

$stmt->bind_param('i', $id);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $retorno = [
        'status' => 'ok',
        'mensagem' => 'Ponto encontrado',
        'data' => $resultado->fetch_assoc()
    ];
}

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset=utf-8");
echo json_encode($retorno);
?>

