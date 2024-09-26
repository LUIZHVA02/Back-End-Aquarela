
## Listar usuários
select id_usuario, nome, nome_usuario, foto_usuario, descricao, 
email, cpf, date_format(data_nascimento, "%d %m %Y") as data_nascimento, telefone, 
disponibilidade, avaliacao from tbl_usuario where usuario_status = "1";

## Listar endereços de um usuário

select tbl_usuario.id_usuario, tbl_usuario.nome, tbl_usuario.nome_usuario, 
tbl_usuario.foto_usuario, tbl_usuario.descricao, tbl_usuario.email, tbl_usuario.cpf, 
tbl_usuario.data_nascimento, tbl_usuario.telefone, tbl_usuario.disponibilidade, 
tbl_usuario.avaliacao, tbl_endereco.id_endereco, tbl_endereco.logradouro, 
tbl_endereco.numero_casa, tbl_endereco.complemento, tbl_endereco.bairro, 
tbl_endereco.estado, tbl_endereco.cidade, tbl_endereco.cep from tbl_usuario
inner join tbl_usuario_endereco on tbl_usuario.id_usuario = tbl_usuario_endereco.id_usuario
inner join tbl_endereco on tbl_usuario_endereco.id_endereco = tbl_endereco.id_endereco; 

## Listar curtidas de uma postagem 

select tbl_usuario.id_usuario, tbl_usuario.nome, tbl_postagem.id_postagem from tbl_usuario
inner join tbl_curtida_postagem on tbl_usuario.id_usuario = tbl_curtida_postagem.id_usuario
inner join tbl_postagem on tbl_curtida_postagem.id_usuario= tbl_postagem.id_postagem; 