<?php 
include_once ('../conexao.php');
$retorno =[
    'status' => '',
    'mensagem' =>'',
    'data' => []
    ];

    if(!empty($_GET['id'])){
    $stmt = $conexao->prepare("SELECT * FROM linha WHERE id = ? ");
    $stmt->bind_param("s",$_GET['id']);
}else{
    $stmt = $conexao->prepare("SELECT * FROM linha ");
}
$stmt -> execute();
$resultado = $stmt->get_result();

$tabela =[];
if($resultado->num_rows>0){
    while($linha = $resultado -> fetch_assoc()){
        $tabela[]=$linha;
    }
    
    $retorno =[
        'status' => 'ok',
        'mensagem' => 'Consulta realizada com sucesso!',
        'data' => $tabela
    ];
}else{
    $retorno =[
        'status' => 'nok',
        'mensagem' => 'Não existe registros',
        'data' => []
    ];
}
$stmt ->close();
$conexao->close();

header('Content-type:application/json;charset=utf-8');
echo json_encode($retorno);
?>