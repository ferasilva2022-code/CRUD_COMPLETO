<?php
include_once ('../conexao.php');
$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

// lista todos os itinerários, já trazendo o nome da linha (JOIN com a tabela linha)
$stmt = $conexao->prepare("SELECT i.id, i.sentido, i.id_linha, l.nome AS nome_linha, i.situacao, i.horario_inicio, i.horario_fim
                           FROM itinerario i
                           LEFT JOIN linha l ON l.id = i.id_linha
                           ORDER BY i.id");
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
