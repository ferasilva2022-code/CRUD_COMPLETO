<?php
include_once ('../conexao.php');
mysqli_report(MYSQLI_REPORT_OFF);

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

// o id vem pela URL (?id=) e os novos valores por POST (FormData), como no linha_alterar.php
if (isset($_GET['id'])) {
    $sentido        = isset($_POST['sentido']) ? trim($_POST['sentido']) : '';
    $id_linha       = isset($_POST['id_linha']) ? trim($_POST['id_linha']) : '';
    $situacao       = (isset($_POST['situacao']) && $_POST['situacao'] == 'Inativo') ? 'Inativo' : 'Ativo';
    $horario_inicio = !empty($_POST['horario_inicio']) ? $_POST['horario_inicio'] : '00:00:00';
    $horario_fim    = !empty($_POST['horario_fim']) ? $_POST['horario_fim'] : '00:00:00';

    if ($sentido === '' || $id_linha === '') {
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Preencha o código da linha e o sentido.',
            'data' => []
        ];
    } else {
        $stmt = $conexao->prepare("UPDATE itinerario SET sentido = ?, id_linha = ?, situacao = ?, horario_inicio = ?, horario_fim = ? WHERE id = ?");
        $stmt->bind_param('sssssi', $sentido, $id_linha, $situacao, $horario_inicio, $horario_fim, $_GET['id']);
        $stmt->execute();

        if ($stmt->errno == 1452) {
            $retorno = [
                'status' => 'nok',
                'mensagem' => 'Não foi possível alterar: a linha informada não existe.',
                'data' => []
            ];
        } else if ($stmt->affected_rows > 0) {
            $retorno = [
                'status' => 'ok',
                'mensagem' => 'Itinerário alterado com sucesso',
                'data' => []
            ];
        } else {
            $retorno = [
                'status' => 'nok',
                'mensagem' => 'Não foi possível alterar o registro (id inexistente ou nenhum dado foi modificado).',
                'data' => []
            ];
        }
        $stmt->close();
    }
} else {
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Não foi possível alterar o registro sem um ID informado.',
        'data' => []
    ];
}
$conexao->close();

header('Content-type: application/json;charset=utf-8');
echo json_encode($retorno);
?>
