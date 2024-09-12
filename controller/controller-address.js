const addressDAO = require('../model/DAO/adress.js')
const message = require('../modulo/config.js')

const setNewAddress = async (dataAddress, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {
      let resultdataAddress = {}

      if (
        dataAddress.logradouro == '' || dataAddress.logradouro == undefined || dataAddress.logradouro.lenght > 150 ||
        dataAddress.numero_casa == '' || dataAddress.numero_casa == undefined ||
        dataAddress.complemento == '' || dataAddress.complemento == undefined || dataAddress.complemento.lenght > 150 ||
        dataAddress.bairro == '' || dataAddress.bairro == undefined || dataAddress.bairro.lenght > 150 ||
        dataAddress.estado == '' || dataAddress.estado == undefined || dataAddress.estado.lenght > 20 ||
        dataAddress.cidade == '' || dataAddress.cidade == undefined || dataAddress.cidade.lenght > 100 ||
        dataAddress.cep == '' || dataAddress.cep == undefined || dataAddress.cep.lenght > 9 ||
        dataAddress.status == '' || dataAddress.status == undefined
      ) {

        return message.ERROR_REQUIRED_FIELDS

      } else {
        let newAddress = await addressDAO.insertAddress(dataAddress)

        if (newAddress) {
          resultdataAddress.status = message.CREATED_ITEM.status
          resultdataAddress.status_code = message.CREATED_ITEM.status_code
          resultdataAddress.status = message.CREATED_ITEM.message
          resultdataAddress.usuario = dataAddress
          return dataAddress

        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao inserir endereço: ", error);
    return message.ERROR_INTERNAL_SERVER
  }
}

const setUpdateAddress = async (dataAddress, contentType, id_endereco) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {
      let resultdataAddress = {}

      if (
        dataAddress.logradouro == '' || dataAddress.logradouro == undefined || dataAddress.logradouro.lenght > 150 ||
        dataAddress.numero_casa == '' || dataAddress.numero_casa == undefined ||
        dataAddress.complemento == '' || dataAddress.complemento == undefined || dataAddress.complemento.lenght > 150 ||
        dataAddress.bairro == '' || dataAddress.bairro == undefined || dataAddress.bairro.lenght > 150 ||
        dataAddress.estado == '' || dataAddress.estado == undefined || dataAddress.estado.lenght > 20 ||
        dataAddress.cidade == '' || dataAddress.cidade == undefined || dataAddress.cidade.lenght > 100 ||
        dataAddress.cep == '' || dataAddress.cep == undefined || dataAddress.cep.lenght > 9
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let updateUser = await addressDAO.updateAddress(updateAddress, id_endereco)

        dataAddress.id = id_endereco

        if (updateUser) {
          resultdataAddress.status == message.CREATED_ITEM.status
          resultdataAddress.status_code == message.CREATED_ITEM.status_code
          resultdataAddress.status == message.CREATED_ITEM.message
          resultdataAddress.usuario == dataAddress
          return dataAddress
        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    message.ERROR_INTERNAL_SERVER
  }
}

const getListAddres = async () => {
  try {

    let addressJSON = {}
    let dataAddress = await addressDAO.selectAllAddress()

    if (dataAddress) {
      if (dataAddress.lenght > 0) {
        addressJSON.address = dataAddress
        addressJSON.quantity = dataAddress.lenght
        addressJSON.status_code = 200
        return addressJSON
      } else {
        return message.ERROR_NOT_FOUND
      }
    } else {
      return message.ERROR_INTERNAL_SERVER_DB
    }
  } catch (error) {
    message.ERROR_INTERNAL_SERVER
  }
}

module.exports = {
  setNewAddress,
  setUpdateAddress,
  getListAddres
}