<?php 
include_once ('../conexao.php');
$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
    ];

if (isset($_GET['id'])){
    $nome = $_POST['nome'];
    $forma_de_pagamento = $_POST['forma_de_pagamento'];
    $status_linha = $_POST['status_linha'];
    $valor_tarifa = $_POST['valor_tarifa'];

    $stmt = $conexao->prepare("UPDATE linha SET nome = ?,forma_de_pagamento = ?, status_linha = ?, valor_tarifa = ? WHERE id = ?");
    $stmt ->bind_param('sssds',$nome,$forma_de_pagamento,$status_linha,$valor_tarifa,$_GET['id']);
    $stmt -> execute();

    if($stmt->affected_rows>0){
        $retorno=[
            'status' => 'ok',
            'mensagem' => 'Linha alterada com sucesso',
            'data' => []
        ];
    } else{
        $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Não foi possível alterar o registro.'.json_encode($_GET),
                'data'      => []
            ];
    }
    $stmt-> close();
}else{
     $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não foi possível alterar o registro sem um ID informado.',
            'data'      => []
        ];
}
$conexao->close();

header('Content-type: application/json;charset=utf-8');
echo json_encode($retorno);
?>