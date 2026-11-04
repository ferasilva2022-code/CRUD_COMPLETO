<?php
require_once __DIR__ . '/horario_comum.php';

horario_metodo('GET');

$termo = trim($_GET['termo'] ?? '');

if (strlen($termo) > 50) {
    horario_responder(
        422,
        'nok',
        'Pesquise usando até 50 caracteres.'
    );
}

$conexao = horario_db();

$busca = '%' . $termo . '%';

$sql = 'SELECT
            id_tabela_linha,
            codigo_linha,
            numero_ponto,
            hora,
            dia,
            tabela,
            adaptacao
        FROM horarios
        WHERE codigo_linha LIKE ?
           OR CAST(numero_ponto AS CHAR) LIKE ?
           OR dia LIKE ?
        ORDER BY id_tabela_linha DESC';

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    'sss',
    $busca,
    $busca,
    $busca
);

$stmt->execute();

$dados = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$stmt->close();
$conexao->close();

horario_responder(
    200,
    'ok',
    'Pesquisa concluída.',
    $dados
);
