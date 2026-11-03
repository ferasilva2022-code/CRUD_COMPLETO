<?php
include_once ('../valida_admin.php'); // só admin pode alterar os dados
include_once ('../conexao.php');
mysqli_report(MYSQLI_REPORT_OFF);

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if (isset($_GET['id'])) {
    $stmt = $conexao->prepare("DELETE FROM itinerario WHERE id = ?");
    $stmt->bind_param('i', $_GET['id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Itinerário excluído com sucesso',
            'data' => []
        ];
    } else if ($stmt->errno == 1451) {
        // itinerário ainda referenciado em itinerario_itinerario_linha / itinerario_itinerario_ponto
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Não foi possível excluir: o itinerário está vinculado a outros registros.',
            'data' => []
        ];
    } else {
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Não foi possível excluir o registro.',
            'data' => []
        ];
    }
    $stmt->close();
} else {
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Não foi possível excluir o registro sem um ID informado.',
        'data' => []
    ];
}
$conexao->close();

header('Content-type: application/json;charset=utf-8');
echo json_encode($retorno);
?>
