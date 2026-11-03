
<?php
include_once('../conexao.php');

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

$busca = '%' . ($_GET['q'] ?? '') . '%';
$stmt = $conexao->prepare("SELECT * FROM ponto WHERE nome LIKE ? OR tipo LIKE ? ORDER BY id");

$stmt->bind_param('ss', $busca, $busca);
$stmt->execute();

$resultado = $stmt->get_result();
$tabela = [];

while ($linha = $resultado->fetch_assoc()) {
    $tabela[] = $linha;
}

$retorno = [
    'status' => 'ok',
    'mensagem' => 'Busca realizada com sucesso',
    'data' => $tabela
];

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset=utf-8");
echo json_encode($retorno);
?>

