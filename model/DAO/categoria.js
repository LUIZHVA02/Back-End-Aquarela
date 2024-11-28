/****************************************************************************************************************************************************
 * Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de categorias
 * Data: 26/09/2024
 * Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
 * Versão: 1.0
 ****************************************************************************************************************************************************/

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Inserir uma nova categoria
const insertNovaCategoria = async (dadosCategoria) => {
  try {
    let sql = `insert into tbl_categoria  (   
                                                categoria,
                                                categoria_status
                                            ) 
                                            values 
                                            (
                                                '${dadosCategoria.categoria}',
                                                true
                                            )`;

    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao inserir categoria: ", error);
    console.log(error + "aqui");

    return false;
  }
};

const selectAllCategories = async () => {
  try {
    let sql = `
    select 
      c.id_categoria as id,
      c.categoria as nome
    from 
      tbl_categoria as c
    order by 
        rand();
        `;

    let resultStatus = await prisma.$queryRawUnsafe(sql);

    if (resultStatus) {
      return resultStatus;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao listar categorias: ", error);
    return false;
  }
};

const gerenciarCategoriaPostagem = async (idPostagem, idCategoria) => {
  try {
    let sql = `
        call procGerenciarCategoriaPostagem(${idPostagem}, ${idCategoria})      
    `;
    let resultStatus = await prisma.$executeRawUnsafe(sql);
    console.log(resultStatus);
    if (resultStatus) {
      return resultStatus;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao listar categorias: ", error);
    return false;
  }
};

const selectCategoriesById = async (id) => {
  try {
    let sql = `
            SELECT 
                id_categoria,
                categoria
            FROM 
                tbl_categoria
              
              where id_categoria = ${id}
            `;
    let resultStatus = await prisma.$queryRawUnsafe(sql);

    return resultStatus;
  } catch (error) {
    console.error("Erro ao listar categorias: ", error);
    return false;
  }
};

const selectCategoriesByPublicationId = async (id) => {
  try {
    let sql = `
            SELECT 
                tc.id_categoria as id,
                tc.categoria as nome
            FROM 
                tbl_categoria as tc
            INNER JOIN 
              tbl_categoria_postagem as tcp
            ON
              tc.id_categoria = tcp.id_categoria
              where tcp.id_postagem = ${id} and tcp.categoria_postagem_status = true
            `;
    let resultStatus = await prisma.$queryRawUnsafe(sql);

    return resultStatus;
  } catch (error) {
    console.error("Erro ao listar categorias: ", error);
    return false;
  }
};


const selectCategoriesByProductId = async (id) => {
  try {
    let sql = `
            SELECT 
                tc.id_categoria as id,
                tc.categoria as nome
            FROM 
                tbl_categoria as tc
            INNER JOIN 
              tbl_categoria_produto as tcp
            ON
              tc.id_categoria = tcp.id_categoria
              where tcp.id_produto = ${id} and tcp.categoria_produto_status = true
            `;
    let resultStatus = await prisma.$queryRawUnsafe(sql);

    return resultStatus;
  } catch (error) {
    console.error("Erro ao listar categorias: ", error);
    return false;
  }
};


module.exports = {
  insertNovaCategoria,
  selectAllCategories,
  selectCategoriesById,
  selectCategoriesByPublicationId,
  selectCategoriesByProductId,
  gerenciarCategoriaPostagem
};
