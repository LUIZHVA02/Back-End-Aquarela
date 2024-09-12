/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de usuários
* Data: 09/04/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
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
                                                status
                                            ) 
                                            values 
                                            (
                                                '${dadosUsuario.nome}', 
                                                '${dadosUsuario.nome_usuario}', 
                                                '${dadosUsuario.foto_usuario}', 
                                                '${dadosUsuario.descricao}',
                                                '${dadosUsuario.email}', 
                                                '${dadosUsuario.senha}', 
                                                '${dadosUsuario.cpf}', 
                                                '${dadosUsuario.data_nascimento}', 
                                                '${dadosUsuario.telefone}', 
                                                '${dadosUsuario.disponibilidade}', 
                                                true
                                            )`
        let resultStatus = await prisma.$executeRawUnsafe(sql)

        if (resultStatus){
            return true
        }
        else{
            return false
        }
            
    } catch (error) {
        console.error("Erro ao inserir usuário: ", error);
        
        console.log(error + "aqui");

        return false
    }
    
}

// Atualizar um usuário existente filtrando pelo ID
const updateUsuario = async function (id, dadosUsuarioUpdate) {
    try {
        let sql = `UPDATE tbl_usuario SET `
        const keys = Object.keys(dadosUsuarioUpdate)

        keys.forEach((key, index) => {
            sql += `${key} = '${dadosUsuarioUpdate[key]}'`
            if (index !== keys.length - 1) {
                sql += `, `
            }
        })

        sql += ` WHERE id_usuario = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        return result

    } catch (error) {
        
        console.log(error);

        return false
    }

}

// Atualizar um usuário existente filtrando pelo ID
const updateUsuarioSenha = async (dadosUsuario, idUsuario) => {

    try {
        let sql = `update tbl_usuario set nome = '${dadosUsuario.nome}', email = '${dadosUsuario.email}', senha = md5('${dadosUsuario.senha}') where id = ${idUsuario}`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if (resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

const selectAllUsuarios = async () => {

    try {
        let sql = 'select * from tbl_usuario'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        console.log(error);
        return false
    }

}


// Buscar um usuário existente filtrando pelo ID
const selectByIdUsuario = async (id) => {

    try {
        let sql = `select * from tbl_usuario where id_usuario = ${id}`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        console.log(error);
        return false
    }

}

// Validação de usuário 
const selectValidacaoUsuario = async (email, senha) => {

    try {
        let sql = `select tu.id, tu.nome, tu.email from tbl_usuario as tu where email = '${email}' and senha = md5('${senha}')`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
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

module.exports = {
    insertUsuario,
    selectAllUsuarios,
    selectLastId,
    selectByIdUsuario,
    updateUsuario
}