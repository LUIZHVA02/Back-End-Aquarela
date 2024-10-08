create database db_aquarela;

use db_aquarela;

## Usuário

create table tbl_usuario( 
	id_usuario integer not null primary key auto_increment,
    nome varchar(150) not null,
    nome_usuario varchar(150) not null,
    foto_usuario varchar(300),
    descricao varchar(300),
	email varchar(50) not null,
    senha varchar(50) not null,
	cpf varchar(11) not null,
    data_nascimento date not null,
	telefone varchar(11) not null,
    disponibilidade boolean not null,
    avaliacao float,
    usuario_status boolean not null 
);

## Seguidores

create table tbl_seguidores ( 
	id_seguidores integer not null primary key auto_increment,
    id_seguidor integer not null,
    id_seguindo integer not null,
    seguidores_status boolean not null,
    foreign key (id_seguidor) references tbl_usuario(id_usuario),
    foreign key (id_seguindo) references tbl_usuario(id_usuario),
    unique (id_seguidor, id_seguindo)
);

## Endereço

create table tbl_endereco( 
	id_endereco integer not null primary key auto_increment,
    logradouro varchar(150) not null,
    numero_casa integer not null,
    complemento varchar(150),
	bairro varchar(150) not null,
    estado varchar(20) not null,
    cidade varchar(100) not null,
    cep varchar(9),
    endereco_status boolean not null
);

create table tbl_usuario_endereco( 
	id_usuario_endereco integer not null primary key auto_increment,
    id_endereco integer not null,
    id_usuario integer not null,
    usuario_endereco_status boolean not null,
    foreign key (id_endereco) references tbl_endereco (id_endereco),
    foreign key (id_usuario) references tbl_usuario (id_usuario)
);

## Postagens

create table tbl_postagem ( 
	id_postagem integer not null primary key auto_increment,
    nome varchar(100) not null,
    descricao varchar(500),
    id_usuario integer not null,
	postagem_status boolean not null,
    foreign key (id_usuario) references tbl_usuario (id_usuario)
);

create table tbl_produto( 
	id_produto integer not null primary key auto_increment,
    nome varchar(100) not null,
    descricao varchar(500) not null,
    marca_dagua boolean not null,
    item_digital boolean not null,
    preco float not null,
    quantidade integer not null,
	id_usuario integer not null,
    produto_status boolean not null,
	foreign key (id_usuario) references tbl_usuario (id_usuario)
);

## Categorias

create table tbl_categoria( 
	id_categoria integer not null primary key auto_increment,
    categoria varchar(255),
    categoria_status boolean not null
);
SELECT *, COUNT(*) from tbl_categoria 
GROUP BY categoria
HAVING COUNT(*) > 1;

create table tbl_categoria_produto (
    id_categoria_produto int not null primary key auto_increment,
    id_produto integer not null,
    id_categoria integer not null,
    categoria_produto_status boolean not null,
    foreign key (id_produto) references tbl_produto(id_produto),
    foreign key (id_categoria) references tbl_categoria(id_categoria)
);

create table tbl_categoria_postagem (
    id_categoria_postagem integer not null primary key auto_increment,
    id_postagem integer not null,
    id_categoria integer not null,
    categoria_postagem_status boolean not null,
    foreign key (id_postagem) references tbl_postagem(id_postagem),
    foreign key (id_categoria) references tbl_categoria(id_categoria)
);

## Preferências

create table tbl_preferencia ( 
	id_preferencia integer not null primary key auto_increment,
    id_usuario integer not null,
    id_categoria integer not null,
    preferencia_status boolean not null,
    foreign key (id_usuario) references tbl_usuario(id_usuario),
    foreign key (id_categoria) references tbl_categoria(id_categoria)
);

## Comentarios

create table tbl_comentario ( 
	id_comentario integer not null primary key auto_increment,
    mensagem varchar(255),
	id_usuario integer not null,
    id_resposta integer,
    comentario_status boolean not null,
	foreign key (id_usuario) references tbl_usuario (id_usuario),
	foreign key (id_resposta) references tbl_comentario (id_comentario)
);

create table tbl_comentario_produto ( 
	id_comentario_produto integer not null primary key auto_increment,
    id_produto integer not null,
    id_comentario integer not null,
    comentario_produto_status boolean not null,
    foreign key (id_produto) references tbl_produto (id_produto),
    foreign key (id_comentario) references tbl_comentario (id_comentario)
);

create table tbl_comentario_postagem ( 
	id_comentario_postagem integer not null primary key auto_increment,
    id_postagem integer not null,
    id_comentario integer not null,
    comentario_postagem_status boolean not null,
    foreign key (id_postagem) references tbl_postagem (id_postagem),
    foreign key (id_comentario) references tbl_comentario (id_comentario)
);

## Favoritos

create table tbl_produto_favorito ( 
	id_produto_favorito integer not null primary key auto_increment,
    id_produto integer not null,    
    id_usuario integer not null,
    produto_favorito_status boolean not null,
    foreign key (id_produto) references tbl_produto (id_produto),
    foreign key (id_usuario) references tbl_usuario (id_usuario)
);

create table tbl_postagem_favorita ( 
	id_postagem_favorita integer not null primary key auto_increment,
    id_postagem integer not null,
    id_usuario integer not null,
    postagem_favorita_status boolean not null,
    foreign key (id_postagem) references tbl_postagem (id_postagem),
    foreign key (id_usuario) references tbl_usuario (id_usuario)
);

## Curtidas

create table tbl_curtida_postagem (
    id_curtidas_postagem integer not null primary key auto_increment,
    id_postagem integer not null,
    id_usuario integer not null,
    curtidas_postagem_status boolean not null,
    foreign key (id_postagem) references tbl_postagem(id_postagem),
    foreign key (id_usuario) references tbl_usuario(id_usuario)
);

