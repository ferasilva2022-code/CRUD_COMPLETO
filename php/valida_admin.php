<?php
    // Incluído no começo dos PHPs que mexem no banco (novo, alterar, excluir).
    // Se não for admin, já responde nok e para por aqui.
    session_start();
    if(!isset($_SESSION['usuario']) || $_SESSION['usuario'][0]['tipo'] != 'admin'){
        $retorno = [
            'status'    => 'nok', // ok - nok
            'mensagem'  => 'Apenas administradores podem fazer essa ação.', // mensagem que envio para o front
            'data'      => []
        ];
        header("Content-type:application/json;charset=utf-8");
        echo json_encode($retorno);
        exit;
    }
