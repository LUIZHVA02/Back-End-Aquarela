/****************************************************************************************************************************************************
 * Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de categorias
 * Data: 01/10/2024
 * Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
 * Versão: 1.0
 ****************************************************************************************************************************************************/

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
    console.log(sql);
    let resultStatus = await prisma.$queryRawUnsafe(sql);

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

const selectByIdPostComplete = async (idPostagem, idUsuario) => {

  try {

    let sql = `
        SELECT
          'postagem' AS tipo,
          tp.id_postagem AS id_publicacao,
          tp.nome,
          tp.descricao,
          NULL AS item_digital,
          NULL AS marca_dagua,
          NULL AS preco,
          NULL AS quantidade,
          tp.id_usuario AS id_dono_publicacao,
          CAST(CASE 
              WHEN MAX(cp.curtidas_postagem_status) = true THEN 1 
              ELSE 0 
              END AS DECIMAL) AS curtida,
          CAST(CASE 
              WHEN MAX(pf.postagem_favorita_status) = true THEN 1 
              ELSE 0 
              END AS DECIMAL) AS favorito,
          CAST(CASE 
              WHEN tp.id_usuario = ${idUsuario} THEN 
                  (SELECT COUNT(*) 
                   FROM tbl_visualizacao_postagem 
                   WHERE id_postagem = tp.id_postagem 
                   AND visualizacao_postagem_status = true)
              ELSE NULL 
              END AS DECIMAL) AS quantidade_visualizacoes
        FROM tbl_postagem AS tp
        LEFT JOIN tbl_curtida_postagem AS cp ON tp.id_postagem = cp.id_postagem AND cp.id_usuario = ${idUsuario}
        LEFT JOIN tbl_postagem_favorita AS pf ON tp.id_postagem = pf.id_postagem AND pf.id_usuario = ${idUsuario} AND pf.postagem_favorita_status = true
        WHERE tp.id_postagem = ${idPostagem}
        GROUP BY tp.id_postagem
      `
    let rsPostagem = await prisma.$queryRawUnsafe(sql)
    return rsPostagem
  } catch (error) {
    console.log(error);
    return false
  }
}


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

const insertPostagemPasta = async (dadosPostagem) => {
  try {
    let sql = `call procAdicionarPostagemPasta(${dadosPostagem.id_postagem}, ${dadosPostagem.id_pasta})`;
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

const insertPostagemCategoria = async (idPostagem, idCategoria) => {

  try {

    let sql = `INSERT INTO tbl_categoria_postagem (id_postagem, id_categoria, categoria_postagem_status)
                 VALUES
                (${idPostagem}, ${idCategoria}, TRUE)`
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

const insertPostagemImagem = async (idPostagem, idImagem) => {

  try {

    let sql = `INSERT INTO tbl_imagem_postagem (id_postagem, id_imagem, imagem_postagem_status)
                 VALUES
                (${idPostagem}, ${idImagem}, TRUE)`
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

const selectLastId = async () => {

  try {
    let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_postagem limit 1'
    let rsProduto = await prisma.$queryRawUnsafe(sql)
    return rsProduto
  } catch (error) {
    return false
  }

}

const selectComentariosPostagem = async (idPostagem) => {

  try {
    let sql = `SELECT 
                    c.id_comentario,
                    c.mensagem,
                    c.id_usuario,
                    c.id_resposta,
                    u.nome_usuario,
                    u.foto_usuario
                FROM 
                    tbl_comentario_postagem cp
                JOIN 
                    tbl_comentario c ON cp.id_comentario = c.id_comentario
                JOIN 
                    tbl_usuario u ON c.id_usuario = u.id_usuario
                WHERE 
                    cp.id_postagem = ${idPostagem}
                    AND c.comentario_status = true
                    AND u.usuario_status = true
                    AND cp.comentario_postagem_status = true
                ORDER BY c.id_comentario DESC`
    let rsPostagem = await prisma.$queryRawUnsafe(sql)
    return rsPostagem
  } catch (error) {
    return false
  }

}

const insertComentarioPostagem = async (dadosComentario) => {
  try {
    let sql = `call procAdicionarComentarioPostagem('${dadosComentario.mensagem}', ${dadosComentario.id_usuario}, ${dadosComentario.id_postagem}, ${dadosComentario.id_resposta})`;
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao adicionar comentário na postagem: ", error);
    return false;
  }
};


module.exports = {
  selectAllPosts,
  selectByIdPosts,
  selectByIdPostComplete,
  updatePosts,
  insertNovaPostagem,
  insertCurtidaPostagem,
  insertFavoritarPostagem,
  insertVisualizarPostagem,
  insertPostagemPasta,
  insertPostagemCategoria,
  insertPostagemImagem,
  selectLastId,
  selectComentariosPostagem,
  insertComentarioPostagem
}
