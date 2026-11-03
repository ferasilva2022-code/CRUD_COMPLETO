
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

try {
    $stmt = $conexao->prepare("INSERT INTO ponto (id, nome, tipo, latitude, longitude) VALUES (?,?,?,?,?)");
    $stmt->bind_param('issdd', $id, $nome, $tipo, $latitude, $longitude);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Ponto inserido com sucesso',
            'data' => []
        ];
    } else {
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Falha ao inserir o ponto',
            'data' => []
        ];
    }

    $stmt->close();

} 
catch (mysqli_sql_exception $erro) {
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Não foi possível inserir. Verifique se o ID já existe.',
        'data' => []
    ];
}

$conexao->close();

header("Content-type:application/json;charset=utf-8");
echo json_encode($retorno);
?>
