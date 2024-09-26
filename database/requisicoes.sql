select tbl_usuario.id_usuario, tbl_usuario.nome, tbl_usuario.nome_usuario, 
tbl_usuario.foto_usuario, tbl_usuario.descricao, tbl_usuario.email, tbl_usuario.cpf, 
tbl_usuario.data_nascimento, tbl_usuario.telefone, tbl_usuario.disponibilidade, 
tbl_usuario.avaliacao, tbl_endereco.id_endereco, tbl_endereco.logradouro, 
tbl_endereco.numero_casa, tbl_endereco.complemento, tbl_endereco.bairro, 
tbl_endereco.estado, tbl_endereco.cidade, tbl_endereco.cep from tbl_usuario
inner join tbl_usuario_endereco on tbl_usuario.id_usuario = tbl_usuario_endereco.id_usuario
inner join tbl_endereco on tbl_usuario_endereco.id_endereco = tbl_endereco.id_endereco; 