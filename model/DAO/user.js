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
                                                user_status
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
            console.log(sql);
        })

        sql += ` WHERE id_usuario = ${id};`

        let result = await prisma.$executeRawUnsafe(sql)

        console.log(result);

        return result

    } catch (error) {

        console.log(error);

        return false
    }

}

const selectAllUsuarios = async () => {

    try {
        let sql = 'select * from tbl_usuario'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)

        let tratado
        const keys = Object.keys(rsUsuario)


        keys.forEach((key, index) => {

            console.log(rsUsuario[key]);

            tratado += key = rsUsuario[key].id_usuario
            tratado += key = rsUsuario[key].nome
            tratado += key = rsUsuario[key].nome_usuario
            tratado += key = rsUsuario[key].foto_usuario
            tratado += key = rsUsuario[key].descricao
            tratado += key = rsUsuario[key].email
            tratado += key = rsUsuario[key].senha
            tratado += key = rsUsuario[key].cpf
            tratado += key = rsUsuario[key].tratarDataBACK(data_nascimento)
            tratado += key = rsUsuario[key].telefone
            tratado += key = rsUsuario[key].disponibilidade
            tratado += key = rsUsuario[key].user_status

            if (index !== keys.length - 1) {
                tratado += `, `
            }

            console.log(tratado);
        })

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

const selectLastId = async () => {

    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_usuario limit 1'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

const deleteUsuarioById = async function (id) {
    try {
        let sql = `delete from tbl_usuario where id_usuario = ${ id }`

        let rsUsuario = await prisma.$queryRawUnsafe(sql);
        return rsUsuario;

    } catch (error) {
        return false
    }
}
module.exports = {
    insertUsuario,
    selectAllUsuarios,
    selectLastId,
    selectByIdUsuario,
    updateUsuario,
    deleteUsuarioById
}