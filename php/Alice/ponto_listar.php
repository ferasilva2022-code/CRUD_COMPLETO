<?php
include_once('../conexao.php');

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

$stmt = $conexao->prepare("SELECT * FROM ponto ORDER BY id");
$stmt->execute();

$resultado = $stmt->get_result();
$tabela = [];

while ($linha = $resultado->fetch_assoc()) {
    $tabela[] = $linha;
}

$retorno = [
    'status' => 'ok',
    'mensagem' => 'Consulta realizada com sucesso',
    'data' => $tabela
];

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset=utf-8");
echo json_encode($retorno);
?>
