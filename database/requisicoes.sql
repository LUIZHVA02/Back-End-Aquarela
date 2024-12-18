
## Listar usuários
select id_usuario, nome, nome_usuario, foto_usuario, descricao, 
email, cpf, date_format(data_nascimento, "%d %m %Y") as data_nascimento, telefone, 
disponibilidade, avaliacao from tbl_usuario where usuario_status = "1";

## Listar endereços de um usuário

select tbl_usuario.id_usuario, tbl_usuario.nome, tbl_usuario.nome_usuario, tbl_usuario.email, 
tbl_endereco.id_endereco, tbl_endereco.logradouro, tbl_endereco.numero_casa, tbl_endereco.complemento, 
tbl_endereco.bairro, tbl_endereco.estado, tbl_endereco.cidade, tbl_endereco.cep from tbl_usuario
inner join tbl_usuario_endereco on tbl_usuario.id_usuario = tbl_usuario_endereco.id_usuario
inner join tbl_endereco on tbl_usuario_endereco.id_endereco = tbl_endereco.id_endereco 
where tbl_usuario.usuario_status = 1 and tbl_usuario.id_usuario = 5;

## Listar curtidas de uma postagem 

select tbl_usuario.id_usuario, tbl_usuario.nome, tbl_postagem.id_postagem from tbl_usuario
inner join tbl_curtida_postagem on tbl_usuario.id_usuario = tbl_curtida_postagem.id_usuario
inner join tbl_postagem on tbl_curtida_postagem.id_usuario= tbl_postagem.id_postagem; 


# Feed

DELIMITER $$
CREATE PROCEDURE GetGerarFeed(IN userId INT)
BEGIN
    SELECT * FROM (
        SELECT 
            'produto' AS tipo,
            p.id_produto AS id,
            p.nome,
            p.descricao,
            p.id_usuario,
            p.preco,
            p.marca_dagua,
            p.item_digital,
            p.quantidade,
            GROUP_CONCAT(DISTINCT c.categoria) AS categorias,
            COUNT(DISTINCT c.id_categoria) AS num_categorias
        FROM 
            tbl_produto p
        INNER JOIN 
            tbl_categoria_produto cp ON p.id_produto = cp.id_produto
        INNER JOIN 
            tbl_categoria c ON cp.id_categoria = c.id_categoria
        INNER JOIN 
            tbl_preferencia pr ON c.id_categoria = pr.id_categoria
        WHERE 
            pr.id_usuario = userId  
            AND p.produto_status = TRUE  
        GROUP BY 
            p.id_produto, p.nome, p.descricao, p.id_usuario, p.preco, p.marca_dagua, p.item_digital, p.quantidade  

        UNION ALL

        SELECT 
            'postagem' AS tipo,
            po.id_postagem AS id,
            po.nome,
            po.descricao,
            po.id_usuario,
            NULL AS preco,
            NULL AS marca_dagua,
            NULL AS item_digital,
            NULL AS quantidade,
            GROUP_CONCAT(DISTINCT c.categoria) AS categorias,
            COUNT(DISTINCT c.id_categoria) AS num_categorias
        FROM 
            tbl_postagem po
        INNER JOIN 
            tbl_categoria_postagem cp ON po.id_postagem = cp.id_postagem
        INNER JOIN 
            tbl_categoria c ON cp.id_categoria = c.id_categoria
        INNER JOIN 
            tbl_preferencia pr ON c.id_categoria = pr.id_categoria
        WHERE 
            pr.id_usuario = userId  
            AND po.postagem_status = TRUE  
        GROUP BY 
            po.id_postagem, po.nome, po.descricao, po.id_usuario  

        UNION ALL
        
        SELECT 
            'produto' AS tipo,
            p.id_produto AS id,
            p.nome,
            p.descricao,
            p.id_usuario,
            p.preco,
            p.marca_dagua,
            p.item_digital,
            p.quantidade,
            GROUP_CONCAT(DISTINCT c.categoria) AS categorias,
            0 AS num_categorias
        FROM 
            tbl_produto p
        LEFT JOIN 
            tbl_categoria_produto cp ON p.id_produto = cp.id_produto
        LEFT JOIN 
            tbl_categoria c ON cp.id_categoria = c.id_categoria
        WHERE 
            p.produto_status = TRUE  
            AND p.id_produto NOT IN (
                SELECT cp2.id_produto 
                FROM tbl_categoria_produto cp2
                INNER JOIN tbl_categoria c2 ON cp2.id_categoria = c2.id_categoria
                INNER JOIN tbl_preferencia pr2 ON c2.id_categoria = pr2.id_categoria
                WHERE pr2.id_usuario = userId
            )
        GROUP BY 
            p.id_produto, p.nome, p.descricao, p.id_usuario, p.preco, p.marca_dagua, p.item_digital, p.quantidade  

        UNION ALL

        SELECT 
            'postagem' AS tipo,
            po.id_postagem AS id,
            po.nome,
            po.descricao,
            po.id_usuario,
            NULL AS preco,
            NULL AS marca_dagua,
            NULL AS item_digital,
            NULL AS quantidade,
            GROUP_CONCAT(DISTINCT c.categoria) AS categorias,
            0 AS num_categorias  -- Não conta categorias
        FROM 
            tbl_postagem po
        LEFT JOIN 
            tbl_categoria_postagem cp ON po.id_postagem = cp.id_postagem
        LEFT JOIN 
            tbl_categoria c ON cp.id_categoria = c.id_categoria
        WHERE 
            po.postagem_status = TRUE  
            AND po.id_postagem NOT IN (
                SELECT cp3.id_postagem 
                FROM tbl_categoria_postagem cp3
                INNER JOIN tbl_categoria c3 ON cp3.id_categoria = c3.id_categoria
                INNER JOIN tbl_preferencia pr3 ON c3.id_categoria = pr3.id_categoria
                WHERE pr3.id_usuario = userId
            )
        GROUP BY 
            po.id_postagem, po.nome, po.descricao, po.id_usuario  
    ) AS resultado
    ORDER BY 
        num_categorias DESC,  
        RAND();  
