<?php
// API JSON do módulo de alertas. Compatível com PHP 7.4+ e mysqli/mysqlnd (XAMPP).
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
ini_set('display_errors', '0');

function responder(int $http, string $status, string $mensagem, array $data = []): void {
    http_response_code($http);
    echo json_encode(['status'=>$status, 'mensagem'=>$mensagem, 'data'=>$data,
        'csrf'=>$_SESSION['alertas_csrf'] ?? ''], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}
function inteiro($valor, string $campo): int {
    if (is_bool($valor) || !is_scalar($valor) || filter_var($valor, FILTER_VALIDATE_INT) === false || (int)$valor < 1) {
        responder(422, 'nok', 'Informe um '.$campo.' válido.');
    }
    return (int)$valor;
}
function texto(array $dados, string $campo, int $limite): string {
    if (!isset($dados[$campo]) || !is_string($dados[$campo])) responder(422,'nok','Preencha o campo '.$campo.'.');
    $valor = trim($dados[$campo]);
    $tamanho = function_exists('mb_strlen') ? mb_strlen($valor,'UTF-8') : preg_match_all('/./us',$valor);
    if ($valor === '' || $tamanho === false || $tamanho > $limite) responder(422,'nok','O campo '.$campo.' deve ter de 1 a '.$limite.' caracteres.');
    return $valor;
}
function registro(mysqli $db, int $id): array {
    $stmt=$db->prepare('SELECT id, id_linha, titulo, descricao, aba, prioridade, ativo, revisao, criado_em, atualizado_em FROM alerta WHERE id = ?');
    $stmt->bind_param('i',$id); $stmt->execute();
    $item=$stmt->get_result()->fetch_assoc();
    $stmt->close();
    if (!$item) responder(404,'nok','Alerta não encontrado. Atualize a lista.');
    return $item;
}
try {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_set_cookie_params(['httponly'=>true,'samesite'=>'Lax','secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off']);
        if (!session_start()) responder(500,'nok','Não foi possível abrir a sessão. Confira a configuração de sessões do PHP.');
    }
    if (empty($_SESSION['alertas_csrf'])) $_SESSION['alertas_csrf']=bin2hex(random_bytes(32));
    $metodo=$_SERVER['REQUEST_METHOD'];
    if (!in_array($metodo,['GET','POST','PUT','DELETE'],true)) {
        header('Allow: GET, POST, PUT, DELETE'); responder(405,'nok','Método não permitido.');
    }
    $dados=[];
    if ($metodo !== 'GET') {
        if (!hash_equals($_SESSION['alertas_csrf'],$_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) responder(403,'nok','A sessão expirou. Atualize a página e tente novamente.');
        if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) responder(415,'nok','Envie os dados em JSON.');
        $raw=file_get_contents('php://input',false,null,0,32769);
        if (strlen($raw)>32768) responder(413,'nok','Os dados excedem o tamanho permitido.');
        $obj=json_decode($raw);
        if (!is_object($obj) || json_last_error() !== JSON_ERROR_NONE) responder(400,'nok','JSON inválido.');
        $dados=(array)$obj;
    }
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    // Reutiliza exatamente a conexão já configurada no projeto, sem expor erros SQL.
    ob_start();
    try { require __DIR__.'/../conexao.php'; } finally { ob_end_clean(); }
    if (!isset($conexao) || !($conexao instanceof mysqli)) throw new RuntimeException('Conexão não disponível');
    $conexao->set_charset('utf8mb4');

    if ($metodo === 'GET') {
        $recurso=$_GET['recurso'] ?? '';
        if ($recurso === 'linhas') {
            $result=$conexao->query('SELECT id, nome FROM linha ORDER BY id');
            responder(200,'ok','Linhas consultadas.',$result->fetch_all(MYSQLI_ASSOC));
        }
        if ($recurso !== '') responder(400,'nok','Recurso inválido.');
        $result=$conexao->query('SELECT a.id, a.id_linha, a.titulo, a.descricao, a.aba, a.prioridade, a.ativo, a.revisao, a.criado_em, a.atualizado_em, l.nome AS nome_linha FROM alerta a LEFT JOIN linha l ON l.id = a.id_linha ORDER BY a.id DESC');
        responder(200,'ok','Alertas consultados.',$result->fetch_all(MYSQLI_ASSOC));
    }
    if ($metodo === 'DELETE') {
        $id=inteiro($dados['id'] ?? null,'ID');
        $revisao=inteiro($dados['revisao'] ?? null,'número de revisão');
        $stmt=$conexao->prepare('DELETE FROM alerta WHERE id = ? AND revisao = ?');
        $stmt->bind_param('ii',$id,$revisao);$stmt->execute();
        if ($stmt->affected_rows === 0) {registro($conexao,$id);responder(409,'nok','Este alerta foi alterado em outra página. Atualize a lista antes de excluir.');}
        responder(200,'ok','Alerta excluído.');
    }
    $titulo=texto($dados,'titulo',150);
    $descricao=texto($dados,'descricao',2000);
    $aba=$dados['aba'] ?? '';
    $prioridade=$dados['prioridade'] ?? '';
    if (!in_array($aba,['todos','usuarios','linhas','itinerarios','pontos','horarios'],true)) responder(422,'nok','Selecione uma aba válida.');
    if (!in_array($prioridade,['info','aviso','urgente'],true)) responder(422,'nok','Selecione uma prioridade válida.');
    $ativo=$dados['ativo'] ?? null;
    if (!in_array($ativo,[0,1],true)) responder(422,'nok','Informe o estado ativo ou inativo.');
    $linha=$dados['id_linha'] ?? null;
    if ($linha === '') $linha=null;
    if ($linha !== null) {
        if (!is_string($linha) || !preg_match('/^[A-Za-z0-9]{1,3}$/D',$linha)) responder(422,'nok','O código da linha deve ter até 3 letras ou números.');
        $stmt=$conexao->prepare('SELECT id FROM linha WHERE id = ?');
        $stmt->bind_param('s',$linha);$stmt->execute();
        if (!$stmt->get_result()->fetch_assoc()) responder(422,'nok','A linha escolhida não existe. Atualize a página e selecione outra linha.');
        $stmt->close();
    }
    if ($metodo === 'POST') {
        $stmt=$conexao->prepare('INSERT INTO alerta (id_linha, titulo, descricao, aba, prioridade, ativo) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('sssssi',$linha,$titulo,$descricao,$aba,$prioridade,$ativo);$stmt->execute();
        $id=(int)$conexao->insert_id;
        responder(201,'ok','Alerta cadastrado.',[registro($conexao,$id)]);
    }
    $id=inteiro($dados['id'] ?? null,'ID');
    $revisao=inteiro($dados['revisao'] ?? null,'número de revisão');
    $stmt=$conexao->prepare('UPDATE alerta SET id_linha = ?, titulo = ?, descricao = ?, aba = ?, prioridade = ?, ativo = ?, revisao = revisao + 1, atualizado_em = CURRENT_TIMESTAMP WHERE id = ? AND revisao = ?');
    $stmt->bind_param('sssssiii',$linha,$titulo,$descricao,$aba,$prioridade,$ativo,$id,$revisao);$stmt->execute();
    if ($stmt->affected_rows === 0) {registro($conexao,$id);responder(409,'nok','Este alerta foi alterado em outra página. Atualize a lista e abra a edição novamente.');}
    responder(200,'ok','Alerta atualizado.',[registro($conexao,$id)]);
} catch (mysqli_sql_exception $e) {
    if ((int)$e->getCode() === 1146) responder(503,'nok','Falta uma tabela do módulo. Importe sql/alertas_migracao.sql no banco busmap.');
    if ((int)$e->getCode() === 1452) responder(422,'nok','A linha vinculada não existe mais. Selecione outra linha.');
    responder(503,'nok','Não foi possível acessar o banco. Confira o MySQL e php/conexao.php.');
} catch (Throwable $e) {
    responder(500,'nok','Não foi possível iniciar as notificações. Confira o PHP, a extensão mysqli e a conexão com o banco.');
}
