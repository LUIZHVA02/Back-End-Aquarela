const carrinhoDAO = require('../model/DAO/carrinho.js')
const message = require("../modulo/config.js");

const setNovoCarrinho = async (dadosCarrinho, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosCarrinho = {}

            if (
                isNaN(dadosCarrinho.id_usuario) || dadosCarrinho.id_usuario == undefined || dadosCarrinho.id_usuario == null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoCarrinho = await carrinhoDAO.insertNovoCarrinho(dadosCarrinho)
                let idCarrinho = await carrinhoDAO.selectLastIdCarrinho()
                
                if(idCarrinho){
                    dadosCarrinho.id_carrinho_compra = idCarrinho[0].id
                }

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
        console.log(error);
        
        return message.ERROR_INTERNAL_SERVER
    }
}

const setNovoItemCarrinho = async (dadosItemCarrinho, contentType) => {
    try {
        console.log(dadosItemCarrinho);
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosItemCarrinho = {}

            if (
                isNaN(dadosItemCarrinho.quantidade) || dadosItemCarrinho.quantidade == undefined || dadosItemCarrinho.quantidade == null ||
                isNaN(dadosItemCarrinho.id_produto) || dadosItemCarrinho.id_produto == undefined || dadosItemCarrinho.id_produto == null ||
                isNaN(dadosItemCarrinho.id_carrinho_compra) || dadosItemCarrinho.id_carrinho_compra == undefined || dadosItemCarrinho.id_carrinho_compra == null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoItemCarrinho = await carrinhoDAO.insertNovoItemCarrinho(dadosItemCarrinho)
                let idItemCarrinho = await carrinhoDAO.selectLastIdItemCarrinho()
                
                if(idItemCarrinho){
                    dadosItemCarrinho.id_Itemcarrinho_compra = idItemCarrinho[0].id
                }

                if (novoItemCarrinho) {
                    resultDadosItemCarrinho.status = message.CREATED_ITEM.status
                    resultDadosItemCarrinho.status_code = message.CREATED_ITEM.status_code
                    resultDadosItemCarrinho.status = message.CREATED_ITEM.message
                    resultDadosItemCarrinho.ItemCarrinho = dadosItemCarrinho

                    return resultDadosItemCarrinho

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro ao tentar inserir ItemCarrinho: " + error);
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

const getListItensCarrinhoById = async (id) => {
    let id_carrinho = id
    try {
      let ItemcarrinhoJSON = {};
      let ItemcarrinhoData = await carrinhoDAO.selectAllItensCarrinho(id_carrinho);
  
      if (ItemcarrinhoData) {
        if (ItemcarrinhoData.length > 0) {
          ItemcarrinhoJSON.categorias = ItemcarrinhoData;
          ItemcarrinhoJSON.quantidade = ItemcarrinhoData.length;
          ItemcarrinhoJSON.status_code = 200;
          return ItemcarrinhoJSON;
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
    getListCarrinho,
    getListItensCarrinhoById
}