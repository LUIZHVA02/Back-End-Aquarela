const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insertNovaPreferencia = async (id_usuario, id_categoria) => {

    try {

        let sql = `insert into tbl_preferencia  (   
                                                id_usuario,
                                                id_categoria,
                                                preferencia_status
                                            ) 
                                            values 
                                            (
                                                '${id_usuario}',
                                                '${id_categoria}',
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

        console.log(error);

        return false
    }

}

const selectLastId = async (indice) => {

    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_preferencia limit ${indice}`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

const selectByIdPreferences = async (id) => {

    try {
        let sql = `select * from tbl_preferencia where id_preferencia = ${id} and preferencia_status = "1"`
        let rsPreferencias = await prisma.$queryRawUnsafe(sql)
        return rsPreferencias
    } catch (error) {
        console.log(error);
        return false
    }

}

const selectAllPreferences = async () => {

    try {
        let sql = `select tbl_preferencia.id_usuario, tbl_usuario.nome, tbl_usuario.nome_usuario, 
                    tbl_preferencia.id_categoria, tbl_categoria.categoria from tbl_categoria
                    inner join tbl_preferencia on tbl_preferencia.id_categoria = tbl_categoria.id_categoria 
                    inner join tbl_usuario on tbl_usuario.id_usuario = tbl_preferencia.id_usuario 
                    where preferencia_status = "1" order by tbl_usuario.id_usuario;`
        let rsPreferencias = await prisma.$queryRawUnsafe(sql)

        return rsPreferencias

    } catch (error) {
        console.log(error);
        return false
    }
}

// Atualizar um usuário existente filtrando pelo ID
const updatePreferencias = async function (id, dadosPreferenciaUpdate) {
    try {
        let sql = `UPDATE tbl_preferencia SET `
        const keys = Object.keys(dadosPreferenciaUpdate)

        keys.forEach((key, index) => {
            sql += `${key} = '${dadosPreferenciaUpdate[key]}'`
            if (index !== keys.length - 1) {
                sql += `, `
            }
        })

        sql += ` WHERE id_preferencia = ${id};`

        console.log(sql);
        

        let result = await prisma.$executeRawUnsafe(sql)

        return result

    } catch (error) {

        console.log(error);

        return false
    }

}

module.exports = {
    insertNovaPreferencia,
    selectLastId,
    selectAllPreferences,
    selectByIdPreferences,
    updatePreferencias
}