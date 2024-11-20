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
    selectLastId
}