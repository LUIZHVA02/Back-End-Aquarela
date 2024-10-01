/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de categorias
* Data: 01/10/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insertNovaPostagem = async (dadosPostagem) => {

  try {

    let sql = `insert into tbl_postagem  (   
                                              nome,
                                              descricao,
                                              id_usuario,
                                              postagem_status
                                          ) 
                                          values 
                                          (
                                              '${dadosPostagem.nome}',
                                              '${dadosPostagem.seguidor}',
                                              '${dadosPostagem.id_usuario}',
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
    console.error("Erro ao inserir postagem: ", error);

    console.log(error + "aqui");

    return false
  }
}

const selectAllPosts = async () => {

    try {
        let sql = `select * from tbl_postagem`
        let rsPosts = await prisma.$queryRawUnsafe(sql)

        return rsPosts

    } catch (error) {
        console.log(error);
        return false
    }
}

const selectByIdPosts = async (id) => {

  try {
      let sql = `select * from tbl_postagem where id_postagem = ${id}`
      let rsPosts = await prisma.$queryRawUnsafe(sql)
      return rsPosts
  } catch (error) {
      console.log(error);
      return false
  }

}

const updatePosts = async function (id, dadosPostagem) {
  try {
      let sql = `UPDATE tbl_postagem SET `
      const keys = Object.keys(dadosPostagem)

      keys.forEach((key, index) => {
          sql += `${key} = '${dadosPostagem[key]}'`
          if (index !== keys.length - 1) {
              sql += `, `
          }
      })

      sql += ` WHERE id_postagem = ${id}`

      let result = await prisma.$executeRawUnsafe(sql)

      console.log(sql);
      

      return result

  } catch (error) {
      console.log(error);
      return false
  }

}


module.exports = {
  insertNovaPostagem,
  selectAllPosts,
  selectByIdPosts,
  updatePosts
}