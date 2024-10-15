const addressDAO = require("../model/DAO/adress.js");
const userAddressDAO = require("../model/DAO/user_address.js");
const userDAO = require("../model/DAO/user.js");
const message = require("../modulo/config.js");

const setNewAddress = async (dataAddress, contentType) => {
  try {
    if (String(contentType).toLowerCase() == "application/json") {
      let resultdataAddress = {};

      if (
        dataAddress.logradouro == "" || dataAddress.logradouro == undefined || dataAddress.logradouro.length > 150 ||
        dataAddress.numero_casa == "" || dataAddress.numero_casa == undefined ||
        dataAddress.complemento == "" || dataAddress.complemento == undefined || dataAddress.complemento.length > 150 ||
        dataAddress.bairro == "" || dataAddress.bairro == undefined || dataAddress.bairro.length > 150 ||
        dataAddress.estado == "" || dataAddress.estado == undefined || dataAddress.estado.length > 20 ||
        dataAddress.cidade == "" || dataAddress.cidade == undefined || dataAddress.cidade.length > 100 ||
        dataAddress.cep == "" || dataAddress.cep == undefined || dataAddress.cep.length > 9 ||
        dataAddress.id_usuario == "" || dataAddress.id_usuario == undefined || isNaN(dataAddress.id_usuario)
      ) {
        return message.ERROR_REQUIRED_FIELDS;
      } else {

        let newAddress = await addressDAO.insertAddress(dataAddress);
        let idU = dataAddress.id_usuario;

        if (newAddress) {
          let lastId = await addressDAO.selectLastId();
          let idA = lastId[0].id;

          let connect = await userAddressDAO.insertUserAddress(idA, idU);

          if (connect) {
            resultdataAddress.status = message.CREATED_ITEM.status;
            resultdataAddress.status_code = message.CREATED_ITEM.status_code;
            resultdataAddress.status = message.CREATED_ITEM.message;
            resultdataAddress.endereco = dataAddress;
            return resultdataAddress;
          } else {
            return message.ERROR_INTERNAL_SERVER_DB;
          }
        } else {
          return message.ERROR_INTERNAL_SERVER_DB;
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE;
    }
  } catch (error) {
    console.error("Erro ao inserir endereço: ", error);
    return message.ERROR_INTERNAL_SERVER;
  }
};

const setUpdateAddress = async (dataAddress, contentType, id_endereco) => {
  if (String(contentType).toLowerCase() == "application/json") {
    let updateAddressJson = {};
    try {
      const validaId = await getSearchAddress(id_endereco);

      if (validaId) {
        let logradouro = dataAddress.logradouro;
        let numero_casa = dataAddress.numero_casa;
        let complemento = dataAddress.complemento;
        let bairro = dataAddress.bairro;
        let estado = dataAddress.estado;
        let cidade = dataAddress.cidade;
        let cep = dataAddress.cep;
        let address_status = dataAddress.address_status;

        if (
          logradouro != "" &&
          logradouro != undefined &&
          logradouro != null &&
          logradouro.length < 150
        ) {
          updateAddressJson.logradouro = logradouro.replace(/'/g, "|");
        } else if (
          logradouro == "" &&
          logradouro == undefined &&
          logradouro == null
        ) {
        }

        if (
          numero_casa != "" &&
          numero_casa != undefined &&
          numero_casa != null
        ) {
          updateAddressJson.numero_casa = numero_casa;
        } else if (
          numero_casa == "" &&
          numero_casa == undefined &&
          numero_casa == null
        ) {
        }

        if (
          complemento != "" &&
          complemento != undefined &&
          complemento != null &&
          complemento.length == 300
        ) {
          updateAddressJson.complemento = complemento;
        } else if (
          complemento == "" &&
          complemento == undefined &&
          complemento == null
        ) {
        }

        if (
          bairro != "" &&
          bairro != undefined &&
          bairro != null &&
          bairro.length == 300
        ) {
          updateAddressJson.bairro = bairro;
        } else if (bairro == "" && bairro == undefined && bairro == null) {
        }

        if (
          estado != "" &&
          estado != undefined &&
          estado != null &&
          estado.length == 50
        ) {
          updateAddressJson.estado = estado;
        } else if (estado == "" && estado == undefined && estado == null) {
        }

        if (
          cidade != "" &&
          cidade != undefined &&
          cidade != null &&
          cidade.length < 16
        ) {
          updateAddressJson.cidade = cidade;
        } else if (cidade == "" && cidade == undefined && cidade == null) {
        }

        if (cep != "" && cep != undefined && cep != null && cep.length < 11) {
          updateAddressJson.cep = cep;
        } else if (cep == "" && cep == undefined && cep == null) {
        }

        if (
          address_status != "" &&
          address_status != undefined &&
          address_status != null
        ) {
          updateAddressJson.address_status = address_status;
        } else if (
          address_status == "" &&
          address_status == undefined &&
          address_status == null
        ) {
        }

        const addressUpdate = await addressDAO.updateAddress(
          id_endereco,
          updateAddressJson
        );

        if (addressUpdate != false) {
          updateAddressJson.id = validaId;
          updateAddressJson.status = message.UPDATED_ITEM.status;
          updateAddressJson.status_code = message.UPDATED_ITEM.status_code;
          updateAddressJson.message = message.UPDATED_ITEM.message;
          updateAddressJson.endereco = addressUpdate;

          return updateAddressJson;
        } else {
          console.log(addressUpdate);

          return message.ERROR_INTERNAL_SERVER_DB;
        }
      } else {
        return message.ERROR_NOT_FOUND;
      }
    } catch (error) {
      console.log(error, "EU SOU");

      return message.ERROR_INTERNAL_SERVER_DB;
    }
  } else {
    return message.ERROR_CONTENT_TYPE;
  }
};

const getListAddres = async () => {
  try {
    let addressJSON = {};
    let dataAddress = await addressDAO.selectAllAddress();

    if (dataAddress) {
      if (dataAddress.length > 0) {
        addressJSON.address = dataAddress;
        addressJSON.quantity = dataAddress.length;
        addressJSON.status_code = 200;
        return addressJSON;
      } else {
        console.log(dataAddress.length, "getListAddres");

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

const getSearchAddress = async (id) => {
  try {
    let id_address = id;
    let addressJSON = {};

    if (id_address == "" || id_address == undefined || isNaN(id_address)) {
      return message.ERROR_INVALID_ID; // 400
    } else {
      let dataAddress = await addressDAO.selectByIdAddress(id_address);

      if (dataAddress) {
        if (dataAddress.length > 0) {
          addressJSON.address = dataAddress;
          addressJSON.status_code = 200;
          return addressJSON;
        } else {
          return message.ERROR_NOT_FOUND; // 404
        }
      } else {
        return message.ERROR_INTERNAL_SERVER_DB; // 500
      }
    }
  } catch (error) {
    message.ERROR_INTERNAL_SERVER; // 500
  }
};

const getSearchUserAddresses = async (id_usuario) => {
  try {
    let id_user = id_usuario
    let userAddressesJSON = {}
    let userAddressesArray = []
    let addressesUserJSON = {}


    if (id_user == null || id_user == undefined || isNaN(id_user)) {
      return message.ERROR_INVALID_ID
    } else {

      let validaId = await userDAO.selectByIdUsuarioAtivo(id_user)

      if (validaId != false) {
        let dataUserAdresses = await addressDAO.selectAllUserAdresses(id_user);

        if (dataUserAdresses) {
          if (dataUserAdresses.length > 0) {

            const keys = Object.keys(dataUserAdresses)

            keys.forEach((key, index) => {

              addressesUserJSON = {
                id_endereco: `${dataUserAdresses[key].id_endereco}`,
                logradouro: `${dataUserAdresses[key].logradouro}`,
                numero_casa: `${dataUserAdresses[key].numero_casa}`,
                complemento: `${dataUserAdresses[key].complemento}`,
                bairro: `${dataUserAdresses[key].bairro}`,
                estado: `${dataUserAdresses[key].estado}`,
                cidade: `${dataUserAdresses[key].cidade}`,
                cep: `${dataUserAdresses[key].cep}`
              }

              userAddressesArray.push(addressesUserJSON)

            })

            userAddressesJSON.id_usuario = dataUserAdresses[0].id_usuario
            userAddressesJSON.nome = dataUserAdresses[0].nome
            userAddressesJSON.nome_usuario = dataUserAdresses[0].nome_usuario
            userAddressesJSON.email = dataUserAdresses[0].email
            userAddressesJSON.enderecos = userAddressesArray
            userAddressesJSON.status_code = 200;

            console.log(userAddressesJSON);
            

            return userAddressesJSON;
          } else {
            return message.ERROR_NOT_FOUND; // 404
          }
        } else {
          return message.ERROR_INTERNAL_SERVER_DB; // 500
        }
      } else {
        return message.ERROR_NOT_FOUND;
      }
    }
  } catch (error) {
    console.log(error);
    message.ERROR_INTERNAL_SERVER
  }
}

const setExcluirendereco = async function (id) {
  try {
    let id_endereco = id;
    let deleteenderecoJson = {};

    if (id_endereco == "" || id_endereco == undefined || isNaN(id_endereco)) {
      return message.ERROR_INVALID_ID;
    } else {
      const validaId = await userDAO.selectByIdenderecoAtivo(id_endereco);

      console.log(validaId);

      if (validaId.length > 0) {
        let endereco_status = "0";

        deleteenderecoJson.endereco_status = endereco_status;

        let dadosendereco = await userDAO.updateendereco(
          id_endereco,
          deleteenderecoJson
        );

        if (dadosendereco) {
          return message.DELETED_ITEM;
        } else {
          return message.ERROR_INTERNAL_SERVER_DB;
        }
      } else {
        return message.ERROR_NOT_FOUND;
      }
    }
  } catch (error) {
    console.log(error);

    return message.ERROR_INTERNAL_SERVER;
  }
};

const setReativarEndereco = async function (id) {
  try {
    let id_endereco = id;
    let reativarenderecoJson = {};

    if (id_endereco == "" || id_endereco == undefined || isNaN(id_endereco)) {
      return message.ERROR_INVALID_ID;
    } else {
      const validaId = await userDAO.selectByIdenderecoInativo(id_endereco);

      console.log(validaId);

      if (validaId.length > 0) {
        let endereco_status = "1";

        reativarenderecoJson.endereco_status = endereco_status;

        let dadosendereco = await userDAO.updateendereco(
          id_endereco,
          reativarenderecoJson
        );

        if (dadosendereco) {
          return message.REACTIVATED_ITEM;
        } else {
          return message.ERROR_INTERNAL_SERVER_DB;
        }
      } else {
        return message.ERROR_NOT_FOUND;
      }
    }
  } catch (error) {
    console.log(error);

    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  setNewAddress,
  setUpdateAddress,
  getListAddres,
  getSearchAddress,
  setExcluirendereco,
  setReativarEndereco,
  getSearchUserAddresses
};
