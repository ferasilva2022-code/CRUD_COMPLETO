<?php
require_once __DIR__ . '/horario_comum.php';

horario_metodo('GET');

$id = horario_id($_GET['id'] ?? null);

$conexao = horario_db();

$sql = 'SELECT
            id_tabela_linha,
            codigo_linha,
            numero_ponto,
            hora,
            dia,
            tabela,
            adaptacao
        FROM horarios
        WHERE id_tabela_linha = ?';

$stmt = $conexao->prepare($sql);

$stmt->bind_param('i', $id);
$stmt->execute();

$registro = $stmt->get_result()->fetch_assoc();

$stmt->close();
$conexao->close();

if (!$registro) {
    horario_responder(
        404,
        'nok',
        'Horário não encontrado.'
    );
}

horario_responder(
    200,
    'ok',
    'Horário encontrado.',
    [$registro]
);
