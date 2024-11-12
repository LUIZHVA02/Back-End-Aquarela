const chatsDAO = require('../model/DAO/chats.js')
const message = require('../modulo/config.js')

const setNovaConversa = async (dadosConversa, contentType) => {
    try {
        console.log(dadosConversa);
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosConversa = {}

            if (
                isNaN(dadosConversa.id_usuario_1) || dadosConversa.id_usuario_1 == undefined || dadosConversa.id_usuario_1 == null ||
                isNaN(dadosConversa.id_usuario_1) || dadosConversa.id_usuario_2 == undefined || dadosConversa.id_usuario_2 == null
            ) {
                console.log(dadosConversa);

                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoProduto = await chatsDAO.insertNovaConversa(dadosConversa)

                if (novoProduto) {
                    resultDadosConversa.status = message.CREATED_ITEM.status
                    resultDadosConversa.status_code = message.CREATED_ITEM.status_code
                    resultDadosConversa.status = message.CREATED_ITEM.message
                    resultDadosConversa.produto = dadosConversa

                    return resultDadosConversa

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro ao tentar inserir Conversa: " + error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListConversas = async () =>{

    try {
        
        
    } catch (error) {

        console.log(error);
        
        return false
    }
}


module.exports = {
    setNovaConversa,
    getListConversas
}