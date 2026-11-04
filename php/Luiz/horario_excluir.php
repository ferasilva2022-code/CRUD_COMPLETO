<?php
require_once __DIR__ . '/horario_comum.php';

horario_metodo('POST');

$id = horario_id($_POST['id'] ?? null);

$conexao = horario_db();

$sql = 'DELETE FROM horarios
        WHERE id_tabela_linha = ?';

$stmt = $conexao->prepare($sql);

$stmt->bind_param('i', $id);
$stmt->execute();

$excluidos = $stmt->affected_rows;

$stmt->close();
$conexao->close();

if ($excluidos === 0) {
    horario_responder(
        404,
        'nok',
        'Horário não encontrado para excluir.'
    );
}

horario_responder(
    200,
    'ok',
    'Horário excluído com sucesso.'
);
