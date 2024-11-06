/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de produtos
* Data: 26/09/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir um novo Produto
const insertNovoProduto = async (dadosProduto) => {

    try {

        let sql = `insert into tbl_produto  (   nome, 
                                                descricao, 
                                                marca_dagua, 
                                                item_digital, 
                                                preco, 
                                                quantidade,
                                                id_usuario,
                                                produto_status
                                            ) 
                                            values 
                                            (
                                                '${dadosProduto.nome}', 
                                                '${dadosProduto.descricao}', 
                                                true,
                                                true,
                                                '${dadosProduto.preco}',
                                                '${dadosProduto.quantidade}', 
                                                '${dadosProduto.id_usuario}',
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
        console.error("Erro ao inserir produto: ", error);

        console.log(error + "aqui");

        return false
    }

}

const selectAllProducts = async () => {

    try {
        let sql = `select * from tbl_produto where produto_status = "1"`
        let rsProduto = await prisma.$queryRawUnsafe(sql)

        return rsProduto

    } catch (error) {

        console.log(error);

        return false
    }

}

const updateProduct = async function (id, dataProductUpdate) {
    try {
        let sql = `UPDATE tbl_produto SET `
        const keys = Object.keys(dataProductUpdate)

        keys.forEach((key, index) => {
            sql += `${key} = '${dataProductUpdate[key]}'`
            if (index !== keys.length - 1) {
                sql += `, `
            }
            console.log(sql);
        })

        sql += ` WHERE id_produto = ${id};`

        let result = await prisma.$executeRawUnsafe(sql)

        console.log(result);

        return result

    } catch (error) {

        console.log(error);

        return false
    }

}

const selectByIdProducts = async (id) => {

    try {
        let sql = `select * from tbl_produto where id_produto = ${id} and produto_status = "1"`
        let rsProduto = await prisma.$queryRawUnsafe(sql)
        return rsProduto
    } catch (error) {
        console.log(error);
        return false
    }
}

const insertCurtirProduto = async (dadosProduto) => {
    try {
      let sql = `call procCurtirProduto(${dadosProduto.id_produto}, ${dadosProduto.id_usuario})`;
      let resultStatus = await prisma.$executeRawUnsafe(sql);
  
      if (resultStatus) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao curtir produto: ", error);
  
      console.log(error + "aqui");
  
      return false;
    }
};

const insertFavoritarProduto = async (dadosProduto) => {
    try {
      let sql = `call procCurtirProduto(${dadosProduto.id_produto}, ${dadosProduto.id_usuario})`;
      let resultStatus = await prisma.$executeRawUnsafe(sql);
  
      if (resultStatus) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao favoritar produto: ", error);
  
      console.log(error + "aqui");
  
      return false;
    }
};

module.exports = {
    insertNovoProduto,
    selectAllProducts,
    updateProduct,
    selectByIdProducts,
    insertCurtirProduto
}