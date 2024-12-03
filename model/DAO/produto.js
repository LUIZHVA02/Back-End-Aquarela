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
                                                ${dadosProduto.marca_dagua},
                                                ${dadosProduto.item_digital},
                                                ${dadosProduto.preco},
                                                ${dadosProduto.quantidade}, 
                                                ${dadosProduto.id_usuario},
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
            if(typeof(dataProductUpdate[key]) === 'string'){
              sql += `${key} = '${dataProductUpdate[key]}'`
            }else{
              sql += `${key} = ${dataProductUpdate[key]}`
            }
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

const selectByIdProduct = async (id) => {

    try {
        let sql = `select * from tbl_produto where id_produto = ${id} and produto_status = "1"`
        let rsProduto = await prisma.$queryRawUnsafe(sql)
        return rsProduto
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectByIdProductComplete = async (idProduto, idUsuario) => {

    try {      

        let sql = `
          SELECT
            'produto' AS tipo,
            tp.id_produto AS id_publicacao,
            tp.nome,
            tp.descricao,
            tp.item_digital,
            tp.marca_dagua,
            tp.preco,
            tp.quantidade,
            tp.id_usuario AS id_dono_publicacao,
            CAST(CASE 
                WHEN MAX(cp.curtidas_produto_status) = true THEN 1 
                ELSE 0 
                END AS DECIMAL) AS curtida,
            CAST(CASE 
                WHEN MAX(pf.produto_favorito_status) = true THEN 1 
                ELSE 0 
                END AS DECIMAL) AS favorito,
            CAST(CASE 
                WHEN tp.id_usuario = ${idUsuario} THEN 
                    (SELECT COUNT(*) 
                    FROM tbl_visualizacao_produto 
                    WHERE id_produto = tp.id_produto 
                    AND visualizacao_produto_status = true)
                ELSE NULL 
                END AS DECIMAL) AS quantidade_visualizacoes
          FROM tbl_produto AS tp
          LEFT JOIN tbl_curtida_produto AS cp ON tp.id_produto = cp.id_produto AND cp.id_usuario = ${idUsuario}
          LEFT JOIN tbl_produto_favorito AS pf ON tp.id_produto = pf.id_produto AND pf.id_usuario = ${idUsuario} AND pf.produto_favorito_status = true
          WHERE tp.id_produto = ${idProduto}
          GROUP BY tp.id_produto
        `        
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
      let sql = `call procFavoritarProduto(${dadosProduto.id_produto}, ${dadosProduto.id_usuario})`;
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

const insertVisualizarProduto = async (dadosProduto) => {
    try {
      let sql = `call procVisualizarProduto(${dadosProduto.id_produto}, ${dadosProduto.id_usuario})`;
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

const insertProdutoPasta = async (dadosProduto) => {
  try {
    let sql = `call procAdicionarProdutoPasta(${dadosProduto.id_produto}, ${dadosProduto.id_pasta})`;
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao adicionar produto na pasta: ", error);

    console.log(error + "aqui");

    return false;
  }
}

const insertComentarioProduto = async (dadosComentario) => {
  try {
    let sql = `call procAdicionarComentarioProduto('${dadosComentario.mensagem}', ${dadosComentario.id_usuario}, ${dadosComentario.id_produto}, ${dadosComentario.id_resposta})`;
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao adicionar comentário no produto: ", error);

    console.log(error + "aqui");

    return false;
  }
}

const selectLastId = async () => {

  try {
      let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_produto limit 1'
      let rsProduto = await prisma.$queryRawUnsafe(sql)
      return rsProduto
  } catch (error) {
      return false
  }

}

const selectComentariosProduto = async (idProduto) => {

  try {
      let sql = `select 
                    c.id_comentario,
                    c.mensagem,
                    c.id_usuario,
                    c.id_resposta,
                    u.nome_usuario,
                    u.foto_usuario
                from 
                    tbl_comentario_produto cp
                join 
                    tbl_comentario c on cp.id_comentario = c.id_comentario
                join 
                    tbl_usuario u on c.id_usuario = u.id_usuario
                where 
                    cp.id_produto = ${idProduto}
                    and c.comentario_status = true
                    and u.usuario_status = true
                    and cp.comentario_produto_status = true
                ORDER BY c.id_comentario DESC`
      let rsProduto = await prisma.$queryRawUnsafe(sql)
      return rsProduto
  } catch (error) {
      return false
  }

}

const insertProdutoCategoria = async (idProduto, idCategoria) => {

  try {

      let sql = `INSERT INTO tbl_categoria_produto (id_produto, id_categoria, categoria_produto_status)
                 VALUES
                (${idProduto}, ${idCategoria}, TRUE)`
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

const insertProdutoImagem = async (idProduto, idImagem) => {

  try {

      let sql = `INSERT INTO tbl_imagem_produto (id_produto, id_imagem, imagem_produto_status)
                 VALUES
                (${idProduto}, ${idImagem}, TRUE)`
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


module.exports = {
  insertNovoProduto,
  selectAllProducts,
  updateProduct,
  selectByIdProduct,
  insertCurtirProduto,
  insertFavoritarProduto,
  selectByIdProductComplete,
  insertVisualizarProduto,
  insertProdutoPasta,
  insertProdutoCategoria,
  insertComentarioProduto,
  selectComentariosProduto,
  insertProdutoImagem,
  selectLastId
}