<?php
require_once __DIR__ . '/horario_comum.php';
require_once __DIR__ . '/../valida_admin.php'; // só admin pode alterar os dados

horario_metodo('POST');

[$codigo, $ponto, $hora, $dia, $tabela, $adaptacao] = horario_campos();

$conexao = horario_db();

$sql = 'INSERT INTO horarios
        (codigo_linha, numero_ponto, hora, dia, tabela, adaptacao)
        VALUES (?, ?, ?, ?, ?, ?)';

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    'sissis',
    $codigo,
    $ponto,
    $hora,
    $dia,
    $tabela,
    $adaptacao
);

$stmt->execute();

$id = $conexao->insert_id;

$stmt->close();
$conexao->close();

horario_responder(
    201,
    'ok',
    'Horário cadastrado com sucesso.',
    ['id' => $id]
);
