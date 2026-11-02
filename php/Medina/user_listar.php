<?php
include_once ('../conexao.php');
$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

// sem SELECT *: a senha não vai pro front
$stmt = $conexao->prepare("SELECT id, nome, email, tipo, telefone FROM usuarios");
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
while($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}
$retorno = [
    'status' => 'ok', 
    'mensagem' => 'Consulta realizada com sucesso!', 
    'data' => $tabela
];

$stmt->close();
$conexao->close();

header('Content-type:application/json;charset=utf-8');
echo json_encode($retorno);
?>
