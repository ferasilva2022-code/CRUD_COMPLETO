<?php
include_once ('../valida_admin.php'); // só admin pode alterar
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
        // affected_rows = 0 acontece quando os dados são iguais aos do banco
        // OU quando o id não existe; o SELECT separa os dois casos
        $busca = $conexao->prepare("SELECT id FROM linha WHERE id = ?");
        $busca->bind_param('s',$_GET['id']);
        $busca->execute();
        if($busca->get_result()->num_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Nenhuma alteração feita: os dados já estavam iguais.',
                'data'      => []
            ];
        }else{
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Linha não encontrada.',
                'data'      => []
            ];
        }
        $busca->close();
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