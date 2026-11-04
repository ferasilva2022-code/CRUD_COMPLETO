<?php
// Funções compartilhadas do CRUD de Horários.

header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');

// Resposta enviada apara o JavaScript.
function horario_responder($codigo, $status, $mensagem, $data = []) {
    http_response_code($codigo);

    echo json_encode([
        'status' => $status,
        'mensagem' => $mensagem,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Tratamento dos erros do banco.
set_exception_handler(function ($erro) {
    error_log('BusMap Horários: ' . $erro->getMessage());

    if ($erro instanceof mysqli_sql_exception &&
        $erro->getCode() == 1452) {
        horario_responder(
            422,
            'nok',
            'A linha ou o ponto não está cadastrado.'
        );
    }

    horario_responder(
        500,
        'nok',
        'Erro no banco. Verifique o XAMPP e a conexão.'
    );
});

// Confere se a requisição usa GET ou POST.
function horario_metodo($esperado) {
    if ($_SERVER['REQUEST_METHOD'] !== $esperado) {
        horario_responder(405, 'nok', 'Método não permitido.');
    }
}

// Aproveitar a conexão já existente no projeto
function horario_db() {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    ob_start();

    try {
        require __DIR__ . '/../conexao.php';
    } finally {
        ob_end_clean();
    }

    if (!isset($conexao) || !($conexao instanceof mysqli)) {
        throw new Exception('Conexão indisponível.');
    }

    $conexao->set_charset('utf8mb4');

    return $conexao;
}

// Valida o ID do registro.
function horario_id($valor) {
    $id = filter_var($valor, FILTER_VALIDATE_INT);

    if ($id === false || $id < 1) {
        horario_responder(422, 'nok', 'ID inválido.');
    }

    return $id;
}

// Recebe e valida os dados do formulário.
function horario_campos() {
    $codigo = strtoupper(trim($_POST['codigo_linha'] ?? ''));
    $ponto = filter_var(
        $_POST['numero_ponto'] ?? null,
        FILTER_VALIDATE_INT
    );
    $hora = trim($_POST['hora'] ?? '');
    $dia = trim($_POST['dia'] ?? '');
    $tabela = filter_var(
        $_POST['tabela'] ?? null,
        FILTER_VALIDATE_INT
    );
    $adaptacao = trim($_POST['adaptacao'] ?? '');

    if (!preg_match('/^[A-Z0-9]{1,3}$/', $codigo)) {
        horario_responder(422, 'nok', 'Código da linha inválido.');
    }

    if ($ponto === false || $ponto < 1) {
        horario_responder(422, 'nok', 'Número do ponto inválido.');
    }

    if (!preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9]$/', $hora)) {
        horario_responder(422, 'nok', 'Horário inválido.');
    }

    if (!in_array(
        $dia,
        ['dia_util', 'sabado', 'domingo', 'feriado'],
        true
    )) {
        horario_responder(422, 'nok', 'Dia inválido.');
    }

    if ($tabela === false || $tabela < 1) {
        horario_responder(422, 'nok', 'Número da tabela inválido.');
    }

    if (strlen($adaptacao) > 100) {
        horario_responder(422, 'nok', 'Adaptação muito longa.');
    }

    return [$codigo, $ponto, $hora, $dia, $tabela, $adaptacao];
}
