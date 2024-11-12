const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insertNovaConversa = async (dadosConversa) => {

    try {

        let sql = `insert into tbl_conversa  (   
                                                    id_usuario_1, 
                                                    id_usuario_2,
                                                    conversa_status
                                                ) 
                                                values 
                                                (
                                                    '${dadosConversa.id_usuario_1}', 
                                                    '${dadosConversa.id_usuario_2}',
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
        console.error("Erro ao inserir Conversa: ", error);

        console.log(error + "aqui");

        return false
    }

}

module.exports = {
    insertNovaConversa
}