const addressDAO = require('../model/DAO/adress.js')
const message = require('../modulo/config.js')

const setNewAddress = async (dataAddress, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {
      let resultdataAddress = {}

      if (
        dataAddress.logradouro == '' || dataAddress.logradouro == undefined || dataAddress.logradouro.length > 150 ||
        dataAddress.numero_casa == '' || dataAddress.numero_casa == undefined ||
        dataAddress.complemento == '' || dataAddress.complemento == undefined || dataAddress.complemento.length > 150 ||
        dataAddress.bairro == '' || dataAddress.bairro == undefined || dataAddress.bairro.length > 150 ||
        dataAddress.estado == '' || dataAddress.estado == undefined || dataAddress.estado.length > 20 ||
        dataAddress.cidade == '' || dataAddress.cidade == undefined || dataAddress.cidade.length > 100 ||
        dataAddress.cep == '' || dataAddress.cep == undefined || dataAddress.cep.length > 9 ||
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
          return resultdataAddress

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
  if (String(contentType).toLowerCase() == 'application/json') {

    let updateAddressJson = {}
    try {

      const validaId = await getSearchAddress(id_endereco)

      if (validaId) {

        let logradouro = dataAddress.logradouro
        let numero_casa = dataAddress.numero_casa
        let complemento = dataAddress.complemento
        let bairro = dataAddress.bairro
        let estado = dataAddress.estado
        let cidade = dataAddress.cidade
        let cep = dataAddress.cep
        let user_status = dataAddress.user_status

        if (
          logradouro != '' &&
          logradouro != undefined &&
          logradouro != null &&
          logradouro.length < 150
        ) {
          updateUsuarioJson.logradouro = logradouro.replace(/'/g, "|")
        } else if (
          logradouro == '' &&
          logradouro == undefined &&
          logradouro == null
        ) { }

        if (
          numero_casa != '' &&
          numero_casa != undefined &&
          numero_casa != null
        ) {

          updateUsuarioJson.numero_casa = numero_casa.replace(/'/g, "|")
        } else if (
          numero_casa == '' &&
          numero_casa == undefined &&
          numero_casa == null
        ) { }

        if (
          complemento != '' &&
          complemento != undefined &&
          complemento != null &&
          complemento.length == 300
        ) {
          updateUsuarioJson.complemento = complemento
        } else if (
          complemento == '' &&
          complemento == undefined &&
          complemento == null
        ) { }

        if (
          bairro != '' &&
          bairro != undefined &&
          bairro != null &&
          bairro.length == 300
        ) {
          updateUsuarioJson.bairro = bairro
        } else if (
          bairro == '' &&
          bairro == undefined &&
          bairro == null
        ) { }

        if (
          estado != '' &&
          estado != undefined &&
          estado != null &&
          estado.length == 50
        ) {
          updateUsuarioJson.estado = estado
        } else if (
          estado == '' &&
          estado == undefined &&
          estado == null
        ) { }

        if (
          cidade != '' &&
          cidade != undefined &&
          cidade != null &&
          cidade.length < 16
        ) {
          updateUsuarioJson.cidade = cidade
        } else if (
          cidade == '' &&
          cidade == undefined &&
          cidade == null
        ) { }

        if (
          cep != '' &&
          cep != undefined &&
          cep != null &&
          cep.length < 11
        ) {
          updateUsuarioJson.cep = cep
        } else if (
          cep == '' &&
          cep == undefined &&
          cep == null
        ) { }

        if (
          user_status != '' &&
          user_status != undefined &&
          user_status != null
        ) {
          updateUsuarioJson.user_status = user_status
        } else if (
          user_status == '' &&
          user_status == undefined &&
          user_status == null
        ) { }

        const addressUpdate = await userDAO.updateAddress(id_endereco, updateAddressJson)

        if (addressUpdate) {
          updateAddressJson.id = validaId
          updateAddressJson.status = message.UPDATED_ITEM.status
          updateAddressJson.status_code = message.UPDATED_ITEM.status_code
          updateAddressJson.message = message.UPDATED_ITEM.message
          updateAddressJson.usuario = addressUpdate

          return updateAddressJson
        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      } else {
        return message.ERROR_NOT_FOUND
      }

    } catch (error) {

      console.log(error, "EU SOU");

      return message.ERROR_INTERNAL_SERVER_DB
    }
  } else {
    return message.ERROR_CONTENT_TYPE
  }
}

const getListAddres = async () => {
  try {

    let addressJSON = {}
    let dataAddress = await addressDAO.selectAllAddress()

    if (dataAddress) {

      if (dataAddress.length > 0) {
        addressJSON.address = dataAddress
        addressJSON.quantity = dataAddress.length
        addressJSON.status_code = 200
        return addressJSON
      } else {
        console.log(dataAddress.length, "getListAddres");
        
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

const getSearchAddress = async (id) => {

  try {

    let id_endereco = id
    let addressJSON = {}

    if (id_endereco == '' || id_endereco == undefined || isNaN(id_endereco)) {

      return message.ERROR_INVALID_ID // 400

    } else {

      let dataAddress = await userDAO.selectByIdAddress(id_endereco)

      if (dataAddress) {

        if (dataAddress.length > 0) {

          addressJSON.address = dataAddress
          addressJSON.status_code = 200
          return addressJSON

        } else {
          return message.ERROR_NOT_FOUND // 404
        }

      } else {
        return message.ERROR_INTERNAL_SERVER_DB // 500
      }
    }

  } catch (error) {
    message.ERROR_INTERNAL_SERVER // 500
  }

}

module.exports = {
  setNewAddress,
  setUpdateAddress,
  getListAddres,
  getSearchAddress
}