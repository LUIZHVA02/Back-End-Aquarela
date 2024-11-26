SELECT
        'produto' AS tipo,
        tp.id_produto AS id_publicacao,
        tp.nome,
        tp.descricao,
        tp.item_digital,
        tp.marca_dagua,
        tp.preco,
        tp.quantidade,
        tp.id_usuario AS id_dono_publicacao,
        CAST(
                CASE
                        WHEN MAX(cp.curtidas_produto_status) = true THEN 1
                        ELSE 0
                END AS DECIMAL
        ) AS curtida,
        CAST(
                CASE
                        WHEN MAX(pf.produto_favorito_status) = true THEN 1
                        ELSE 0
                END AS DECIMAL
        ) AS favorito,
        CAST(1 AS DECIMAL) AS preferencia
FROM
        tbl_produto AS tp
        LEFT JOIN tbl_categoria_produto AS tcp ON tp.id_produto = tcp.id_produto
        AND tcp.categoria_produto_status = true
        LEFT JOIN tbl_curtida_produto AS cp ON tp.id_produto = cp.id_produto
        AND cp.id_usuario = $ { id }
        LEFT JOIN tbl_produto_favorito AS pf ON tp.id_produto = pf.id_produto
        AND pf.id_usuario = $ { id }
WHERE
        tcp.id_categoria IN (
                SELECT
                        id_categoria
                FROM
                        tbl_preferencia
                WHERE
                        id_usuario = $ { id }
                        AND preferencia_status = true
        )
GROUP BY
        tp.id_produto
UNION
ALL
SELECT
        'postagem' AS tipo,
        tp.id_postagem AS id_publicacao,
        tp.nome,
        tp.descricao,
        NULL AS item_digital,
        NULL AS marca_dagua,
        NULL AS preco,
        NULL AS quantidade,
        tp.id_usuario AS id_dono_publicacao,
        CAST(
                CASE
                        WHEN MAX(cp.curtidas_postagem_status) = true THEN 1
                        ELSE 0
                END AS DECIMAL
        ) AS curtida,
        CAST(
                CASE
                        WHEN MAX(pf.postagem_favorita_status) = true THEN 1
                        ELSE 0
                END AS DECIMAL
        ) AS favorito,
        CAST(1 AS DECIMAL) AS preferencia
FROM
        tbl_postagem AS tp
        LEFT JOIN tbl_categoria_postagem AS tcp ON tp.id_postagem = tcp.id_postagem
        AND tcp.categoria_postagem_status = true
        LEFT JOIN tbl_curtida_postagem AS cp ON tp.id_postagem = cp.id_postagem
        AND cp.id_usuario = $ { id }
        LEFT JOIN tbl_postagem_favorita AS pf ON tp.id_postagem = pf.id_postagem
        AND pf.id_usuario = $ { id }
WHERE
        tcp.id_categoria IN (
                SELECT
                        id_categoria
                FROM
                        tbl_preferencia
                WHERE
                        id_usuario = $ { id }
                        AND preferencia_status = true
        )
GROUP BY
        tp.id_postagem
UNION
ALL
SELECT
        'produto' AS tipo,
        tp.id_produto AS id_publicacao,
        tp.nome,
        tp.descricao,
        tp.item_digital,
        tp.marca_dagua,
        tp.preco,
        tp.quantidade,
        tp.id_usuario AS id_dono_publicacao,
        CAST(
                CASE
                        WHEN MAX(cp.curtidas_produto_status) = true THEN 1
                        ELSE 0
                END AS DECIMAL
        ) AS curtida,
        CAST(
                CASE
                        WHEN MAX(pf.produto_favorito_status) = true THEN 1
                        ELSE 0
                END AS DECIMAL
        ) AS favorito,
        CAST(0 AS DECIMAL) AS preferencia
FROM
        tbl_produto AS tp
        LEFT JOIN tbl_categoria_produto AS tcp ON tp.id_produto = tcp.id_produto
        AND tcp.categoria_produto_status = true
        LEFT JOIN tbl_curtida_produto AS cp ON tp.id_produto = cp.id_produto
        AND cp.id_usuario = $ { id }
        LEFT JOIN tbl_produto_favorito AS pf ON tp.id_produto = pf.id_produto
        AND pf.id_usuario = $ { id }
GROUP BY
        tp.id_produto
HAVING
        tp.id_produto NOT IN (
                SELECT
                        tp.id_produto
                FROM
                        tbl_produto AS tp
                        LEFT JOIN tbl_categoria_produto AS tcp ON tp.id_produto = tcp.id_produto
                WHERE
                        tcp.id_categoria IN (
                                SELECT
                                        id_categoria
                                FROM
                                        tbl_preferencia
                                WHERE
                                        id_usuario = $ { id }
                                        AND preferencia_status = true
                        )
        )
UNION
ALL
SELECT
        'postagem' AS tipo,
        tp.id_postagem AS id_publicacao,
        tp.nome,
        tp.descricao,
        NULL AS item_digital,
        NULL AS marca_dagua,
        NULL AS preco,
        NULL AS quantidade,
        tp.id_usuario AS id_dono_publicacao,
        CAST(
                CASE
                        WHEN MAX(cp.curtidas_postagem_status) = true THEN 1
                        ELSE 0
                END AS DECIMAL
        ) AS curtida,
        CAST(
                CASE
                        WHEN MAX(pf.postagem_favorita_status) = true THEN 1
                        ELSE 0
                END AS DECIMAL
        ) AS favorito,
        CAST(0 AS DECIMAL) AS preferencia
FROM
        tbl_postagem AS tp
        LEFT JOIN tbl_categoria_postagem AS tcp ON tp.id_postagem = tcp.id_postagem
        AND tcp.categoria_postagem_status = true
        LEFT JOIN tbl_curtida_postagem AS cp ON tp.id_postagem = cp.id_postagem
        AND cp.id_usuario = $ { id }
        LEFT JOIN tbl_postagem_favorita AS pf ON tp.id_postagem = pf.id_postagem
        AND pf.id_usuario = $ { id }
GROUP BY
        tp.id_postagem
HAVING
        tp.id_postagem NOT IN (
                SELECT
                        tp.id_postagem
                FROM
                        tbl_postagem AS tp
                        LEFT JOIN tbl_categoria_postagem AS tcp ON tp.id_postagem = tcp.id_postagem
                WHERE
                        tcp.id_categoria IN (
                                SELECT
                                        id_categoria
                                FROM
                                        tbl_preferencia
                                WHERE
                                        id_usuario = $ { id }
                                        AND preferencia_status = true
                        )
        )
ORDER BY
        CASE
                WHEN preferencia = 1 THEN 1
                ELSE 2
        END,
        RAND()