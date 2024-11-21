/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de usuários
* Data: 05/09/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const selectSearchItemsByText = async (id_client, text) => {
    try {
      let sql = `select * from tbl_postagem where id_postagem = ${id}`;
      let rsSearch = await prisma.$queryRawUnsafe(sql);
      return rsSearch;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

// Inserir um novo usuário
const insertUsuario = async (dadosUsuario) => {

    try {

        let sql = `insert into tbl_usuario  (   nome, 
                                                nome_usuario, 
                                                foto_usuario, 
                                                descricao, 
                                                email, 
                                                senha, 
                                                cpf, 
                                                data_nascimento, 
                                                telefone, 
                                                disponibilidade, 
                                                usuario_status
                                            ) 
                                            values 
                                            (
                                                '${dadosUsuario.nome}', 
                                                '${dadosUsuario.nome_usuario}', 
                                                '${dadosUsuario.foto_usuario}', 
                                                '${dadosUsuario.descricao}',
                                                '${dadosUsuario.email}', 
                                                md5('${dadosUsuario.senha}'), 
                                                '${dadosUsuario.cpf}', 
                                                '${dadosUsuario.data_nascimento}', 
                                                '${dadosUsuario.telefone}', 
                                                '${dadosUsuario.disponibilidade}', 
                                                true
                                            )`
        let resultStatus = await prisma.$executeRawUnsafe(sql)

        if (resultStatus) {
            return true
        }
        else {
            return false
        }

    } catch (error) {
        console.error("Erro ao inserir usuário: ", error);

        console.log(error);

        return false
    }

}

// Buscar um usuário existente filtrando pelo ID
const selectByIdUsuarioAtivo = async (id) => {

    try {
        let sql = `select id_usuario, nome, nome_usuario, foto_usuario, descricao, 
                    email, cpf, date_format(data_nascimento, "%d-%m-%Y") as data_nascimento, telefone, 
                    disponibilidade, avaliacao from tbl_usuario where usuario_status = "1" and id_usuario = ${id}`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)

        return rsUsuario
    } catch (error) {

        console.log(error);
        return false
    }

}

const selectAllUsuarios = async () => {

    try {
        let sql = ` select id_usuario, nome, nome_usuario, foto_usuario, descricao, 
                    email, cpf, date_format(data_nascimento, "%d-%m-%Y") as data_nascimento, telefone, 
                    disponibilidade, avaliacao from tbl_usuario where usuario_status = "1";`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)

        return rsUsuario

    } catch (error) {

        console.log(error);

        return false
    }

}

// Atualizar um usuário existente filtrando pelo ID
const updateUsuario = async function (id, dadosUsuarioUpdate) {
    try {
        let sql = `UPDATE tbl_usuario SET `
        const keys = Object.keys(dadosUsuarioUpdate)

        keys.forEach((key, index) => {
            if (key == "senha") {
                sql += `${key} = md5('${dadosUsuarioUpdate[key]}')`
                if (index !== keys.length - 1) {
                    sql += `, `
                }
            } else {
                sql += `${key} = '${dadosUsuarioUpdate[key]}'`
                if (index !== keys.length - 1) {
                    sql += `, `
                }
            }
        })

        sql += ` WHERE id_usuario = ${id};`

        console.log(sql);
        
        let result = await prisma.$executeRawUnsafe(sql)

        console.log(result);
        

        return result

    } catch (error) {

        console.log(error);

        return false
    }

}

const selectByIdUsuarioInativo = async (id) => {

    try {
        let sql = `select * from tbl_usuario where id_usuario = ${id} and usuario_status = "0"`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)

        return rsUsuario
    } catch (error) {

        console.log(error);
        return false
    }

}

