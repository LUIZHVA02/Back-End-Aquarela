const produtoDAO = require('../model/DAO/produto.js')
const categoriaDAO = require('../model/DAO/categoria.js')
const imagemDAO = require('../model/DAO/image.js')
const userDAO = require('../model/DAO/user.js')
const message = require('../modulo/config.js')
const { tratarDataBACK } = require('../modulo/tratamento.js')

const setNovoProduto = async (dadosProduto, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {

      let resultDadosProduto = {}

      if (
        dadosProduto.nome == '' || dadosProduto.nome == undefined || dadosProduto.nome.length > 100 ||
        dadosProduto.descricao == '' || dadosProduto.descricao == undefined || dadosProduto.descricao.length > 500 ||
        dadosProduto.marca_dagua === '' || dadosProduto.marca_dagua === undefined || dadosProduto.marca_dagua === null ||
        dadosProduto.item_digital === '' || dadosProduto.item_digital === undefined || dadosProduto.item_digital === null ||
        dadosProduto.preco == '' || dadosProduto.preco == undefined || dadosProduto.preco == null ||
        dadosProduto.quantidade == '' || dadosProduto.quantidade == undefined || dadosProduto.quantidade == null ||
        dadosProduto.id_usuario == '' || dadosProduto.id_usuario == undefined || dadosProduto.id_usuario == null ||
        dadosProduto.categorias.length == 0 || dadosProduto.imagens.length == 0
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {

        let novoProduto = await produtoDAO.insertNovoProduto(dadosProduto)

        if (novoProduto) {

          let idProduto = await produtoDAO.selectLastId()
          let id = Number(idProduto[0].id)

          let categoriasARRAY = []
          let imagensARRAY = []

          const categoriaPromise = dadosProduto.categorias.map(async (categoriaId) => {

            const validaCategoria = await categoriaDAO.selectCategoriesById(categoriaId)

            if (validaCategoria) {
              const categoriaProduto = await produtoDAO.insertProdutoCategoria(id, categoriaId)
              if (categoriaProduto) {
                categoriasARRAY.push(validaCategoria[0])
              }
            }

          })

          const imagePromisse = dadosProduto.imagens.map(async (imagemData) => {

            const imagem = await imagemDAO.insertImage(imagemData.url)

            if (imagem) {

              let idImagemResp = await imagemDAO.selectLastId()
              let idImagem = Number(idImagemResp[0].id)

              const imageProduto = await produtoDAO.insertProdutoImagem(id, idImagem)

              if (imageProduto) {

                const imagemById = await imagemDAO.selectByIdImagem(idImagem)
                imagensARRAY.push(imagemById[0])

              }
            }

          })

          await Promise.all(categoriaPromise)
          await Promise.all(imagePromisse)

          dadosProduto.categorias = categoriasARRAY
          dadosProduto.imagens = imagensARRAY

          resultDadosProduto.status = message.CREATED_ITEM.status
          resultDadosProduto.status_code = message.CREATED_ITEM.status_code
          resultDadosProduto.status = message.CREATED_ITEM.message
          resultDadosProduto.produto = dadosProduto

          return resultDadosProduto

        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao tentar inserir produto: " + error);
    return message.ERROR_INTERNAL_SERVER
  }
}

const getListProducts = async () => {
  try {

    let productJSON = {}
    let dadosProduto = await produtoDAO.selectAllProducts()

    if (dadosProduto) {

      if (dadosProduto.length > 0) {
        productJSON.address = dadosProduto
        productJSON.quantity = dadosProduto.length
        productJSON.status_code = 200
        return productJSON
      } else {
        console.log(dadosProduto.length, "getListProducts");

        return message.ERROR_NOT_FOUND
      }
    } else {
      return message.ERROR_INTERNAL_SERVER_DB
    }
  } catch (error) {
    console.log(error);

    message.ERROR_INTERNAL_SERVER
  }
}

const getBuscarProduto = async (idProduto, idCliente) => {

  try {

    let produtoJSON = {}
    let validaCliente = await userDAO.selectByIdUsuarioAtivo(idCliente)

    if (idProduto == '' || idProduto == undefined || isNaN(idProduto) || validaCliente.length == 0) {

      return message.ERROR_INVALID_ID // 400

    } else {

      let dadosProduto = await produtoDAO.selectByIdProductComplete(idProduto, idCliente)

      if (dadosProduto) {

        if (dadosProduto.length > 0) {

          let donoPublicacao = await userDAO.selectByIdUsuarioFollowing(dadosProduto[0].id_dono_publicacao, idCliente)
          dadosProduto[0].dono_publicacao = donoPublicacao[0]

          let imagens = await userDAO.selectImages(idProduto, dadosProduto[0].tipo)
          dadosProduto[0].imagens = imagens

          let comentarios = await produtoDAO.selectComentariosProduto(idProduto)
          dadosProduto[0].comentarios = comentarios

          let categorias = await categoriaDAO.selectCategoriesByProductId(idProduto)
          dadosProduto[0].categorias = categorias

          produtoJSON.produto = dadosProduto
          produtoJSON.status_code = 200
          return produtoJSON

        } else {
          return message.ERROR_NOT_FOUND // 404
        }

      } else {
        return message.ERROR_INTERNAL_SERVER_DB // 500
      }
    }

  } catch (error) {
    message.ERROR_INTERNAL_SERVER // 500
  }

}

const setUpdateProducts = async (dadosProduto, contentType, id_product) => {
  if (String(contentType).toLowerCase() == 'application/json') {

    let updateProductJson = {}
    try {

      const validaId = await getListProducts(id_product)

      if (validaId.status != false) {

        let id_produto = id_product
        let nome = dadosProduto.nome
        let descricao = dadosProduto.descricao
        let marca_dagua = dadosProduto.marca_dagua
        let item_digital = dadosProduto.item_digital
        let preco = dadosProduto.preco
        let quantidade = dadosProduto.quantidade
        let id_usuario = dadosProduto.id_usuario
        let product_status = dadosProduto.product_status

        if (
          nome != '' &&
          nome != undefined &&
          nome != null &&
          nome.length < 100
        ) {
          updateProductJson.nome = nome.replace(/'/g, "|")
        } else if (
          nome == '' &&
          nome == undefined &&
          nome == null
        ) { }

        if (
          descricao != '' &&
          descricao != undefined &&
          descricao != null &&
          descricao.length == 500
        ) {
          updateProductJson.descricao = descricao
        } else if (
          descricao == '' &&
          descricao == undefined &&
          descricao == null
        ) { }

        if (
          marca_dagua != '' &&
          marca_dagua != undefined &&
          marca_dagua != null
        ) {
          updateProductJson.marca_dagua = marca_dagua
        } else if (
          marca_dagua == '' &&
          marca_dagua == undefined &&
          marca_dagua == null
        ) { }

        if (
          item_digital != '' &&
          item_digital != undefined &&
          item_digital != null
        ) {
          updateProductJson.item_digital = item_digital
        } else if (
          item_digital == '' &&
          item_digital == undefined &&
          item_digital == null
        ) { }

        if (
          preco != '' &&
          preco != undefined &&
          preco != null &&
          preco.length == 50
        ) {
          updateProductJson.preco = preco
        } else if (
          preco == '' &&
          preco == undefined &&
          preco == null
        ) { }

        if (
          quantidade != '' &&
          quantidade != undefined &&
          quantidade != null
        ) {
          updateProductJson.quantidade = quantidade
        } else if (
          quantidade == '' &&
          quantidade == undefined &&
          quantidade == null
        ) { }

        if (
          id_usuario != '' &&
          id_usuario != undefined &&
          id_usuario != null &&
          id_usuario.length < 11
        ) {
          updateProductJson.id_usuario = id_usuario
        } else if (
          id_usuario == '' &&
          id_usuario == undefined &&
          id_usuario == null
        ) { }

        if (
          product_status != '' &&
          product_status != undefined &&
          product_status != null
        ) {
          updateProductJson.product_status = product_status
        } else if (
          product_status == '' &&
          product_status == undefined &&
          product_status == null
        ) { }



        const productUpdate = await produtoDAO.updateProduct(id_produto, updateProductJson)

        if (productUpdate) {

          const categoriasSelecionadas = dadosProduto.categorias;
          const categoriasProduto = await categoriaDAO.selectCategoriesByProductId(id_produto);
          const iDscategoriasProduto = categoriasProduto.map(categoria => categoria.id);
          
          const gerenciarPromise = iDscategoriasProduto.map(async categoria => {
            if (!categoriasSelecionadas.includes(categoria)) {
              await categoriaDAO.gerenciarCategoriaProduto(id_produto, categoria);
            }
          })

          const adicionarPromise = categoriasSelecionadas.map(async categoria => {
            if (!iDscategoriasProduto.includes(categoria)) {
              await categoriaDAO.gerenciarCategoriaProduto(id_produto, categoria);
            }
          })

          await Promise.all([...gerenciarPromise, ...adicionarPromise])


          updateProductJson.id = id_produto
          updateProductJson.status = message.UPDATED_ITEM.status
          updateProductJson.status_code = message.UPDATED_ITEM.status_code
          updateProductJson.message = message.UPDATED_ITEM.message
          updateProductJson.produto = productUpdate

          return updateProductJson
        } else {

          console.log(productUpdate);

          return message.ERROR_INTERNAL_SERVER_DB
        }
      } else {
        return message.ERROR_NOT_FOUND
      }

    } catch (error) {

      console.log(error, "model/DAO/controller-produto.js => setUpdateProducts");

      return message.ERROR_INTERNAL_SERVER_DB
    }
  } else {
    return message.ERROR_CONTENT_TYPE
  }
}

const setCurtirProduto = async (dadosProduto, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {

      let resultDadosProduto = {}

      if (
        dadosProduto.id_produto == '' || dadosProduto.id_produto == undefined || dadosProduto.id_produto == null ||
        dadosProduto.id_usuario == '' || dadosProduto.id_usuario == undefined || dadosProduto.id_usuario == null
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let curtirProduto = await produtoDAO.insertCurtirProduto(dadosProduto)

        if (curtirProduto) {
          resultDadosProduto.status = message.CREATED_ITEM.status
          resultDadosProduto.status_code = message.CREATED_ITEM.status_code
          resultDadosProduto.status = message.CREATED_ITEM.message
          resultDadosProduto.produto = dadosProduto

          return resultDadosProduto

        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao tentar curtir postagem: " + error);

    return message.ERROR_INTERNAL_SERVER
  }
}

const setFavoritarProduto = async (dadosProduto, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {

      let resultDadosProduto = {}

      if (
        dadosProduto.id_produto == '' || dadosProduto.id_produto == undefined || dadosProduto.id_produto == null ||
        dadosProduto.id_usuario == '' || dadosProduto.id_usuario == undefined || dadosProduto.id_usuario == null
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let favoritarProduto = await produtoDAO.insertFavoritarProduto(dadosProduto)

        if (favoritarProduto) {
          resultDadosProduto.status = message.CREATED_ITEM.status
          resultDadosProduto.status_code = message.CREATED_ITEM.status_code
          resultDadosProduto.status = message.CREATED_ITEM.message
          resultDadosProduto.produto = dadosProduto

          return resultDadosProduto

        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao tentar favoritar postagem: " + error);

    return message.ERROR_INTERNAL_SERVER
  }
}

const setVisualizarProduto = async (dadosProduto, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {

      let resultDadosVisualizar = {}

      if (
        dadosProduto.id_produto == '' || dadosProduto.id_produto == undefined || dadosProduto.id_produto == null ||
        dadosProduto.id_usuario == '' || dadosProduto.id_usuario == undefined || dadosProduto.id_usuario == null
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let visualizarProduto = await produtoDAO.insertVisualizarProduto(dadosProduto)

        if (visualizarProduto) {
          resultDadosVisualizar.status = message.CREATED_ITEM.status
          resultDadosVisualizar.status_code = message.CREATED_ITEM.status_code
          resultDadosVisualizar.status = message.CREATED_ITEM.message
          resultDadosVisualizar.produto = dadosProduto

          return resultDadosVisualizar

        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao tentar visualizar produto: " + error);

    return message.ERROR_INTERNAL_SERVER
  }
}

const setExcluirProduto = async function (id) {
  try {

    let id_produto = id;
    let deleteProdutoJson = {}


    if (id_produto == '' || id_produto == undefined) {
      return message.ERROR_INVALID_ID;
    } else {
      const validaId = await produtoDAO.selectByIdProduct(id_produto)

      console.log(validaId);


      if (validaId.length > 0) {

        let produto_status = "0"

        deleteProdutoJson.produto_status = produto_status

        let dadosProduto = await produtoDAO.updateProduct(id_produto, deleteProdutoJson)

        if (dadosProduto) {
          return message.DELETED_ITEM
        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }

      } else {
        return message.ERROR_NOT_FOUND
      }
    }
  } catch (error) {
    return message.ERROR_INTERNAL_SERVER
  }

}

const setAdicionarProdutoPasta = async (dadosProduto, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {

      let resultProdutoPasta = {}

      if (
        dadosProduto.id_produto == '' || dadosProduto.id_produto == undefined || dadosProduto.id_produto == null ||
        dadosProduto.id_pasta == '' || dadosProduto.id_pasta == undefined || dadosProduto.id_pasta == null
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let adicionarProduto = await produtoDAO.insertProdutoPasta(dadosProduto)

        if (adicionarProduto) {
          resultProdutoPasta.status = message.CREATED_ITEM.status
          resultProdutoPasta.status_code = message.CREATED_ITEM.status_code
          resultProdutoPasta.status = message.CREATED_ITEM.message
          resultProdutoPasta.produto = dadosProduto

          return resultProdutoPasta

        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao tentar adicionar produto na pasta: " + error);

    return message.ERROR_INTERNAL_SERVER
  }
}

const setComentarProduto = async (dadosComentario, contentType) => {
  try {

    if (String(contentType).toLowerCase() == 'application/json') {

      let resultComentarioProduto = {}

      if (
        dadosComentario.mensagem == '' || dadosComentario.mensagem == undefined || dadosComentario.mensagem == null ||
        dadosComentario.id_usuario == '' || dadosComentario.id_usuario == undefined || dadosComentario.id_usuario == null ||
        dadosComentario.id_produto == '' || dadosComentario.id_produto == undefined || dadosComentario.id_produto == null ||
        dadosComentario.id_resposta === undefined
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let adicionarComentario = await produtoDAO.insertComentarioProduto(dadosComentario)

        if (adicionarComentario) {
          resultComentarioProduto.status = message.CREATED_ITEM.status
          resultComentarioProduto.status_code = message.CREATED_ITEM.status_code
          resultComentarioProduto.status = message.CREATED_ITEM.message
          resultComentarioProduto.comentario = dadosComentario

          return resultComentarioProduto

        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao tentar comentar no produto: " + error);

    return message.ERROR_INTERNAL_SERVER
  }
}

module.exports = {
  setNovoProduto,
  getListProducts,
  getBuscarProduto,
  setUpdateProducts,
  setExcluirProduto,
  setCurtirProduto,
  setFavoritarProduto,
  setVisualizarProduto,
  setAdicionarProdutoPasta,
  setComentarProduto
}