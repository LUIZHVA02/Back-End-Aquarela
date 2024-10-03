const seguidorDAO = require('../model/DAO/seguidores.js')
const message = require('../modulo/config.js')

const setNovoSeguidor = async (dadosSeguidores, contentType) => {
  try {
      if (String(contentType).toLowerCase() == 'application/json') {

          let resultDadosSeguidores = {}

          if (
              dadosSeguidores.id_seguidor == '' || dadosSeguidores.id_seguidor == undefined || dadosSeguidores.id_seguidor == null ||
              dadosSeguidores.id_seguindo == '' || dadosSeguidores.id_seguindo == undefined || dadosSeguidores.id_seguindo == null ||
              dadosSeguidores.seguidores_status === '' || dadosSeguidores.seguidores_status === undefined || dadosSeguidores.seguidores_status === null
              
          ) {
              return message.ERROR_REQUIRED_FIELDS
          } else {
              let novoSeguidor = await seguidorDAO.insertNovoSeguidor(dadosSeguidores)

              if (novoSeguidor) {
                  resultDadosSeguidores.status = message.CREATED_ITEM.status
                  resultDadosSeguidores.status_code = message.CREATED_ITEM.status_code
                  resultDadosSeguidores.status = message.CREATED_ITEM.message
                  resultDadosSeguidores.seguidores = dadosSeguidores

                  return resultDadosSeguidores

              } else {
                  return message.ERROR_INTERNAL_SERVER_DB
              }
          }
      } else {
          return message.ERROR_CONTENT_TYPE
      }
  } catch (error) {
      console.error("Erro ao tentar inserir seguidor: " + error);

      return message.ERROR_INTERNAL_SERVER
  }
}

const getListFollowers = async () => {
  try {

    let seguidorJSON = {}
    let dadosSeguidores = await seguidorDAO.selectAllFollowers()

    if (dadosSeguidores) {

      if (dadosSeguidores.length > 0) {
        seguidorJSON.seguidor = dadosSeguidores
        seguidorJSON.quantity = dadosSeguidores.length
        seguidorJSON.status_code = 200
        return seguidorJSON
      } else {
        console.log(dadosSeguidores.length, "getListFollowers");
        
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



// const setExcluirSeguidor = async function (id) {
//   try {

//       let id_seguidor = id;
//       let deleteSeguidorJSON = {}


//       if (id_seguidor == '' || id_seguidor == undefined || isNaN(id_seguidor)) {
//           return message.ERROR_INVALID_ID;
//       } else {

//         if (validaId.length > 0) {

//               let seguidores_status = "0"

//               deleteSeguidorJSON.seguidores_status = seguidores_status

//               let dadosSeguidores = await seguidorDAO.updateSeguidores(id_seguidor, deleteSeguidorJSON)

//               if (dadosSeguidores) {
//                   return message.DELETED_ITEM
//               } else {
//                   return message.ERROR_INTERNAL_SERVER_DB
//               }

//           } else {
//               return message.ERROR_NOT_FOUND
//           }
//       }
//   } catch (error) {
//       console.log(error);

//       return message.ERROR_INTERNAL_SERVER
//   }

// }

module.exports = {
  setNovoSeguidor,
  getListFollowers,
}