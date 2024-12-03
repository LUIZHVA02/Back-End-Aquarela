const comentarioDAO = require('../model/DAO/comentario.js')
const message = require('../modulo/config.js')

const setExcluirComentario = async function (id) {
    try {

        let idComentario = id;

        if (idComentario == '' || idComentario == undefined || isNaN(idComentario)) {
            return message.ERROR_INVALID_ID;
        } else {

            let validaId = await comentarioDAO.selectComentarioById(idComentario);

            if (validaId.length > 0) {

                let dadosComentario = await comentarioDAO.deleteComentario(idComentario)

                if (dadosComentario) {
                    return message.DELETED_ITEM
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }

            } else {
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }

}

const updateComentario = async (dadosComentario, contentType, id) => {
    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let comentarioJSON = {}

            if (
                dadosComentario.mensagem == '' || dadosComentario.mensagem == undefined || dadosComentario.mensagem == null ||
                dadosComentario.id_usuario == '' || dadosComentario.id_usuario == undefined || dadosComentario.id_usuario == null ||
                dadosComentario.id_resposta === undefined
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                
                let atualizarComentario = await comentarioDAO.updateComentario(id, dadosComentario)
                
                if (atualizarComentario) {
                    comentarioJSON.status = message.UPDATED_ITEM.status
                    comentarioJSON.status_code = message.UPDATED_ITEM.status_code
                    comentarioJSON.status = message.UPDATED_ITEM.message
                    comentarioJSON.comentario = atualizarComentario[0]

                    return comentarioJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro ao tentar atualizar comentário" + error);

        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    setExcluirComentario,
    updateComentario
}