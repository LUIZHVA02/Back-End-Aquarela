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

                if (idCarrinho) {
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
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosItemCarrinho = {}

            if (
                isNaN(dadosItemCarrinho.id_usuario) || dadosItemCarrinho.id_usuario == undefined || dadosItemCarrinho.id_usuario == null ||
                isNaN(dadosItemCarrinho.quantidade) || dadosItemCarrinho.quantidade == undefined || dadosItemCarrinho.quantidade == null ||
                isNaN(dadosItemCarrinho.id_produto) || dadosItemCarrinho.id_produto == undefined || dadosItemCarrinho.id_produto == null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let validaCarrinho = await getCarrinhoByIdUsuario(dadosItemCarrinho.id_usuario)
                
                if (validaCarrinho.status_code == 200) {
                    
                    dadosItemCarrinho.id_carrinho_compra = validaCarrinho.carrinho[0].id_carrinho_compra
                    
                    let novoItemCarrinho = await carrinhoDAO.insertNovoItemCarrinho(dadosItemCarrinho)
                    let idItemCarrinho = await carrinhoDAO.selectLastIdItemCarrinho(dadosItemCarrinho.id_carrinho_compra)

                    if (idItemCarrinho) {
                        dadosItemCarrinho.id_Item_carrinho_compra = idItemCarrinho[0].id
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


                if (validaCarrinho.status_code == 404) {
                    let novoCarrinho = await carrinhoDAO.insertNovoCarrinho(dadosItemCarrinho)
                    if (novoCarrinho) {
                        console.log(dadosItemCarrinho, "sou eu meu mano");
                        
                        let idCarrinho = await carrinhoDAO.selectLastIdCarrinho()

                        if (idCarrinho) {
                            dadosItemCarrinho.id_carrinho_compra = idCarrinho[0].id
                        }                        

                        let novoItemCarrinho = await carrinhoDAO.insertNovoItemCarrinho(dadosItemCarrinho)
                        let idItemCarrinho = await carrinhoDAO.selectLastIdItemCarrinho(dadosItemCarrinho.id_carrinho_compra)                        

                        if (idItemCarrinho) {
                            dadosItemCarrinho.id_Item_carrinho_compra = idItemCarrinho[0].id
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
                    else {
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_DB;
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro ao tentar inserir ItemCarrinho: " + error);
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListCarrinho = async () => {
    try {
        let carrinhoJSON = {};
        let carrinhoData = await carrinhoDAO.selectAllCarrinhos();

        if (carrinhoData) {
            if (carrinhoData.length > 0) {
                carrinhoJSON.carrinho = carrinhoData;
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
        let itemcarrinhoJSON = {};
        let itemcarrinhoData = await carrinhoDAO.selectAllItensCarrinho(id_carrinho);

        if (itemcarrinhoData) {
            if (itemcarrinhoData.length > 0) {
                itemcarrinhoJSON.carrinho = itemcarrinhoData;
                itemcarrinhoJSON.quantidade = itemcarrinhoData.length;
                itemcarrinhoJSON.status_code = 200;
                return itemcarrinhoJSON;
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

const getCarrinhoByIdUsuario = async (id) => {
    let id_usuario = id
    try {
        let carrinhoJSON = {};
        let carrinhoData = await carrinhoDAO.selectCarrinhoByIdusuario(id_usuario);

        if (carrinhoData) {
            if (carrinhoData.length > 0) {
                carrinhoJSON.carrinho = carrinhoData;
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
    getListCarrinho,
    getListItensCarrinhoById,
    getCarrinhoByIdUsuario
}