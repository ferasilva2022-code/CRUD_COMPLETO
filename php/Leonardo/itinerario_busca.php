<?php
include_once ('../conexao.php');
$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

// busca por ?termo= (procura no sentido, no código e no nome da linha) e, opcionalmente, ?situacao=Ativo|Inativo
$termo    = isset($_GET['termo']) ? trim($_GET['termo']) : '';
$situacao = isset($_GET['situacao']) ? trim($_GET['situacao']) : '';
$like     = '%' . $termo . '%';

$sql = "SELECT i.id, i.sentido, i.id_linha, l.nome AS nome_linha, i.situacao, i.horario_inicio, i.horario_fim
        FROM itinerario i
        LEFT JOIN linha l ON l.id = i.id_linha
        WHERE (i.sentido LIKE ? OR i.id_linha LIKE ? OR l.nome LIKE ?)";

if ($situacao !== '') {
    $sql .= " AND i.situacao = ?";
    $sql .= " ORDER BY i.id";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param('ssss', $like, $like, $like, $situacao);
} else {
    $sql .= " ORDER BY i.id";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param('sss', $like, $like, $like);
}
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
if ($resultado->num_rows > 0) {
    while ($linha = $resultado->fetch_assoc()) {
        $tabela[] = $linha;
    }

    $retorno = [
        'status' => 'ok',
        'mensagem' => 'Consulta realizada com sucesso!',
        'data' => $tabela
    ];
} else {
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Nenhum itinerário encontrado',
        'data' => []
    ];
}
$stmt->close();
$conexao->close();

header('Content-type:application/json;charset=utf-8');
echo json_encode($retorno);
?>

ITINERARIO DETALHE

<?php
include_once ('../conexao.php');
$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

// com ?id= traz um itinerário; sem id traz todos (mesmo padrão do linha_detalhe.php)
if (!empty($_GET['id'])) {
    $stmt = $conexao->prepare("SELECT * FROM itinerario WHERE id = ?");
    $stmt->bind_param("i", $_GET['id']);
} else {
    $stmt = $conexao->prepare("SELECT * FROM itinerario ORDER BY id");
}
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
if ($resultado->num_rows > 0) {
    while ($linha = $resultado->fetch_assoc()) {
        $tabela[] = $linha;
    }

    $retorno = [
        'status' => 'ok',
        'mensagem' => 'Consulta realizada com sucesso!',
        'data' => $tabela
    ];
} else {
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Não existe registros',
        'data' => []
    ];
}
$stmt->close();
$conexao->close();

header('Content-type:application/json;charset=utf-8');
echo json_encode($retorno);
?>
