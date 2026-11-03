<?php
require_once __DIR__ . '/horario_comum.php';

horario_metodo('POST');

$id = horario_id($_POST['id'] ?? null);

[$codigo, $ponto, $hora, $dia, $tabela, $adaptacao] = horario_campos();

$conexao = horario_db();

$sql = 'UPDATE horarios SET
            codigo_linha = ?,
            numero_ponto = ?,
            hora = ?,
            dia = ?,
            tabela = ?,
            adaptacao = ?
        WHERE id_tabela_linha = ?';

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    'sissisi',
    $codigo,
    $ponto,
    $hora,
    $dia,
    $tabela,
    $adaptacao,
    $id
);

$stmt->execute();

$stmt->close();
$conexao->close();

horario_responder(
    200,
    'ok',
    'Horário atualizado com sucesso.'
);
