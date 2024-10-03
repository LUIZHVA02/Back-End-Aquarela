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
                                            console.log(sql)
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

const selectLastId = async () => {

    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_preferencia limit 1'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

module.exports = {
    insertNovaPreferencia,
    selectLastId
}