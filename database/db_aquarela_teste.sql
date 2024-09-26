create database db_aquarela_teste;

use db_aquarela_teste;

create table tbl_usuario( 
	id_usuario int not null primary key auto_increment,
    nome varchar(150) not null,
    nome_usuario varchar(150) not null,
    foto_usuario varchar(300),
    descricao varchar(300),
	email varchar(50) not null,
    senha varchar(32) not null,
	cpf varchar(11) not null,
    data_nascimento date not null,
	telefone varchar(11) not null,
    disponibilidade boolean not null,
    usuario_status boolean not null 
);

create table tbl_endereco( 
	id_endereco int not null primary key auto_increment,
    logradouro varchar(150) not null,
    numero_casa int not null,
    complemento varchar(150),
	bairro varchar(150) not null,
    estado varchar(20) not null,
    cidade varchar(100) not null,
    cep varchar(9),
<<<<<<< HEAD:database/db_aquarela_script.sql
    adress_status boolean not null
=======
    endereco_status boolean not null
>>>>>>> aa18a5a3c91930d48a946908c8fcee3e48093aaa:database/db_aquarela_teste.sql
    );

create table tbl_usuario_endereco( 
	id_usuario_endereco int not null primary key auto_increment,
    id_endereco int not null,
    id_usuario int not null,
    address_status boolean not null,
    foreign key (id_endereco) references tbl_endereco (id_endereco),
    foreign key (id_usuario) references tbl_usuario (id_usuario)
    );
    
select * from tbl_usuario where id_usuario = 5;

desc tbl_usuario;
    