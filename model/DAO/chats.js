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

const getListConversas = async () => {
    try{
        let sql = ``
    } catch (error){
        console.log(error);
        return false
    }

}

module.exports = {
    insertNovaConversa,
    getListConversas
}