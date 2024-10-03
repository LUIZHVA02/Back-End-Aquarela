const userPreferencesDAO = require('../model/DAO/preferencias-usuario')
const message = require('../modulo/config.js')

const adicionarPreferencias = async function (dadosPreferenciasUsuario, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosPreferenciasUsuario = {}

            if (
                dadosPreferenciasUsuario.preferencias == '' || dadosPreferenciasUsuario.preferencias == undefined ||
                dadosPreferenciasUsuario.id_usuario == '' || dadosPreferenciasUsuario.id_usuario == undefined || isNaN(dadosPreferenciasUsuario.id_usuario)
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let result = {}


                dadosPreferenciasUsuario.preferencias.forEach(async (element, index) => {

                    let novoPreferenciasUsuario = await userPreferencesDAO.insertNovaPreferencia(dadosPreferenciasUsuario.id_usuario, dadosPreferenciasUsuario.preferencias[index])
                    
                    let lastId = await userPreferencesDAO.selectLastId()

                    dadosPreferenciasUsuario.id = Number(lastId[0].id)

                });



                if (result) {
                    resultDadosPreferenciasUsuario.status = message.CREATED_ITEM.status
                    resultDadosPreferenciasUsuario.status_code = message.CREATED_ITEM.status_code
                    resultDadosPreferenciasUsuario.status = message.CREATED_ITEM.message
                    resultDadosPreferenciasUsuario.usuario = dadosPreferenciasUsuario

                    return resultDadosPreferenciasUsuario

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro ao tentar inserir usuário: " + error);

        console.log(error);


        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    adicionarPreferencias
}