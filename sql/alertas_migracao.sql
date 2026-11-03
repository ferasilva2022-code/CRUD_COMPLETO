-- Banco existente: execute somente este arquivo. Não exclui registros.
-- Instalação nova: busmap.sql já inclui esta tabela ao final.
USE busmap;
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS alerta (
    id INT NOT NULL AUTO_INCREMENT,
    id_linha VARCHAR(3) NULL,
    titulo VARCHAR(150) CHARACTER SET utf8mb4 NOT NULL,
    descricao TEXT CHARACTER SET utf8mb4 NOT NULL,
    aba ENUM('todos','usuarios','linhas','itinerarios','pontos','horarios') NOT NULL DEFAULT 'todos',
    prioridade ENUM('info','aviso','urgente') NOT NULL DEFAULT 'info',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    revisao INT NOT NULL DEFAULT 1,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_alerta_aba_ativo (aba, ativo),
    CONSTRAINT fk_alerta_linha FOREIGN KEY (id_linha) REFERENCES linha(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;
