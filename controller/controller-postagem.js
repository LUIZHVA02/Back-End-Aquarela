const postagemDAO = require('../model/DAO/postagem.js')
const message = require('../modulo/config.js')

const setNovaPostagem = async (dadosPostagem, contentType) => {
  try {
      if (String(contentType).toLowerCase() == 'application/json') {

          let resultDadosPostagem = {}

          if (
              dadosPostagem.nome == '' || dadosPostagem.nome == undefined || dadosPostagem.nome.length > 100 ||
              dadosPostagem.descricao == '' || dadosPostagem.descricao == undefined || dadosPostagem.descricao.length > 500 ||
              dadosPostagem.id_usuario == '' || dadosPostagem.id_usuario == undefined || dadosPostagem.id_usuario == null ||
              dadosPostagem.postagem_status == '' || dadosPostagem.postagem_status == undefined || dadosPostagem.postagem_status == null
          ) {
              return message.ERROR_REQUIRED_FIELDS
          } else {
              let novaPostagem = await postagemDAO.insertNovaPostagem(dadosPostagem)

              if (novaPostagem) {
                  resultDadosPostagem.status = message.CREATED_ITEM.status
                  resultDadosPostagem.status_code = message.CREATED_ITEM.status_code
                  resultDadosPostagem.status = message.CREATED_ITEM.message
                  resultDadosPostagem.postagem = dadosPostagem

                  return resultDadosPostagem

              } else {
                  return message.ERROR_INTERNAL_SERVER_DB
              }
          }
      } else {
          return message.ERROR_CONTENT_TYPE
      }
  } catch (error) {
      console.error("Erro ao tentar inserir postagem: " + error);

      return message.ERROR_INTERNAL_SERVER
  }
}

const getListarPostagens = async () => {
  try {

    let postagemJSON = {}
    let dadosPostagem = await postagemDAO.selectAllPosts()

    if (dadosPostagem) {

      if (dadosPostagem.length > 0) {
        postagemJSON.seguidor = dadosPostagem
        postagemJSON.quantity = dadosPostagem.length
        postagemJSON.status_code = 200
        return postagemJSON
      } else {
        console.log(dadosPostagem.length, "getListPosts");
        
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

const getBuscarPostagem = async (id) => {

  try {

      let id_postagem = id
      let postagemJSON = {}

      if (id_postagem == '' || id_postagem == undefined || isNaN(id_postagem)) {

          return message.ERROR_INVALID_ID // 400

      } else {

          let dadosPostagem = await postagemDAO.selectByIdPosts(id_postagem)

          if (dadosPostagem) {

              if (dadosPostagem.length > 0) {

                  postagemJSON.postagem = dadosPostagem
                  postagemJSON.status_code = 200
                  return postagemJSON

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

const setAtualizarPostagem = async (dadosPostagem, contentType, id_postagem) => {
  if (String(contentType).toLowerCase() == 'application/json') {

    let updatePostJSON = {}
    try {

      const validaId = await postagemDAO.selectByIdPosts(id_postagem)

      if (validaId) {

        let nome = dadosPostagem.nome
        let descricao = dadosPostagem.descricao
        let postagem_status = dadosPostagem.postagem_status

        if (
          nome != '' &&
          nome != undefined &&
          nome != null &&
          nome.length < 100
        ) {
          updatePostJSON.nome = nome
        } else if (
          nome == '' &&
          nome == undefined &&
          nome == null
        ) { }

        if (
          descricao != '' &&
          descricao != undefined &&
          descricao != null &&
          descricao.length < 500
        ) {
          updatePostJSON.descricao = descricao
        } else if (
          descricao == '' &&
          descricao == undefined &&
          descricao == null
        ) { }

        if (
          postagem_status != '' &&
          postagem_status != undefined &&
          postagem_status != null
        ) {

          updatePostJSON.postagem_status = postagem_status

        } else if (
          postagem_status == '' &&
          postagem_status == undefined &&
          postagem_status == null
        ) { }
        
        console.log(updatePostJSON);
        
        const postUpdate = await postagemDAO.updatePosts(id_postagem, updatePostJSON)

        console.log(postUpdate);
        
        if (postUpdate != false) {
          updatePostJSON.id = validaId
          updatePostJSON.status = message.UPDATED_ITEM.status
          updatePostJSON.status_code = message.UPDATED_ITEM.status_code
          updatePostJSON.message = message.UPDATED_ITEM.message
          updatePostJSON.postagem = postUpdate

          return updatePostJSON
        } else {

          console.log(postUpdate);
           
          return message.ERROR_INTERNAL_SERVER_DB
        }
      } else {
        return message.ERROR_NOT_FOUND
      }

    } catch (error) {

      console.log(error, "model/DAO/controller-postagem.js => setAtualizarPostagem");

      return message.ERROR_INTERNAL_SERVER_DB
    }
  } else {
    return message.ERROR_CONTENT_TYPE
  }
}

const setCurtirPostagem = async (dadosPostagem, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {

        let resultDadosPostagem = {}

        if (
            dadosPostagem.id_postagem == '' || dadosPostagem.id_postagem == undefined || dadosPostagem.id_postagem == null ||
            dadosPostagem.id_usuario == '' || dadosPostagem.id_usuario == undefined || dadosPostagem.id_usuario == null ||
            dadosPostagem.curtidas_postagem_status == '' || dadosPostagem.curtidas_postagem_status == undefined == dadosPostagem.curtidas_postagem_status == null
        ) {
            return message.ERROR_REQUIRED_FIELDS
        } else {
            let novaPostagem = await postagemDAO.insertNovaPostagem(dadosPostagem)

            if (novaPostagem) {
                resultDadosPostagem.status = message.CREATED_ITEM.status
                resultDadosPostagem.status_code = message.CREATED_ITEM.status_code
                resultDadosPostagem.status = message.CREATED_ITEM.message
                resultDadosPostagem.postagem = dadosPostagem

                return resultDadosPostagem

            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } else {
        return message.ERROR_CONTENT_TYPE
    }
} catch (error) {
    console.error("Erro ao tentar curtir postagem: " + error);

    return message.ERROR_INTERNAL_SERVER
}
}

const setExcluirPostagem = async function (id) {
  try {

      let id_postagem = id;
      let deletePostagemJSON = {}


      if (id_postagem == '' || id_postagem == undefined || isNaN(id_postagem)) {
          return message.ERROR_INVALID_ID;
      } else {

          let validaId = await postagemDAO.selectByIdPosts(id_postagem);

          if (validaId.length > 0) {

              let postagem_status = "0"

              deletePostagemJSON.postagem_status = postagem_status

              let dadosPostagem = await postagemDAO.updatePosts(id_postagem, deletePostagemJSON)

              if (dadosPostagem) {
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
  setNovaPostagem,
  getListarPostagens,
  getBuscarPostagem,
  setAtualizarPostagem,
  setExcluirPostagem
}