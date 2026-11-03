
<?php
include_once('../conexao.php');

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

$dados = json_decode(file_get_contents('php://input'), true);

$id = $dados['id'];
$nome = $dados['nome'];
$tipo = $dados['tipo'];
$latitude = $dados['latitude'];
$longitude = $dados['longitude'];

$stmt = $conexao->prepare("UPDATE ponto SET nome = ?, tipo = ?, latitude = ?, longitude = ? WHERE id = ?");

$stmt->bind_param('ssddi', $nome, $tipo, $latitude, $longitude, $id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    $retorno = [
        'status' => 'ok',
        'mensagem' => 'Ponto alterado com sucesso',
        'data' => []
    ];
} else {
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Nenhuma alteração realizada',
        'data' => []
    ];
}

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset=utf-8");
echo json_encode($retorno);
?>