create table tbl_curtida_produto (
    id_curtidas_produto integer not null primary key auto_increment,
    id_produto integer not null,
    id_usuario integer not null,
    curtidas_produto_status boolean not null,
    foreign key (id_produto) references tbl_produto(id_produto),
    foreign key (id_usuario) references tbl_usuario(id_usuario)
);

## Visualizações

create table tbl_visualizacao_produto (
    id_visualizacao_produto integer not null primary key auto_increment,
    id_produto integer not null,
    id_usuario integer not null,
    visualizacao_produto_status boolean not null,
    foreign key (id_produto) references tbl_produto(id_produto),
    foreign key (id_usuario) references tbl_usuario(id_usuario)
);

create table tbl_visualizacao_postagem (
    id_visualizacao_postagem integer not null primary key auto_increment,
    id_postagem integer not null,
    id_usuario integer not null,
    visualizacao_postagem_status boolean not null,
    foreign key (id_postagem) references tbl_postagem(id_postagem),
    foreign key (id_usuario) references tbl_usuario(id_usuario)
);

## Imagens

create table tbl_imagem ( 
	id_imagem integer not null primary key auto_increment,
    url varchar(255) not null,
    imagem_status boolean not null
);

create table tbl_imagem_produto ( 
	id_imagem_produto integer not null primary key auto_increment,
	id_imagem integer not null,
    id_produto integer not null,
    imagem_produto_status boolean not null,
    foreign key (id_imagem) references tbl_imagem(id_imagem),
    foreign key (id_produto) references tbl_produto(id_produto)
);

create table tbl_imagem_postagem (
    id_imagem_postagem integer not null primary key auto_increment,
    id_imagem integer not null,
    id_postagem integer not null,
    imagem_postagem_status boolean not null,
    foreign key (id_imagem) references tbl_imagem(id_imagem),
    foreign key (id_postagem) references tbl_postagem(id_postagem)
);

## Pastas

create table tbl_pasta ( 
	id_pasta integer not null primary key auto_increment,
    nome varchar(100),
	id_usuario integer not null,
    pasta_status boolean not null,
	foreign key (id_usuario) references tbl_usuario(id_usuario)
);

create table tbl_pasta_postagem ( 
	id_pasta_postagem integer not null primary key auto_increment,
	id_postagem integer not null,
	id_pasta integer not null,
    pasta_postagem_status boolean not null,
    foreign key (id_postagem) references tbl_postagem(id_postagem),
    foreign key (id_pasta) references tbl_pasta(id_pasta)
);

create table tbl_pasta_produto (
    id_pasta_produto integer not null primary key auto_increment,
    id_produto integer not null,
    id_pasta integer not null,
    pasta_produto_status boolean not null,
    foreign key (id_produto) references tbl_produto(id_produto),
    foreign key (id_pasta) references tbl_pasta(id_pasta)
);

## Carrinho de compras

create table tbl_carrinho_compra( 
	id_carrinho_compra integer not null primary key auto_increment,
	id_usuario integer not null,
    carrinho_compra_status boolean not null,
	foreign key (id_usuario) references tbl_usuario(id_usuario)
);

create table tbl_item_carrinho( 
	id_item_carrinho integer not null primary key auto_increment,
    quantidade integer not null,
    id_produto integer not null,
    id_carrinho_compra integer not null,
    item_carrinho_status boolean not null,
    foreign key (id_produto) references tbl_produto(id_produto),
    foreign key (id_carrinho_compra) references tbl_carrinho_compra(id_carrinho_compra)
);

## Compra

create table tbl_pedido(
	id_pedido integer not null primary key auto_increment,
    preco_total float not null,
    data_pedido datetime not null,
    id_usuario_endereco integer not null,
    codigo_entrega varchar(255),
    pedido_status boolean not null,
	foreign key (id_usuario_endereco) references tbl_usuario_endereco(id_usuario_endereco)
);

create table tbl_item_pedido(
	id_item_pedido integer not null primary key auto_increment,
	quantidade integer not null,
    id_pedido integer not null,
    id_produto integer not null,
    item_pedido_status boolean not null,
    foreign key (id_pedido) references tbl_pedido(id_pedido),
    foreign key (id_produto) references tbl_produto(id_produto)
);

## Conversa

create table tbl_conversa(
	id_conversa integer not null primary key auto_increment,
    id_usuario_1 integer not null,
    id_usuario_2 integer not null,
    conversa_status boolean not null,
    foreign key (id_usuario_1) references tbl_usuario(id_usuario),
    foreign key (id_usuario_2) references tbl_usuario(id_usuario)
);

create table tbl_mensagem (
	id_mensagem integer not null primary key auto_increment,
    mensagem text not null,
    id_usuario integer not null,
    id_conversa integer not null,
    mensagem_status boolean not null,
    foreign key (id_usuario) references tbl_usuario(id_usuario),
    foreign key (id_conversa) references tbl_conversa(id_conversa)
);

create table tbl_tipo_perfil (
id_tipo_perfil integer not null primary key auto_increment,
    nome varchar(50) not null,
tipo_perfil_status boolean not null
);

create table tbl_tipo_perfil_usuario (
id_tipo_perfil_usuario integer not null primary key auto_increment,
    id_tipo_perfil integer not null,
    id_usuario integer not null,
tipo_perfil_usuario_status boolean not null,
    foreign key (id_usuario) references tbl_usuario(id_usuario),
    foreign key (id_tipo_perfil) references tbl_tipo_perfil(id_tipo_perfil)
);
select * from tbl_categoria;
    
