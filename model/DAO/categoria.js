/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de categorias
* Data: 26/09/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir uma nova categoria
const insertNovaCategoria = async (dadosCategoria) => {

    try {

        let sql = `insert into tbl_categoria  (   
                                                categoria,
                                                categoria_status
                                            ) 
                                            values 
                                            (
                                                '${dadosCategoria.categoria}',
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
        console.error("Erro ao inserir categoria: ", error);

        console.log(error + "aqui");

        return false
    }

}

const selectAllCategoriesByPostQuantity = async() => {
    try {

        let sql = `
        SELECT 
            c.id_categoria AS id,
            c.categoria AS nome
        FROM 
            tbl_categoria AS c
        LEFT JOIN (
        SELECT 
                id_categoria,
                COUNT(DISTINCT id_produto) AS quantidade_produtos
        FROM 
                tbl_categoria_produto
        GROUP BY 
                id_categoria
            ) AS prod ON c.id_categoria = prod.id_categoria
        LEFT JOIN (
            SELECT 
                id_categoria,
                COUNT(DISTINCT id_postagem) AS quantidade_postagens
            FROM 
                tbl_categoria_postagem
            GROUP BY 
                id_categoria
            ) AS post ON c.id_categoria = post.id_categoria
        ORDER BY 
            COALESCE(prod.quantidade_produtos, 0) + COALESCE(post.quantidade_postagens, 0) desc
        `

        let resultStatus = await prisma.$queryRawUnsafe(sql)
        console.log(resultStatus);
        if (resultStatus) {
            return resultStatus
        }
        else {
            return false
        }

    } catch (error) {
        console.error("Erro ao listar categorias: ", error);
        return false
    }
}

module.exports = {
    insertNovaCategoria,
    selectAllCategoriesByPostQuantity
}