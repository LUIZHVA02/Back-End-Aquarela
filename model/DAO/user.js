/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de usuários
* Data: 05/09/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const res = require('express/lib/response');
const prisma = new PrismaClient();

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

        let result = await prisma.$executeRawUnsafe(sql)

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
            CAST(1 AS DECIMAL) AS preferencia
        FROM tbl_produto AS tp
        LEFT JOIN tbl_categoria_produto AS tcp ON tp.id_produto = tcp.id_produto AND tcp.categoria_produto_status = true
        LEFT JOIN tbl_curtida_produto AS cp ON tp.id_produto = cp.id_produto AND cp.id_usuario = ${id}
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
            CAST(1 AS DECIMAL) AS preferencia
        FROM tbl_postagem AS tp
        LEFT JOIN tbl_categoria_postagem AS tcp ON tp.id_postagem = tcp.id_postagem AND tcp.categoria_postagem_status = true
        LEFT JOIN tbl_curtida_postagem AS cp ON tp.id_postagem = cp.id_postagem AND cp.id_usuario = ${id}
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
            CAST(0 AS DECIMAL) AS preferencia
        FROM tbl_produto AS tp
        LEFT JOIN tbl_categoria_produto AS tcp ON tp.id_produto = tcp.id_produto AND tcp.categoria_produto_status = true
        LEFT JOIN tbl_curtida_produto AS cp ON tp.id_produto = cp.id_produto AND cp.id_usuario = ${id}
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
            CAST(0 AS DECIMAL) AS preferencia
        FROM tbl_postagem AS tp
        LEFT JOIN tbl_categoria_postagem AS tcp ON tp.id_postagem = tcp.id_postagem AND tcp.categoria_postagem_status = true
        LEFT JOIN tbl_curtida_postagem AS cp ON tp.id_postagem = cp.id_postagem AND cp.id_usuario = ${id}
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
            RAND();

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

module.exports = {
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
    selectImages
}