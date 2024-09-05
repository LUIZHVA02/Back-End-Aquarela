/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de usuários
* Data: 09/04/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um novo usuário
const insertUsuario = async (dadosUsuario) => {

    try {
        let sql = `insert into tbl_usuario (nome, nome_usuario, foto_usuario, descricao, email, senha, cpf, data_nascimento, telefone, disponibilidade, status) values ('${dadosUsuario.id_usuario}','${dadosUsuario.nome}', '${dadosUsuario.nome_usuario}', '${dadosUsuario.foto_usuario}', '${dadosUsuario.descricao}','${dadosUsuario.email}', md5('${dadosUsuario.senha}'), '${dadosUsuario.cpf}', '${dadosUsuario.data_nascimento}', '${dadosUsuario.telefone}', '${dadosUsuario.disponibilidade}', true)`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um usuário existente filtrando pelo ID
const updateUsuario = async (dadosUsuario, idUsuario) => {

    try {
        let sql = `update tbl_usuario set nome = '${dadosUsuario.nome}', email = '${dadosUsuario.email}' where id = ${idUsuario}`           
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um usuário existente filtrando pelo ID
const updateUsuarioSenha = async (dadosUsuario, idUsuario) => {

    try {
        let sql = `update tbl_usuario set nome = '${dadosUsuario.nome}', email = '${dadosUsuario.email}', senha = md5('${dadosUsuario.senha}') where id = ${idUsuario}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar um usuário existente filtrando pelo ID
// const deleteUsuario = async (id) => {

//     try {
//         let sql = `delete from tbl_usuario where id = ${id}`
//         let rsUsuario = await prisma.$executeRawUnsafe(sql)
//         return rsUsuario
//     } catch (error) {
//         return false
//     }

// }

// Listar todos os usuários existentes na tabela
const selectAllUsuarios = async () => {   

    try {
        let sql = 'select id, nome, email from tbl_usuario order by id desc'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

// Buscar um usuário existente filtrando pelo ID
const selectByIdUsuario = async (id) => {

    try {
        let sql = `select id, nome, email from tbl_usuario where id = ${id}`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
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

module.exports = {
    insertUsuario,
    updateUsuario,
    updateUsuarioSenha,
    selectAllUsuarios,
    selectByIdUsuario,
    selectValidacaoUsuario,
}