const selectLastId = async () => {

    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_usuario limit 1'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

const selectValidacaoUsuarioNome = async (nome, senha) => {

    try {
        let sql = `select id_usuario, nome, nome_usuario, foto_usuario, descricao, 
        email, cpf, date_format(data_nascimento, "%d-%m-%Y") as data_nascimento, telefone, 
        disponibilidade, avaliacao from tbl_usuario where nome_usuario = '${nome}' and 
        senha = md5('${senha}') and usuario_status = "1";`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

const selectValidacaoUsuarioEmail = async (email, senha) => {

    try {
        let sql = `select id_usuario, nome, nome_usuario, foto_usuario, descricao, 
        email, cpf, date_format(data_nascimento, "%d-%m-%Y") as data_nascimento, telefone, 
        disponibilidade, avaliacao from tbl_usuario where email = '${email}' and 
        senha = md5('${senha}') and usuario_status = "1";`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }
}

const selectEmailCadastrado = async (email) => {

    try {
        let sql = `select id_usuario, email from tbl_usuario where email = '${email}')`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectFeed = async (id) => {

    try {

        let sql = `
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
        CAST(CASE 
        WHEN MAX(cp.curtidas_produto_status) = true THEN 1 
        ELSE 0 
        END AS DECIMAL) AS curtida,
        CAST(CASE 
        WHEN MAX(pf.produto_favorito_status) = true THEN 1 
        ELSE 0 
        END AS DECIMAL) AS favorito,
        CAST(1 AS DECIMAL) AS preferencia
       FROM tbl_produto AS tp
       LEFT JOIN tbl_categoria_produto AS tcp ON tp.id_produto = tcp.id_produto AND tcp.categoria_produto_status = true
       LEFT JOIN tbl_curtida_produto AS cp ON tp.id_produto = cp.id_produto AND cp.id_usuario = ${id}
       LEFT JOIN tbl_produto_favorito AS pf ON tp.id_produto = pf.id_produto AND pf.id_usuario = ${id}
       WHERE tcp.id_categoria IN (SELECT id_categoria FROM tbl_preferencia WHERE id_usuario = ${id} AND preferencia_status = true)
       GROUP BY tp.id_produto
       
       UNION ALL
       
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
        CAST(CASE 
        WHEN MAX(cp.curtidas_postagem_status) = true THEN 1 
        ELSE 0 
        END AS DECIMAL) AS curtida,
        CAST(CASE 
        WHEN MAX(pf.postagem_favorita_status) = true THEN 1 
        ELSE 0 
        END AS DECIMAL) AS favorito,
        CAST(1 AS DECIMAL) AS preferencia
       FROM tbl_postagem AS tp
       LEFT JOIN tbl_categoria_postagem AS tcp ON tp.id_postagem = tcp.id_postagem AND tcp.categoria_postagem_status = true
       LEFT JOIN tbl_curtida_postagem AS cp ON tp.id_postagem = cp.id_postagem AND cp.id_usuario = ${id}
       LEFT JOIN tbl_postagem_favorita AS pf ON tp.id_postagem = pf.id_postagem AND pf.id_usuario = ${id}
       WHERE tcp.id_categoria IN (SELECT id_categoria FROM tbl_preferencia WHERE id_usuario = ${id} AND preferencia_status = true)
       GROUP BY tp.id_postagem
       
       UNION ALL
       
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
        CAST(CASE 
        WHEN MAX(cp.curtidas_produto_status) = true THEN 1 
        ELSE 0 
        END AS DECIMAL) AS curtida,
        CAST(CASE 
        WHEN MAX(pf.produto_favorito_status) = true THEN 1 
        ELSE 0 
        END AS DECIMAL) AS favorito,
        CAST(0 AS DECIMAL) AS preferencia
       FROM tbl_produto AS tp
       LEFT JOIN tbl_categoria_produto AS tcp ON tp.id_produto = tcp.id_produto AND tcp.categoria_produto_status = true
       LEFT JOIN tbl_curtida_produto AS cp ON tp.id_produto = cp.id_produto AND cp.id_usuario = ${id}
       LEFT JOIN tbl_produto_favorito AS pf ON tp.id_produto = pf.id_produto AND pf.id_usuario = ${id}
       GROUP BY tp.id_produto
       HAVING tp.id_produto NOT IN (
        SELECT tp.id_produto FROM tbl_produto AS tp
        LEFT JOIN tbl_categoria_produto AS tcp ON tp.id_produto = tcp.id_produto
        WHERE tcp.id_categoria IN (SELECT id_categoria FROM tbl_preferencia WHERE id_usuario = ${id} AND preferencia_status = true)
       )
       
       UNION ALL
       
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
        CAST(CASE 
        WHEN MAX(cp.curtidas_postagem_status) = true THEN 1 
        ELSE 0 
        END AS DECIMAL) AS curtida,
        CAST(CASE 
        WHEN MAX(pf.postagem_favorita_status) = true THEN 1 
        ELSE 0 
        END AS DECIMAL) AS favorito,
        CAST(0 AS DECIMAL) AS preferencia
       FROM tbl_postagem AS tp
       LEFT JOIN tbl_categoria_postagem AS tcp ON tp.id_postagem = tcp.id_postagem AND tcp.categoria_postagem_status = true
       LEFT JOIN tbl_curtida_postagem AS cp ON tp.id_postagem = cp.id_postagem AND cp.id_usuario = ${id}
       LEFT JOIN tbl_postagem_favorita AS pf ON tp.id_postagem = pf.id_postagem AND pf.id_usuario = ${id}
       GROUP BY tp.id_postagem
       HAVING tp.id_postagem NOT IN (
        SELECT tp.id_postagem FROM tbl_postagem AS tp
        LEFT JOIN tbl_categoria_postagem AS tcp ON tp.id_postagem = tcp.id_postagem
        WHERE tcp.id_categoria IN (SELECT id_categoria FROM tbl_preferencia WHERE id_usuario = ${id} AND preferencia_status = true)
       )
       
       ORDER BY 
        CASE 
        WHEN preferencia = 1 THEN 1 
        ELSE 2 
        END,
        RAND()

        `
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario

    } catch (error) {
        console.log(error);
        return false
    }

}

const selectImages = async (id, postType) => {
    try {
        let sql = `
            select ti.id_imagem, ti.url from tbl_imagem as ti
            inner join tbl_imagem_${postType} as tip
            on ti.id_imagem=tip.id_imagem
            where tip.id_${postType} = ${id} and tip.imagem_${postType}_status = true
        `
        let rsImagem = await prisma.$queryRawUnsafe(sql)
        return rsImagem
    } catch (error) {
        return error
    }
}

const selectUserByNickname = async (nickname, client) => {
    try {
        let sql = `
        select
            u.id_usuario as id,
            u.nome,
            u.nome_usuario,
            u.foto_usuario,
            u.descricao,
            u.email,
            u.cpf,
            date_format(u.data_nascimento, "%d-%m-%Y") as data_nascimento,
            u.telefone,
            u.disponibilidade,
            u.avaliacao,
            cast(
                (
                    (select count(*)
                    from tbl_postagem p
                    where p.id_usuario = u.id_usuario
                    and p.postagem_status = true)
                    +
                    (select count(*)
                    from tbl_produto pr
                    where pr.id_usuario = u.id_usuario
                    and pr.produto_status = true)
                ) as decimal
            ) as qnt_publicacoes,
            cast(
                (select count(*)
                from tbl_seguidores s
                where s.id_seguindo = u.id_usuario
                and s.seguidores_status = true) as decimal
            ) as seguidores,
            cast(
                (select count(*)
                from tbl_seguidores s
                where s.id_seguidor = u.id_usuario
                and s.seguidores_status = true) as decimal
            ) as seguindo,
            cast(
                exists (
                    select 1
                        from tbl_seguidores s
                        where s.id_seguidor = ${client}
                        and s.id_seguindo = u.id_usuario
                        and s.seguidores_status = true
                ) as decimal
            ) as esta_seguindo
            from
                tbl_usuario as u
            where
                u.nome_usuario = "${nickname}"
                and u.usuario_status = true;
        `
        let rsUser = await prisma.$queryRawUnsafe(sql)
        return rsUser
    } catch (error) {
        console.log(error);
        return error
    }
}

const selectFavoriteById = async (idUsuario) => {
    try {
        let sql = `
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
                CAST(CASE 
                    WHEN MAX(cp.curtidas_produto_status) = true THEN 1 
                    ELSE 0 
                    END AS DECIMAL) AS curtida,
                CAST(CASE 
                    WHEN MAX(pf.produto_favorito_status) = true THEN 1 
                    ELSE 0 
                    END AS DECIMAL) AS favorito
            FROM tbl_produto AS tp
            LEFT JOIN tbl_curtida_produto AS cp ON tp.id_produto = cp.id_produto AND cp.id_usuario = ${idUsuario}
            LEFT JOIN tbl_produto_favorito AS pf ON tp.id_produto = pf.id_produto AND pf.id_usuario = ${idUsuario} AND pf.produto_favorito_status = true
            WHERE pf.produto_favorito_status = true
            GROUP BY tp.id_produto

            UNION ALL

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
                CAST(CASE 
                    WHEN MAX(cp.curtidas_postagem_status) = true THEN 1 
                    ELSE 0 
                    END AS DECIMAL) AS curtida,
                CAST(CASE 
                    WHEN MAX(pf.postagem_favorita_status) = true THEN 1 
                    ELSE 0 
                    END AS DECIMAL) AS favorito
            FROM tbl_postagem AS tp
            LEFT JOIN tbl_curtida_postagem AS cp ON tp.id_postagem = cp.id_postagem AND cp.id_usuario = ${idUsuario}
            LEFT JOIN tbl_postagem_favorita AS pf ON tp.id_postagem = pf.id_postagem AND pf.id_usuario = ${idUsuario} AND pf.postagem_favorita_status = true
            WHERE pf.postagem_favorita_status = true
            GROUP BY tp.id_postagem

            ORDER BY id_publicacao
        `
        let rsUser = await prisma.$queryRawUnsafe(sql)
        return rsUser
    } catch (error) {
        console.log(error);
        return error
    }
}

const selectFoldersByUser = async (id) => {
    try {
        let sql = `
            SELECT
                id_pasta,
                nome

            FROM 
                tbl_pasta 
            WHERE 
                id_usuario = ${id}
            AND 
                pasta_status = true
        `
        let rsFolder = await prisma.$queryRawUnsafe(sql)
        return rsFolder
    } catch (error) {
        return error
    }
}

const selectPostsByUserId = async (idDonoPublicacao, idUsuario) => {
    try {
        let sql = `
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
            CAST(CASE 
            WHEN MAX(cp.curtidas_produto_status) = true THEN 1 
            ELSE 0 
            END AS DECIMAL) AS curtida,
            CAST(CASE 
            WHEN MAX(pf.produto_favorito_status) = true THEN 1 
            ELSE 0 
            END AS DECIMAL) AS favorito
       FROM tbl_produto AS tp
       LEFT JOIN tbl_curtida_produto AS cp ON tp.id_produto = cp.id_produto AND cp.id_usuario = ${idUsuario}
       LEFT JOIN tbl_produto_favorito AS pf ON tp.id_produto = pf.id_produto AND pf.id_usuario = ${idUsuario}
       WHERE tp.id_usuario = ${idDonoPublicacao}
       GROUP BY tp.id_produto
       
       UNION ALL
       
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
        CAST(CASE 
        WHEN MAX(cp.curtidas_postagem_status) = true THEN 1 
        ELSE 0 
        END AS DECIMAL) AS curtida,
        CAST(CASE 
        WHEN MAX(pf.postagem_favorita_status) = true THEN 1 
        ELSE 0 
        END AS DECIMAL) AS favorito
       FROM tbl_postagem AS tp
       LEFT JOIN tbl_curtida_postagem AS cp ON tp.id_postagem = cp.id_postagem AND cp.id_usuario = ${idUsuario}
       LEFT JOIN tbl_postagem_favorita AS pf ON tp.id_postagem = pf.id_postagem AND pf.id_usuario = ${idUsuario}
       WHERE tp.id_usuario = ${idDonoPublicacao}
       GROUP BY tp.id_postagem
       
       ORDER BY id_publicacao
        `
        let rsPost = await prisma.$queryRawUnsafe(sql)
        return rsPost
    } catch (error) {
        return error
    }
}


module.exports = {
    selectSearchItemsByText,
    insertUsuario,
    selectAllUsuarios,
    selectLastId,
    selectByIdUsuarioAtivo,
    selectByIdUsuarioInativo,
    updateUsuario,
    selectValidacaoUsuarioNome,
    selectValidacaoUsuarioEmail,
    selectEmailCadastrado,
    selectFeed,
    selectImages,
    selectUserByNickname,
    selectFoldersByUser,
    selectPostsByUserId,
    selectFavoriteById
}