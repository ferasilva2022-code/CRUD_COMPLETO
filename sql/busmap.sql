CREATE DATABASE busmap; 

USE busmap; 

  

CREATE TABLE usuarios (  

    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,  

    nome VARCHAR(100) NOT NULL,  

    email VARCHAR(200) NOT NULL,  

    Senha VARCHAR(255) NOT NULL,  

    tipo VARCHAR(30) NOT NULL,  

    telefone VARCHAR(14) 

);  

CREATE TABLE linha (  

    id VARCHAR(3) PRIMARY KEY NOT NULL,  

    nome VARCHAR(100) NOT NULL,  

    forma_de_pagamento VARCHAR(50) NOT NULL,  

    status_linha VARCHAR(10) NOT NULL,  

    valor_tarifa DECIMAL(5,2) NOT NULL  

);  

CREATE TABLE ponto (  

    id INT PRIMARY KEY NOT NULL,  

    nome VARCHAR(100) NOT NULL,  

    tipo VARCHAR(30) NOT NULL,  

    latitude DECIMAL(9,6) NOT NULL,  

    longitude DECIMAL(9,6) NOT NULL  

);   

CREATE TABLE itinerario (  

    id INT PRIMARY KEY NOT NULL,  

    sentido VARCHAR(100) NOT NULL,  

    id_linha varchar(3) NOT NULL,  

    FOREIGN KEY (id_linha) REFERENCES linha(id)  

);  

CREATE TABLE itinerario_da_linha (  

    id_linha varchar(3) NOT NULL,  

    id INT NOT NULL,  

    hora TIME NOT NULL,  

    dia VARCHAR(20) NOT NULL,  

    PRIMARY KEY (id_linha, id),  

    FOREIGN KEY (id_linha) REFERENCES linha(id)  

);  

CREATE TABLE itinerario_do_ponto (  

    id_ponto INT NOT NULL,  

    ordem_percurso INT NOT NULL,  

    PRIMARY KEY (id_ponto, ordem_percurso),  

    FOREIGN KEY (id_ponto) REFERENCES ponto(id)  

);   

CREATE TABLE usuarios_linhas (  

    id_usuario INT NOT NULL,  

    id_linha VARCHAR(3) NOT NULL,  

    PRIMARY KEY (id_usuario, id_linha),  

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),  

    FOREIGN KEY (id_linha) REFERENCES linha(id)  

);  

CREATE TABLE itinerario_itinerario_linha (  

    id_itinerario INT NOT NULL,  

    id_linha VARCHAR(3) NOT NULL,  

    id_itinerario_linha INT NOT NULL,  

    PRIMARY KEY (id_itinerario, id_linha, id_itinerario_linha),  

    FOREIGN KEY (id_itinerario) REFERENCES itinerario(id),  

    FOREIGN KEY (id_linha, id_itinerario_linha) REFERENCES itinerario_da_linha(id_linha, id)  

);  

CREATE TABLE itinerario_itinerario_ponto (  

    id_itinerario INT NOT NULL,  

    id_ponto INT NOT NULL,  

    ordem_percurso INT NOT NULL,  

    PRIMARY KEY (id_itinerario, id_ponto, ordem_percurso),  

    FOREIGN KEY (id_itinerario) REFERENCES itinerario(id), 

   FOREIGN KEY (id_ponto, ordem_percurso) REFERENCES itinerario_do_ponto(id_ponto, ordem_percurso)  

);

INSERT INTO ponto (id, nome, tipo, latitude, longitude) 

VALUES 

(1, 'Praca Rui Barbosa', 'praca', -25.436257, -49.273971), 

(2, 'Praca Osorio', 'praca', -25.432960, -49.275860), 

(3, 'Praca Tiradentes', 'praca', -25.428824, -49.272316), 

(4, 'Terminal do Cabral', 'terminal', -25.406648, -49.252722), 

(5, 'Terminal do Portao', 'terminal', -25.476335, -49.292629); 

INSERT INTO linha (id,nome,forma_de_pagamento,status_linha,valor_tarifa) 

VALUES  

('030','Interbairros III', 'Somente cartão', 'Ativa', 6.00), 

('B42','Maracanã/Atuba', 'Cartão e dinheiro', 'Ativa', 6.00), 

('607','Colombo/CIC', 'Somente cartão', 'Inativa', 6.00), 

('307','Bairro Alto/ Santa Felicidade', 'Somente cartão', 'Ativa', 6.00), 

('B11','Maracanã/ Santa Cândida', 'Cartão e dinheiro', 'Ativa', 6.00); 

ALTER TABLE itinerario 

ADD COLUMN situacao VARCHAR(10) NOT NULL DEFAULT 'Ativo', 

ADD COLUMN horario_inicio TIME NOT NULL DEFAULT '00:00:00', 

ADD COLUMN horario_fim TIME NOT NULL DEFAULT '00:00:00'; 

 



-- INSERT -- 

INSERT INTO itinerario (id, sentido, id_linha, situacao, horario_inicio, horario_fim) 

VALUES 

(1, 'Centro - Bairro', '030', 'Ativo', '05:00', '23:00'), 

(2, 'Bairro - Centro', '030', 'Ativo', '05:10', '23:10'), 

(3, 'Maracanã - Atuba', 'B42', 'Ativo', '05:20', '23:20'), 

(4, 'Atuba - Maracanã', 'B42', 'Ativo', '05:30', '23:30'), 

(5, 'Bairro Alto - Sta. Felicidade', '307', 'Ativo', '06:00', '22:00'), 

(6, 'Sta. Felicidade - Bairro Alto', '307', 'Inativo', '06:10', '22:10'), 

(7, 'Maracanã - Santa Candida', 'B11', 'Ativo', '06:20', '22:20'); 



INSERT INTO usuarios(nome, email, senha, tipo, telefone)  

VALUES  

('Luis Medina','luis@gmail.com','1234','admin','(41)99999-9999'), 

 ('Fernanda Alves','fernanda@gmail.com','4321','admin','(41)98888-8888'),  

('Leonardo Vinicius','leonardo@gmail.com','6789','usuario','(41)97777-7777'), 

 ('Alice Borges','alice@gmail.com','9876','usuario','(41)96666-6666'),  

('Pietro Gasparin','pietro@gmail.com','1029','usuario','(41)95555-5555'); 

INSERT INTO itinerario (id, sentido, id_linha) 

VALUES 

(101, 'Ida', '030'), 

(102, 'Volta', '030'), 

(103, 'Ida', 'B42'), 

(104, 'Volta', 'B42'), 

(105, 'Ida', '307'), 

(106, 'Volta', '307'), 

(107, 'Ida', 'B11');   

INSERT INTO itinerario_da_linha (id_linha, id, hora, dia) 

VALUES 

('030', 101, '06:00:00', 'Dia útil'), 

('030', 102, '07:00:00', 'Dia útil'), 

('030', 103, '08:00:00', 'Dia útil'), 

('030', 104, '09:00:00', 'Dia útil'), 

('030', 105, '10:00:00', 'Dia útil'), 

('030', 106, '11:00:00', 'Dia útil'), 

('030', 107, '12:00:00', 'Sábado'); 

