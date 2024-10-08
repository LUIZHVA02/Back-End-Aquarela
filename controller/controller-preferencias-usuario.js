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
        console.error("Erro ao tentar inserir preferências: " + error);

        console.log(error);


        return message.ERROR_INTERNAL_SERVER
    }
}

const getListPreferences = async () => {
    try {
      let preferenciasJSON = {};
      let dadosPreferenciasUsuario = await userPreferencesDAO.selectAllPreferences();
  
      if (dadosPreferenciasUsuario) {
        if (dadosPreferenciasUsuario.length > 0) {
          preferenciasJSON.address = dadosPreferenciasUsuario;
          preferenciasJSON.quantity = dadosPreferenciasUsuario.length;
          preferenciasJSON.status_code = 200;
          return preferenciasJSON;
        } else {
          console.log(dadosPreferenciasUsuario.length, "getListPreferences");
  
          return message.ERROR_NOT_FOUND;
        }
      } else {
        return message.ERROR_INTERNAL_SERVER_DB;
      }
    } catch (error) {
      console.log(error);
  
      message.ERROR_INTERNAL_SERVER;
    }
  };
  

const setExcluirPreferencias = async function (id) {
    try {

        let id_preferencia = id;
        let deletePreferenciaJSON = {}


        if (id_preferencia == '' || id_preferencia == undefined || isNaN(id_preferencia)) {
            return message.ERROR_INVALID_ID;
        } else {

            let validaId = await userPreferencesDAO.selectByIdPreferences(id_preferencia);

            if (validaId.length > 0) {

                let preferencia_status = "0"

                deletePreferenciaJSON.preferencia_status = preferencia_status

                let dadosPreferenciasUsuario = await userPreferencesDAO.updatePreferencias(id_preferencia, deletePreferenciaJSON)

                if (dadosPreferenciasUsuario) {
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


module.exports = {
    adicionarPreferencias,
    getListPreferences,
    setExcluirPreferencias
}