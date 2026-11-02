<?php
include_once ('../conexao.php');
$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

$termo = '%' . $_GET['termo'] . '%';

$stmt = $conexao->prepare("SELECT id, nome, email, tipo, telefone FROM usuarios WHERE nome LIKE ? OR email LIKE ?");
$stmt->bind_param('ss', $termo, $termo);
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
while($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}
$retorno = [
    'status' => 'ok', 
    'mensagem' => 'Busca realizada com sucesso!', 
    'data' => $tabela
];

$stmt->close();
$conexao->close();

header('Content-type:application/json;charset=utf-8');
echo json_encode($retorno);
?>
