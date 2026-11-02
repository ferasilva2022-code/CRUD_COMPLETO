<?php
    session_start();
    if(isset($_SESSION['usuario'])){
        $retorno = [
            'status'    => 'ok', // ok - nok
            'mensagem'  => '', // mensagem que envio para o front
            // só nome e tipo, para o front saber se é admin (a senha não vai)
            'data'      => [
                'nome' => $_SESSION['usuario'][0]['nome'],
                'tipo' => $_SESSION['usuario'][0]['tipo']
            ]
        ];
    }else{
        $retorno = [
            'status'    => 'nok', // ok - nok
            'mensagem'  => '', // mensagem que envio para o front
            'data'      => []
        ];
    }
    header("Content-type:application/json;charset=utf-8");
    echo json_encode($retorno);