END $$
DELIMITER ;

select * from tbl_usuario;
select * from tbl_preferencia where id_usuario = 12;
select * from tbl_produto left join tbl_categoria_produto on tbl_produto.id_produto=tbl_categoria_produto.id_produto left join tbl_categoria on tbl_categoria.id_categoria=tbl_categoria_produto.id_categoria;
select * from tbl_categoria;

insert into tbl_categoria_produto (id_produto, id_categoria, categoria_produto_status) values 
(4,133,true),
(4,141,true),
(4,208,true),
(4,209,true),
(4,220,true),
(4,224,true),
(4,225,true);

insert into tbl_preferencia (id_usuario, id_categoria, preferencia_status) values 
(12, 149,true),
(12, 179,true),
(12, 133,true),
(12,133,true),
(12,141,true),
(12,208,true),
(12,209,true),
(12,220,true),
(12,224,true),
(12,225,true);


call GetGerarFeed(12);


# Listar postagem e produto

SELECT 
    p.id_produto, 
    p.nome, 
    po.id_postagem, 
    po.nome,
    p.id_usuario
FROM 
    tbl_produto p
JOIN 
    tbl_postagem po 
ON 
    p.id_usuario = po.id_usuario;

select * from tbl_usuario;
select * from tbl_seguidores;
select * from tbl_endereco;
select * from tbl_usuario_endereco;
select * from tbl_postagem;
select * from tbl_produto;
select * from tbl_categoria;
select * from tbl_categoria_produto;
select * from tbl_categoria_postagem;
select * from tbl_preferencia;
select * from tbl_comentario;
select * from tbl_comentario_produto;
select * from tbl_comentario_postagem;
select * from tbl_produto_favorito;
select * from tbl_postagem_favorita;
select * from tbl_curtida_postagem;
select * from tbl_curtida_produto;
select * from tbl_visualizacao_produto;
select * from tbl_visualizacao_postagem;
select * from tbl_imagem;
select * from tbl_imagem_produto;
select * from tbl_imagem_postagem;
select * from tbl_pasta;
select * from tbl_pasta_postagem;
select * from tbl_pasta_produto;
select * from tbl_carrinho_compra;
select * from tbl_item_carrinho;
select * from tbl_pedido;
select * from tbl_item_pedido;
select * from tbl_conversa;
select * from tbl_mensagem;
select * from tbl_tipo_perfil;
select * from tbl_tipo_perfil_usuario;

select 	tbl_usuario.id_usuario, tbl_usuario.nome, tbl_usuario.nome_usuario, 
		tbl_usuario.foto_usuario, tbl_carrinho_compra.id_carrinho_compra 
        from tbl_usuario inner join tbl_carrinho_compra on 
        tbl_carrinho_compra.id_usuario = tbl_usuario.id_usuario
        inner join tbl_item_carrinho on tbl_item_carrinho.id_carrinho_compra 
        = tbl_carrinho_compra.id_carrinho_compra;

select id_usuario, nome, nome_usuario, foto_usuario, descricao, 
        email, cpf, date_format(data_nascimento, "%d-%m-%Y") as data_nascimento, telefone, 
        disponibilidade, avaliacao from tbl_usuario where nome_usuario = 'matheus' and senha = md5('1533');
        
select tbl_preferencia.id_usuario, tbl_usuario.nome, tbl_usuario.nome_usuario, 
tbl_preferencia.id_categoria, tbl_categoria.categoria from tbl_categoria
inner join tbl_preferencia on tbl_preferencia.id_categoria = tbl_categoria.id_categoria 
inner join tbl_usuario on tbl_usuario.id_usuario = tbl_preferencia.id_usuario 
where preferencia_status = "1" order by tbl_usuario.id_usuario;

select * from tbl_banco;
select * from tbl_conta;
select * from tbl_conta_usuario;

select tbl_usuario.id_usuario, tbl_usuario.nome, 
                    tbl_usuario.nome_usuario, tbl_usuario.email, 
                    tbl_carrinho_compra.id_carrinho_compra 
                    from tbl_carrinho_compra inner join 
                    tbl_usuario on tbl_usuario.id_usuario = 
                    tbl_carrinho_compra.id_usuario where 
                    carrinho_compra_status = 1;
                    
select cast(last_insert_id() as DECIMAL) as id from tbl_usuario limit 1;