/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de usuários
* Data: 05/09/2024
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
                                                usuario_status
                                            ) 
                                            values 
                                            (
                                                '${dadosUsuario.nome}', 
                                                '${dadosUsuario.nome_usuario}', 
                                                '${dadosUsuario.foto_usuario}', 
                                                '${dadosUsuario.descricao}',
                                                '${dadosUsuario.email}', 
                                                md5('${dadosUsuario.senha}'), 
                                                '${dadosUsuario.cpf}', 
                                                '${dadosUsuario.data_nascimento}', 
                                                '${dadosUsuario.telefone}', 
                                                '${dadosUsuario.disponibilidade}', 
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
        console.error("Erro ao inserir usuário: ", error);

        console.log(error + "aqui");

        return false
    }

}

// Buscar um usuário existente filtrando pelo ID
const selectByIdUsuarioAtivo = async (id) => {

    try {
        let sql = `select id_usuario, nome, nome_usuario, foto_usuario, descricao, 
                    email, cpf, date_format(data_nascimento, "%d-%m-%Y") as data_nascimento, telefone, 
                    disponibilidade, avaliacao from tbl_usuario where usuario_status = "1" and id_usuario = ${id}`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)

        return rsUsuario
    } catch (error) {

        console.log(error);
        return false
    }

}

const selectAllUsuarios = async () => {

    try {
        let sql = ` select id_usuario, nome, nome_usuario, foto_usuario, descricao, 
                    email, cpf, date_format(data_nascimento, "%d-%m-%Y") as data_nascimento, telefone, 
                    disponibilidade, avaliacao from tbl_usuario where usuario_status = "1";`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)

        return rsUsuario

    } catch (error) {

        console.log(error);

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

        sql += ` WHERE id_usuario = ${id};`

        console.log(sql);
        

        let result = await prisma.$executeRawUnsafe(sql)

        return result

    } catch (error) {

        console.log(error);

        return false
    }

}

const selectByIdUsuarioInativo = async (id) => {

    try {
        let sql = `select * from tbl_usuario where id_usuario = ${id} and usuario_status = "0"`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)

        return rsUsuario
    } catch (error) {

        console.log(error);
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

const selectValidacaoUsuarioNome = async (nome, senha) => {

    try {
        let sql = `select id_usuario, nome_usuario from tbl_usuario where nome_usuario = '${nome}' and senha = md5('${senha}')`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

const selectValidacaoUsuarioEmail = async (email, senha) => {

    try {
        let sql = `select id_usuario, email from tbl_usuario where email = '${email}' and senha = md5('${senha}')`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }
}

const selectEmailCadastrado = async (email) => {
    
    try {
        let sql = `select id_usuario, email from tbl_usuario where email = '${email}')`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = {
    insertUsuario,
    selectAllUsuarios,
    selectLastId,
    selectByIdUsuarioAtivo,
    selectByIdUsuarioInativo,
    updateUsuario,
    selectValidacaoUsuarioNome,
    selectValidacaoUsuarioEmail,
    selectEmailCadastrado
}