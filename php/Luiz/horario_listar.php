<?php
require_once __DIR__ . '/horario_comum.php';

horario_metodo('GET');

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
        ORDER BY id_tabela_linha DESC';

$resultado = $conexao->query($sql);

$dados = $resultado->fetch_all(MYSQLI_ASSOC);

$conexao->close();

horario_responder(
    200,
    'ok',
    'Horários consultados.',
    $dados
);
