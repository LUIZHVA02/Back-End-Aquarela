const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir um novo usuário
const insertAddress = async (dataAddress) => {

    try {
        let sql = `insert into tbl_endereco (logradouro, numero_casa, complemento, bairro, estado, cidade, cep, status) values ('${dataAddress.logradouro}, ${dataAddress.numero_casa}, ${dataAddress.complemento}, ${dataAddress.bairro}, ${dataAddress.estado}, ${dataAddress.cidade}, ${dataAddress.cep}, true)`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if (resultStatus)
            return true
        else
            return false
    } catch (error) {
        console.error("Erro ao inserir usuário: ", error);
        return false
    }
    
}

module.exports = {
  insertAddress
}