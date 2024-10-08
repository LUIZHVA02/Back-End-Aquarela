const categoriaDAO = require('../model/DAO/categoria.js')
const message = require('../modulo/config.js')
const { tratarDataBACK } = require('../modulo/tratamento.js')

const setNovaCategoria = async (dadosCategoria, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosCategoria = {}

            if (
                dadosCategoria.categoria == '' || dadosCategoria.categoria == undefined || dadosCategoria.categoria.length > 255 ||
                dadosCategoria.categoria_status == '' || dadosCategoria.categoria_status == undefined || dadosCategoria.categoria_status == null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novaCategoria = await categoriaDAO.insertNovaCategoria(dadosCategoria)

                if (novaCategoria) {
                    resultDadosCategoria.status = message.CREATED_ITEM.status
                    resultDadosCategoria.status_code = message.CREATED_ITEM.status_code
                    resultDadosCategoria.status = message.CREATED_ITEM.message
                    resultDadosCategoria.categoria = dadosCategoria

                    return resultDadosCategoria

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro ao tentar inserir categoria: " + error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListCategories = async() => {
    try {
        
        let categoriesJSON = {}
        let categoriesData = await categoriaDAO.selectAllCategoriesByPostQuantity()

        if(categoriesData){
            if(categoriesData.length > 0) {
                categoriesJSON.categorias = categoriesData
                categoriesJSON.quantidade = categoriesData.length
                categoriesJSON.status_code = 200
                return categoriesJSON
            
            }else{

                return message.ERROR_NOT_FOUND // 404

            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }


    } catch (error) {
        console.error("Erro ao tentar inserir categoria: " + error);
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    setNovaCategoria,
    getListCategories
}