<?php 
include_once ('../conexao.php');
$retorno =[
    'status' => '',
    'mensagem' => '',
    'data' => []
];
$dados= json_decode(file_get_contents('php://input'),true);

$id= $dados["idLinha"];
$nome=$dados['nomeLinha'];
$forma_pagamento=$dados['formaPagamento'];
$valor_tarifa= $dados['valorTarifa'];
$status_linha=isset($dados['statusLinha']) ? 'Ativa' : 'Inativa';

$stmt = $conexao->prepare("INSERT INTO linha (id,nome,forma_de_pagamento,status_linha,valor_tarifa) VALUES (?,?,?,?,?)");
$stmt->bind_param('ssssd',$id,$nome,$forma_pagamento,$status_linha,$valor_tarifa);
$stmt->execute();

if($stmt->affected_rows > 0){
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Linha inserida com sucesso',
            'data' => []
        ];
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Falha ao inserir a linha',
            'data' => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset=utf-8");
    echo json_encode($retorno);

?>