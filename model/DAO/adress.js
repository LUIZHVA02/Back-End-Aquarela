const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir um novo endereço
const insertAddress = async (dataAddress) => {

    try {
        let sql = `insert into tbl_endereco (   logradouro, 
                                                numero_casa, 
                                                complemento, 
                                                bairro, 
                                                estado, 
                                                cidade, 
                                                cep,  
                                                endereco_status
                                            ) 
                                            values 
                                            (
                                                '${dataAddress.logradouro}', 
                                                '${dataAddress.numero_casa}', 
                                                '${dataAddress.complemento}', 
                                                '${dataAddress.bairro}',
                                                '${dataAddress.estado}', 
                                                '${dataAddress.cidade}', 
                                                '${dataAddress.cep}',  
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
        console.log(error + "model/DAO/address.js");

        return false
    }

}

const updateAddress = async function (id, dataAddress) {
    try {
        let sql = `UPDATE tbl_endereco SET `
        const keys = Object.keys(dataAddress)

        keys.forEach((key, index) => {
            sql += `${key} = '${dataAddress[key]}'`
            if (index !== keys.length - 1) {
                sql += `, `
            }
        })

        sql += ` WHERE id_endereco = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        console.log(sql);


        return result

    } catch (error) {
        console.log(error);
        return false
    }

}

const selectByIdAddress = async (id) => {

    try {
        let sql = `select * from tbl_endereco where id_endereco = ${id} and endereco_status = "1"`
        let rsAddres = await prisma.$queryRawUnsafe(sql)
        return rsAddres
    } catch (error) {
        console.log(error);
        return false
    }

}

const selectAllUserAdresses = async (id_usuario) => {
    try {
        let sql = ` select tbl_usuario.id_usuario, tbl_usuario.nome, tbl_usuario.nome_usuario, 
                    tbl_usuario.email, tbl_endereco.id_endereco, tbl_endereco.logradouro, 
                    tbl_endereco.numero_casa, tbl_endereco.complemento, tbl_endereco.bairro, 
                    tbl_endereco.estado, tbl_endereco.cidade, tbl_endereco.cep from tbl_usuario
                    inner join tbl_usuario_endereco on tbl_usuario.id_usuario = tbl_usuario_endereco.id_usuario
                    inner join tbl_endereco on tbl_usuario_endereco.id_endereco = tbl_endereco.id_endereco 
                    where tbl_usuario.usuario_status = 1 and tbl_endereco.endereco_status = 1 and tbl_usuario.id_usuario = ${id_usuario};`

        let rsUserAdresses = await prisma.$queryRawUnsafe(sql)        

        return rsUserAdresses
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectAllAddress = async () => {

    try {
        let sql = `select * from tbl_endereco where endereco_status = "1"`
        let rsAddress = await prisma.$queryRawUnsafe(sql)

        return rsAddress

    } catch (error) {
        console.log(error);
        return false
    }
}

const selectLastId = async () => {

    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_endereco limit 1'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

module.exports = {
    insertAddress,
    updateAddress,
    selectByIdAddress,
    selectAllAddress,
    selectLastId,
    selectAllUserAdresses
}