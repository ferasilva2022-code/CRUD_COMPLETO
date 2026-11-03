<?php
include_once ('../conexao.php');
mysqli_report(MYSQLI_REPORT_OFF); // erros de SQL voltam como 'nok' em vez de derrubar o PHP

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

// recebe os dados em JSON (mesmo padrão do linha_novo.php)
$dados = json_decode(file_get_contents('php://input'), true);

$codigo_linha   = isset($dados['codigoLinha']) ? trim($dados['codigoLinha']) : '';
$sentido        = isset($dados['sentido']) ? trim($dados['sentido']) : '';
$situacao       = (isset($dados['ativo']) && ($dados['ativo'] === false || $dados['ativo'] === 'false')) ? 'Inativo' : 'Ativo';
$horario_inicio = !empty($dados['horarioInicio']) ? $dados['horarioInicio'] : '00:00:00';
$horario_fim    = !empty($dados['horarioFim']) ? $dados['horarioFim'] : '00:00:00';

if ($codigo_linha === '' || $sentido === '') {
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Preencha o código da linha e o sentido.',
        'data' => []
    ];
} else {
    // a coluna id não é AUTO_INCREMENT: usa o id enviado ou gera o próximo (maior id + 1)
    if (!empty($dados['idItinerario'])) {
        $id = (int) $dados['idItinerario'];
    } else {
        $res = $conexao->query("SELECT COALESCE(MAX(id), 0) + 1 AS proximo FROM itinerario");
        $id = (int) $res->fetch_assoc()['proximo'];
    }

    $stmt = $conexao->prepare("INSERT INTO itinerario (id, sentido, id_linha, situacao, horario_inicio, horario_fim) VALUES (?,?,?,?,?,?)");
    $stmt->bind_param('isssss', $id, $sentido, $codigo_linha, $situacao, $horario_inicio, $horario_fim);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Itinerário inserido com sucesso',
            'data' => ['id' => $id]
        ];
    } else {
        // 1452 = linha inexistente (chave estrangeira), 1062 = id duplicado
        $motivo = 'Falha ao inserir o itinerário';
        if ($stmt->errno == 1452) $motivo = 'Falha ao inserir: a linha informada não existe.';
        if ($stmt->errno == 1062) $motivo = 'Falha ao inserir: já existe um itinerário com esse ID.';
        $retorno = [
            'status' => 'nok',
            'mensagem' => $motivo,
            'data' => []
        ];
    }
    $stmt->close();
}
$conexao->close();

header('Content-type:application/json;charset=utf-8');
echo json_encode($retorno);
?>
