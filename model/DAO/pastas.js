/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de pastas de postagem
* Data: 24/10/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insertNovaPasta = async (dadospasta) => {

    try {

        let sql = `insert into tbl_pasta  (   nome, 
                                                    id_usuario,
                                                    pasta_status
                                                ) 
                                                values 
                                                (
                                                    '${dadospasta.nome}', 
                                                    '${dadospasta.id_usuario}',
                                                    true
                                                )`
        console.log(sql)
        let resultStatus = await prisma.$executeRawUnsafe(sql)

        if (resultStatus) {
            return true
        }
        else {
            return false
        }

    } catch (error) {
        console.error("Erro ao inserir pasta: ", error);

        console.log(error + "aqui");

        return false
    }

}

const selectAllPasta = async () => {

    try {
        let sql = `select * from tbl_pasta`
        let rspasta = await prisma.$queryRawUnsafe(sql)

        return rspasta

    } catch (error) {

        console.log(error);

        return false
    }

}

const updatePasta = async function (id, dataPastaUpdate) {
    try {
        let sql = `UPDATE tbl_pasta SET `
        const keys = Object.keys(dataPastaUpdate)

        keys.forEach((key, index) => {
            sql += `${key} = '${dataPastaUpdate[key]}'`
            if (index !== keys.length - 1) {
                sql += `, `
            }
            console.log(sql);
        })

        sql += ` WHERE id_pasta = ${id};`

        let result = await prisma.$executeRawUnsafe(sql)

        console.log(result);

        return result

    } catch (error) {

        console.log(error);

        return false
    }

}

const selectByIdPasta = async (id) => {

    try {
        let sql = `select * from tbl_pasta where id_pasta = ${id} and pasta_status = "1"`
        let rsPasta = await prisma.$queryRawUnsafe(sql)
        return rsPasta
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectPastaItens = async (idPasta, idUsuario) => {

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
            INNER JOIN tbl_pasta_produto AS pp ON tp.id_produto = pp.id_produto
            LEFT JOIN tbl_curtida_produto AS cp ON tp.id_produto = cp.id_produto AND cp.id_usuario = ${idUsuario}
            LEFT JOIN tbl_produto_favorito AS pf ON tp.id_produto = pf.id_produto AND pf.id_usuario = ${idUsuario}
            INNER JOIN tbl_usuario AS u ON tp.id_usuario = u.id_usuario
            WHERE pp.id_pasta = ${idPasta}
            AND tp.produto_status = true
            AND u.usuario_status = true
            GROUP BY tp.id_produto, tp.nome, tp.descricao, tp.item_digital, tp.marca_dagua, tp.preco, tp.quantidade, tp.id_usuario

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
            INNER JOIN tbl_pasta_postagem AS pp ON tp.id_postagem = pp.id_postagem
            LEFT JOIN tbl_curtida_postagem AS cp ON tp.id_postagem = cp.id_postagem AND cp.id_usuario = ${idUsuario}
            LEFT JOIN tbl_postagem_favorita AS pf ON tp.id_postagem = pf.id_postagem AND pf.id_usuario = ${idUsuario}
            INNER JOIN tbl_usuario AS u ON tp.id_usuario = u.id_usuario 
            WHERE pp.id_pasta = ${idPasta}
            AND tp.postagem_status = true
            AND u.usuario_status = true
            GROUP BY tp.id_postagem, tp.nome, tp.descricao, tp.id_usuario

            ORDER BY id_publicacao
        `

        let rsPasta = await prisma.$queryRawUnsafe(sql)
        return rsPasta
    } catch (error) {
        console.log(error);
        return false
    }
}


const selectLastId = async () => {

    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_pasta limit 1'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

module.exports = {
    insertNovaPasta,
    selectAllPasta,
    updatePasta,
    selectByIdPasta,
    selectPastaItens,
    selectLastId
}