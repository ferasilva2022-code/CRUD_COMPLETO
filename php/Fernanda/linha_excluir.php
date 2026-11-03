<?php
include_once ('../conexao.php');
$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
    ];

if (isset($_GET['id'])){
    $stmt = $conexao->prepare("DELETE FROM linha WHERE id = ?");
    $stmt ->bind_param('s',$_GET['id']);
    $stmt -> execute();

    if($stmt->affected_rows>0){
        $retorno=[
            'status' => 'ok',
            'mensagem' => 'Linha excluída com sucesso',
            'data' => []
        ];
    } else{
        $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Não foi possível excluir o registro.',
                'data'      => []
            ];
    }
    $stmt-> close();
}else{
     $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não foi possível excluir o registro sem um ID informado.',
            'data'      => []
        ];
}
$conexao->close();

header('Content-type: application/json;charset=utf-8');
echo json_encode($retorno);
?>
