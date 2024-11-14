const carrinhoDAO = require('../model/DAO/carrinho.js')
const message = require("../modulo/config.js");

const setNovoCarrinho = async (dadosCarrinho, contentType) => {
    try {
        console.log(dadosCarrinho);
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosCarrinho = {}

            if (
                isNaN(dadosCarrinho.id_usuario) || dadosCarrinho.id_usuario == undefined || dadosCarrinho.id_usuario == null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoCarrinho = await chatsDAO.insertNovoCarrinho(dadosCarrinho)

                if (novoCarrinho) {
                    resultDadosCarrinho.status = message.CREATED_ITEM.status
                    resultDadosCarrinho.status_code = message.CREATED_ITEM.status_code
                    resultDadosCarrinho.status = message.CREATED_ITEM.message
                    resultDadosCarrinho.Carrinho = dadosCarrinho

                    return resultDadosCarrinho

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro ao tentar inserir Carrinho: " + error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const setNovoItemCarrinho = async (dadosCarrinho, contentType) => {
    try {
        console.log(dadosCarrinho);
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosCarrinho = {}

            if (
                
                isNaN(dadosCarrinho.id_item_carrinho) || dadosCarrinho.id_item_carrinho == undefined || dadosCarrinho.id_item_carrinho == null ||
                isNaN(dadosCarrinho.quantidade) || dadosCarrinho.quantidade == undefined || dadosCarrinho.quantidade == null ||
                isNaN(dadosCarrinho.id_produto) || dadosCarrinho.id_produto == undefined || dadosCarrinho.id_produto == null ||
                isNaN(dadosCarrinho.id_carrinho_compra) || dadosCarrinho.id_carrinho_compra == undefined || dadosCarrinho.id_carrinho_compra == null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoCarrinho = await carrinhoDAO.insertNovoItemCarrinho(dadosCarrinho)

                if (novoCarrinho) {
                    resultDadosCarrinho.status = message.CREATED_ITEM.status
                    resultDadosCarrinho.status_code = message.CREATED_ITEM.status_code
                    resultDadosCarrinho.status = message.CREATED_ITEM.message
                    resultDadosCarrinho.Carrinho = dadosCarrinho

                    return resultDadosCarrinho

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro ao tentar inserir Carrinho: " + error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListCarrinho = async () => {
    try {
      let carrinhoJSON = {};
      let carrinhoData = await carrinhoDAO.selectAllCarrinhos();
  
      if (carrinhoData) {
        if (carrinhoData.length > 0) {
          carrinhoJSON.categorias = carrinhoData;
          carrinhoJSON.quantidade = carrinhoData.length;
          carrinhoJSON.status_code = 200;
          return carrinhoJSON;
        } else {
          return message.ERROR_NOT_FOUND; // 404
        }
      } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
      }
    } catch (error) {
      console.error("Erro ao tentar inserir categoria: " + error);
      return message.ERROR_INTERNAL_SERVER;
    }
  };

module.exports = {
    setNovoCarrinho,
    setNovoItemCarrinho,
    getListCarrinho
}