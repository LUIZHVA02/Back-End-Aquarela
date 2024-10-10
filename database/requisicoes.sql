
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

# Listar Produtos e Postagem
use db_aquarela;

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
