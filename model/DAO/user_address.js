/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de categorias
* Data: 03/10/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insertUserAddress = async(id_endereco, id_usuario) => {
    try {
        let sql = `INSERT INTO tbl_usuario_endereco (id_endereco, id_usuario, usuario_endereco_status) VALUES (${id_endereco}, ${id_usuario}, 1);`

        let rs = await prisma.$executeRawUnsafe(sql)
        
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports={
    insertUserAddress
}