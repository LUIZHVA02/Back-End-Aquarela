const { contentType } = require('express/lib/response.js')
const postagemDAO = require('../model/DAO/postagem.js')
const categoriaDAO = require('../model/DAO/categoria.js')
const imagemDAO = require('../model/DAO/image.js')
const message = require('../modulo/config.js')

const setNovaPostagem = async (dadosPostagem, contentType) => {
  try {
      if (String(contentType).toLowerCase() == 'application/json') {

          let resultDadosPostagem = {}

          if (
            dadosPostagem.nome == '' || dadosPostagem.nome == undefined || dadosPostagem.nome.length > 100 ||
            dadosPostagem.descricao == '' || dadosPostagem.descricao == undefined || dadosPostagem.descricao.length > 500 ||
            dadosPostagem.id_usuario === '' || dadosPostagem.id_usuario === undefined || dadosPostagem.id_usuario === null ||
            dadosPostagem.categorias.length == 0 || dadosPostagem.imagens.length == 0
          ) {
              return message.ERROR_REQUIRED_FIELDS
          } else {
            
              let novaPostagem = await postagemDAO.insertNovaPostagem(dadosPostagem)

              if (novaPostagem) {
                
                let idPostagem = await postagemDAO.selectLastId()
                let id =  Number(idPostagem[0].id)

                let categoriasARRAY = []
                let imagensARRAY = []

                const categoriaPromise = dadosPostagem.categorias.map(async (categoriaId) => {
                      
                  const validaCategoria = await categoriaDAO.selectCategoriesById(categoriaId)
                  
                  if(validaCategoria){
                    const categoriaPostagem = await postagemDAO.insertPostagemCategoria(id, categoriaId)
                    if (categoriaPostagem) {                        
                      categoriasARRAY.push(validaCategoria[0])
                    }
                  }
                  
                })

                const imagePromisse = dadosPostagem.imagens.map(async (imagemData) => {
                      
                  const imagem = await imagemDAO.insertImage(imagemData.url)
                  
                  if(imagem){

                    let idImagemResp = await imagemDAO.selectLastId()
                    let idImagem =  Number(idImagemResp[0].id)

                    const imageProduto = await postagemDAO.insertPostagemImagem(id, idImagem)
                    
                    if (imageProduto) {

                      const imagemById = await imagemDAO.selectByIdImagem(idImagem)                        
                      imagensARRAY.push(imagemById[0])

                    }
                  }

                })

                await Promise.all(categoriaPromise)
                await Promise.all(imagePromisse)
                
                dadosPostagem.categorias = categoriasARRAY
                dadosPostagem.imagens = imagensARRAY

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
        dadosPostagem.id_usuario == '' || dadosPostagem.id_usuario == undefined || dadosPostagem.id_usuario == null 
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let novaPostagem = await postagemDAO.insertCurtidaPostagem(dadosPostagem)

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

const setFavoritarPostagem = async (dadosPostagem, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {

      let resultDadosFavoritar = {}

      if (
        dadosPostagem.id_postagem == '' || dadosPostagem.id_postagem == undefined || dadosPostagem.id_postagem == null ||
        dadosPostagem.id_usuario == '' || dadosPostagem.id_usuario == undefined || dadosPostagem.id_usuario == null 
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let favoritarPostagem = await postagemDAO.insertFavoritarPostagem(dadosPostagem)

        if (favoritarPostagem) {
          resultDadosFavoritar.status = message.CREATED_ITEM.status
          resultDadosFavoritar.status_code = message.CREATED_ITEM.status_code
          resultDadosFavoritar.status = message.CREATED_ITEM.message
          resultDadosFavoritar.postagem = dadosPostagem

          return resultDadosFavoritar

        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao tentar favoritar postagem: " + error);

    return message.ERROR_INTERNAL_SERVER
  }
}

const setVisualizarPostagem = async (dadosPostagem, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {

      let resultDadosVisualizar = {}

      if (
        dadosPostagem.id_postagem == '' || dadosPostagem.id_postagem == undefined || dadosPostagem.id_postagem == null ||
        dadosPostagem.id_usuario == '' || dadosPostagem.id_usuario == undefined || dadosPostagem.id_usuario == null 
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let visualizarPostagem = await postagemDAO.insertVisualizarPostagem(dadosPostagem)

        if (visualizarPostagem) {
          resultDadosVisualizar.status = message.CREATED_ITEM.status
          resultDadosVisualizar.status_code = message.CREATED_ITEM.status_code
          resultDadosVisualizar.status = message.CREATED_ITEM.message
          resultDadosVisualizar.postagem = dadosPostagem

          return resultDadosVisualizar

        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao tentar visualizar postagem: " + error);

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

const setComentarPostagem = async (dadosPostagem, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {

      let resultDadosComentar = {}

      if (
        dadosPostagem.mensagem == '' || dadosPostagem.mensagem == undefined || dadosPostagem.mensagem.length > 255 ||
        dadosPostagem.id_usuario == '' || dadosPostagem.id_usuario == undefined || dadosPostagem.id_usuario == null || 
        dadosPostagem.id_resposta == '' || dadosPostagem.id_resposta == undefined || dadosPostagem.id_resposta == null 
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let visualizarPostagem = await postagemDAO.insertNovoComentario(dadosPostagem)

        if (visualizarPostagem) {
          resultDadosComentar.status = message.CREATED_ITEM.status
          resultDadosComentar.status_code = message.CREATED_ITEM.status_code
          resultDadosComentar.status = message.CREATED_ITEM.message
          resultDadosComentar.postagem = dadosPostagem

          return resultDadosComentar
            
        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao tentar visualizar postagem: " + error);

    return message.ERROR_INTERNAL_SERVER
  }
}

const setAdicionarPostagemPasta = async (dadosPostagem, contentType) => {
  try {
    if (String(contentType).toLowerCase() == 'application/json') {

      let resultPostagemPasta = {}

      if (
        dadosPostagem.id_postagem == '' || dadosPostagem.id_postagem == undefined || dadosPostagem.id_postagem == null ||
        dadosPostagem.id_pasta == '' || dadosPostagem.id_pasta == undefined || dadosPostagem.id_pasta == null 
      ) {
        return message.ERROR_REQUIRED_FIELDS
      } else {
        let adicionarPostagem = await postagemDAO.insertPostagemPasta(dadosPostagem)

        if (adicionarPostagem) {
          resultPostagemPasta.status = message.CREATED_ITEM.status
          resultPostagemPasta.status_code = message.CREATED_ITEM.status_code
          resultPostagemPasta.status = message.CREATED_ITEM.message
          resultPostagemPasta.postagem = dadosPostagem

          return resultPostagemPasta
            
        } else {
          return message.ERROR_INTERNAL_SERVER_DB
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE
    }
  } catch (error) {
    console.error("Erro ao tentar adicionar postagem na pasta: " + error);

    return message.ERROR_INTERNAL_SERVER
  }
}

module.exports = {
  setNovaPostagem,
  getListarPostagens,
  getBuscarPostagem,
  setAtualizarPostagem,
  setExcluirPostagem,
  setCurtirPostagem,
  setFavoritarPostagem,
  setVisualizarPostagem,
  setComentarPostagem,
  setAdicionarPostagemPasta
}