create database db_aquarela;
use db_aquarela;
create table usuario(
	id_usuario int not null primary key auto_increment,
    nome varchar(150) not null,
    nome_usuario varchar(150) not null,
    foto_usuario varchar(300),
    descricao varchar(300),
	email varchar(50) not null,
    senha varchar(16) not null,
	cpf varchar(11) not null,
    data_nascimento date not null,
	telefone varchar(11) not null,
    disponibilidade boolean not null
    );
create table endereco(
	id_endereco int not null primary key auto_increment,
    logradouro varchar(150) not null,
    numero_casa int not null,
    complemento varchar(150),
	bairro varchar(150) not null,
    estado varchar(20) not null,
    cidade varchar(100) not null,
    cep varchar(9)
    );
create table usuario_endereco(
	id_usuario_endereco int not null primary key auto_increment,
    id_endereco int not null,
    id_usuario int not null,
    foreign key (id_endereco) references endereco (id_endereco),
    foreign key (id_usuario) references usuario (id_usuario)
    );
    