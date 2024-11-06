/****************************************************************************************************************************************************
 * Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de categorias
 * Data: 01/10/2024
 * Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
 * Versão: 1.0
 ****************************************************************************************************************************************************/

const { PrismaClient } = require("@prisma/client");
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
                                              '${dadosPostagem.descricao}',
                                              '${dadosPostagem.id_usuario}',
                                              true
                                          )`;
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao inserir postagem: ", error);

    console.log(error + "aqui");

    return false;
  }
};

const selectAllPosts = async (id) => {
  try {
    let sql = `
        SELECT 
            'produto' AS tipo,
            p.id_produto AS id,
            p.nome,
            p.descricao,
            p.marca_dagua,
            p.item_digital,
            p.preco,
            p.quantidade
        FROM 
            tbl_produto as p
        WHERE 
            id_usuario = ${id}
        AND 
          p.produto_status = true

        UNION ALL

        SELECT 
            'postagem' AS tipo,
            po.id_postagem AS id,
            po.nome,
            po.descricao, 
          NULL AS marca_dagua,
            NULL AS item_digital,
            NULL AS preco,
            NULL AS quantidade
        FROM 
            tbl_postagem as po
        WHERE 
            po.id_usuario = ${id}
        AND 
          po.postagem_status = true;

      `;

    let resultStatus = await prisma.$queryRawUnsafe(sql);
    console.log(resultStatus);
    if (resultStatus) {
      return resultStatus;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    
    return false;
  }
};

const selectByIdPosts = async (id) => {
  try {
    let sql = `select * from tbl_postagem where id_postagem = ${id}`;
    let rsPosts = await prisma.$queryRawUnsafe(sql);
    return rsPosts;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const updatePosts = async function (id, dadosPostagem) {
  try {
    let sql = `UPDATE tbl_postagem SET `;
    const keys = Object.keys(dadosPostagem);

    keys.forEach((key, index) => {
      sql += `${key} = '${dadosPostagem[key]}'`;
      if (index !== keys.length - 1) {
        sql += `, `;
      }
    });

    sql += ` WHERE id_postagem = ${id}`;

    let result = await prisma.$executeRawUnsafe(sql);

    console.log(sql);

    return result;
  } catch (error) {
    console.log(error);
    return false;
  }

}

const insertCurtidaPostagem = async (dadosPostagem) => {
  try {
    let sql = `call procCurtirPostagem(${dadosPostagem.id_postagem}, ${dadosPostagem.id_usuario})`;
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao curtir postagem: ", error);

    console.log(error + "aqui");

    return false;
  }
};

const insertFavoritarPostagem = async (dadosPostagem) => {
  try {
    let sql = `call procFavoritarPostagem(${dadosPostagem.id_postagem}, ${dadosPostagem.id_usuario})`;
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao curtir postagem: ", error);

    console.log(error + "aqui");

    return false;
  }
};

const insertVisualizarPostagem = async (dadosPostagem) => {
  try {
    let sql = `call procVisualizarPostagem(${dadosPostagem.id_postagem}, ${dadosPostagem.id_usuario})`;
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao visualizar postagem: ", error);

    console.log(error + "aqui");

    return false;
  }
};

module.exports = {
  insertNovaPostagem,
  selectAllPosts,
  selectByIdPosts,
  updatePosts,
  insertCurtidaPostagem,
  insertFavoritarPostagem,
  insertVisualizarPostagem
}
