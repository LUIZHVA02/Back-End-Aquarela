const produtoDAO = require('../model/DAO/produto.js')
const message = require('../modulo/config.js')
const { tratarDataBACK } = require('../modulo/tratamento.js')

const setNovoProduto = async (dadosProduto, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosProduto = {}

            if (
                dadosProduto.nome == '' || dadosProduto.nome == undefined || dadosProduto.nome.length > 100 ||
                dadosProduto.descricao == '' || dadosProduto.descricao == undefined || dadosProduto.descricao.length > 500 ||
                dadosProduto.marca_dagua == '' || dadosProduto.marca_dagua == undefined || dadosProduto.marca_dagua == null ||
                dadosProduto.item_digital == '' || dadosProduto.item_digital == undefined || dadosProduto.item_digital == null ||
                dadosProduto.preco == '' || dadosProduto.preco == undefined || dadosProduto.preco == null ||
                dadosProduto.quantidade == '' || dadosProduto.quantidade == undefined || dadosProduto.quantidade == null ||
                dadosProduto.id_usuario == '' || dadosProduto.id_usuario == undefined || dadosProduto.id_usuario == null ||
                dadosProduto.produto_status === '' || dadosProduto.produto_status === undefined || dadosProduto.produto_status ==+ null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoProduto = await produtoDAO.insertNovoProduto(dadosProduto)

                if (novoProduto) {
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

                    updateProductJson.id = id_produto
                    updateProductJson.status = message.UPDATED_ITEM.status
                    updateProductJson.status_code = message.UPDATED_ITEM.status_code
                    updateProductJson.message = message.UPDATED_ITEM.message
                    updateProductJson.usuario = productUpdate

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
          let favoritarProduto = await produtoDAO.insertCurtirProduto(dadosProduto)
  
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


const setExcluirProduto = async function (id) {
    try {

        let id_produto = id;
        let deleteProdutoJson = {}


        if (id_produto == '' || id_produto == undefined) {
            return message.ERROR_INVALID_ID;
        } else {
            const validaId = await produtoDAO.selectByIdProducts(id_produto)

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

module.exports = {
    setNovoProduto,
    getListProducts,
    setUpdateProducts,
    setExcluirProduto,
    setCurtirProduto,
    setFavoritarProduto
}