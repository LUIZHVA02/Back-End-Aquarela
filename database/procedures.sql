-- Procedures

-- Adicionar pasta

DELIMITER $$

CREATE PROCEDURE procAdicionarPostagemPasta(
    IN p_id_postagem INT,
    IN p_id_pasta INT
)
BEGIN
    DECLARE v_pasta_postagem_status TINYINT;

    SELECT pasta_postagem_status
    INTO v_pasta_postagem_status
    FROM tbl_pasta_postagem
    WHERE id_postagem = p_id_postagem AND id_pasta = p_id_pasta;

    IF v_pasta_postagem_status IS NOT NULL THEN
        UPDATE tbl_pasta_postagem
        SET pasta_postagem_status = NOT v_pasta_postagem_status
        WHERE id_postagem = p_id_postagem AND id_pasta = p_id_pasta;
    ELSE
        INSERT INTO tbl_pasta_postagem (id_postagem, id_pasta, pasta_postagem_status)
        VALUES (p_id_postagem, p_id_pasta, 1);
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE procAdicionarProdutoPasta(
    IN p_id_produto INTEGER,
    IN p_id_pasta INTEGER
)
BEGIN
    DECLARE v_pasta_produto_status TINYINT;

    SELECT pasta_produto_status
    INTO v_pasta_produto_status
    FROM tbl_pasta_produto
    WHERE id_produto = p_id_produto AND id_pasta = p_id_pasta;

    IF v_pasta_produto_status IS NOT NULL THEN
        UPDATE tbl_pasta_produto
        SET pasta_produto_status = NOT v_pasta_produto_status
        WHERE id_produto = p_id_produto AND id_pasta = p_id_pasta;
    ELSE
        INSERT INTO tbl_pasta_produto (id_produto, id_pasta, pasta_produto_status)
        VALUES (p_id_produto, p_id_pasta, 1);
    END IF;
END $$

DELIMITER ;

-- Remover pasta

DELIMITER $$

CREATE PROCEDURE procRemoverPostagemPasta(
    IN p_id_postagem INTEGER,
    IN p_id_pasta INTEGER
)
BEGIN
    DELETE FROM tbl_pasta_postagem
    WHERE id_postagem = p_id_postagem AND id_pasta = p_id_pasta;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE procRemoverProdutoPasta(
    IN p_id_produto INTEGER,
    IN p_id_pasta INTEGER
)
BEGIN
    DECLARE associacao_existente INT;

    SELECT COUNT(*) INTO associacao_existente
    FROM tbl_pasta_produto
    WHERE id_produto = p_id_produto AND id_pasta = p_id_pasta;

    DELETE FROM tbl_pasta_produto
    WHERE id_produto = p_id_produto AND id_pasta = p_id_pasta;
END $$

DELIMITER ;

-- Curtir

DELIMITER $$

CREATE PROCEDURE procCurtirPostagem(
    IN p_id_postagem INT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_curtidas_postagem_status TINYINT;
    
    SELECT curtidas_postagem_status
    INTO v_curtidas_postagem_status
    FROM tbl_curtida_postagem
    WHERE id_postagem = p_id_postagem AND id_usuario = p_id_usuario;

    IF v_curtidas_postagem_status IS NOT NULL THEN
        UPDATE tbl_curtida_postagem
        SET curtidas_postagem_status = NOT v_curtidas_postagem_status
        WHERE id_postagem = p_id_postagem AND id_usuario = p_id_usuario;
    ELSE
        INSERT INTO tbl_curtida_postagem (id_postagem, id_usuario, curtidas_postagem_status)
        VALUES (p_id_postagem, p_id_usuario, 1);
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE procCurtirProduto(
    IN p_id_produto INT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_curtidas_produto_status TINYINT;
    
    SELECT curtidas_produto_status
    INTO v_curtidas_produto_status
    FROM tbl_curtida_produto
    WHERE id_produto = p_id_produto AND id_usuario = p_id_usuario;

    IF v_curtidas_produto_status IS NOT NULL THEN
        UPDATE tbl_curtida_produto
        SET curtidas_produto_status = NOT v_curtidas_produto_status
        WHERE id_produto = p_id_produto AND id_usuario = p_id_usuario;
    ELSE
        INSERT INTO tbl_curtida_produto (id_produto, id_usuario, curtidas_produto_status)
        VALUES (p_id_produto, p_id_usuario, 1);
    END IF;
END $$

DELIMITER ;

-- Favoritar

DELIMITER $$

CREATE PROCEDURE procFavoritarPostagem(
    IN p_id_postagem INT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_postagem_favorita_status TINYINT;
    
    SELECT postagem_favorita_status
    INTO v_postagem_favorita_status
    FROM tbl_postagem_favorita
    WHERE id_postagem = p_id_postagem AND id_usuario = p_id_usuario;

    IF v_postagem_favorita_status IS NOT NULL THEN
        UPDATE tbl_postagem_favorita
        SET postagem_favorita_status = NOT v_postagem_favorita_status
        WHERE id_postagem = p_id_postagem AND id_usuario = p_id_usuario;
    ELSE
        INSERT INTO tbl_postagem_favorita (id_postagem, id_usuario, postagem_favorita_status)
        VALUES (p_id_postagem, p_id_usuario, 1);
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE procFavoritarProduto(
    IN p_id_produto INT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_produto_favorito_status TINYINT;
    
    SELECT produto_favorito_status
    INTO v_produto_favorito_status
    FROM tbl_produto_favorito
    WHERE id_produto = p_id_produto AND id_usuario = p_id_usuario;

    IF v_produto_favorito_status IS NOT NULL THEN
        UPDATE tbl_produto_favorito
        SET produto_favorito_status = NOT v_produto_favorito_status
        WHERE id_produto = p_id_produto AND id_usuario = p_id_usuario;
    ELSE
        INSERT INTO tbl_produto_favorito (id_produto, id_usuario, produto_favorito_status)
        VALUES (p_id_produto, p_id_usuario, 1);
    END IF;
END $$

DELIMITER ;

-- Seguir

DELIMITER $$

CREATE PROCEDURE procSeguir(
    IN p_id_seguidor INT,
    IN p_id_seguindo INT
)
BEGIN
    DECLARE v_seguidores_status TINYINT;

    SELECT seguidores_status
    INTO v_seguidores_status
    FROM tbl_seguidores
    WHERE id_seguidor = p_id_seguidor AND id_seguindo = p_id_seguindo;

    IF v_seguidores_status IS NOT NULL THEN
        UPDATE tbl_seguidores
        SET seguidores_status = NOT v_seguidores_status
        WHERE id_seguidor = p_id_seguidor AND id_seguindo = p_id_seguindo;
    ELSE
        INSERT INTO tbl_seguidores (id_seguidor, id_seguindo, seguidores_status)
        VALUES (p_id_seguidor, p_id_seguindo, 1);
    END IF;
END $$

DELIMITER ;

-- Visualizar 

DELIMITER $$

CREATE PROCEDURE procVisualizarPostagem(
    IN p_id_postagem INT,
    IN p_id_usuario INT
)
BEGIN
    INSERT INTO tbl_visualizacao_postagem (id_postagem, id_usuario, visualizacao_postagem_status)
    VALUES (p_id_postagem, p_id_usuario, 1);
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE procVisualizarProduto(
    IN p_id_produto INT,
    IN p_id_usuario INT
)
BEGIN
    INSERT INTO tbl_visualizacao_produto (id_produto, id_usuario, visualizacao_produto_status)
    VALUES (p_id_produto, p_id_usuario, 1);
END $$

DELIMITER ;

