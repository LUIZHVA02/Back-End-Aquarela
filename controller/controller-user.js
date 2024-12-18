const userDAO = require('../model/DAO/user.js')
const message = require('../modulo/config.js')

const getBuscarItensByText = async (idClient, texto) => {
    try {
        let pesquisasJSON = {}
        let id_client = idClient
        let text = texto
        
        if (
            id_client == '' || id_client == undefined || isNaN(id_client) ||
            text == '' || text == undefined
        ) {
            return message.ERROR_REQUIRED_FIELDS
        } else {
            
        let dadosPesquisa = await userDAO.selectSearchItemsByText(id_client,text)
        
            if (dadosPesquisa) {
                if (dadosPesquisa.length > 0) {


                    const promise = dadosPesquisa.map(async (post) => {

                        let usuario = await getBuscarUsuario(post.id_dono_publicacao)
                        post.dono_publicacao = usuario.usuario[0]

                        let images = await getBuscarImages(post.id_publicacao, post.tipo)
                        post.imagens = images.imagens

                    })

                    await Promise.all(promise)

                    pesquisasJSON.resultado = dadosPesquisa
                    pesquisasJSON.quantity = dadosPesquisa.length
                    pesquisasJSON.status_code = 200
                    return pesquisasJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        console.log(error);

        message.ERROR_INTERNAL_SERVER
    }
}

const setNovoUsuario = async (dadosUsuario, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosUsuario = {}

            if (
                dadosUsuario.nome == '' || dadosUsuario.nome == undefined || dadosUsuario.nome.length > 150 ||
                dadosUsuario.nome_usuario == '' || dadosUsuario.nome_usuario == undefined || dadosUsuario.nome_usuario.length > 150 ||
                dadosUsuario.foto_usuario.length > 300 ||
                dadosUsuario.descricao.length > 300 ||
                dadosUsuario.email == '' || dadosUsuario.email == undefined || dadosUsuario.email.length > 50 ||
                dadosUsuario.senha == '' || dadosUsuario.senha == undefined || dadosUsuario.senha.length > 16 ||
                dadosUsuario.cpf == '' || dadosUsuario.cpf == undefined || dadosUsuario.cpf.length != 11 ||
                dadosUsuario.data_nascimento == '' || dadosUsuario.data_nascimento == undefined || dadosUsuario.data_nascimento.length > 10 ||
                dadosUsuario.telefone == '' || dadosUsuario.telefone == undefined || dadosUsuario.telefone.length > 11 ||
                dadosUsuario.disponibilidade === '' || dadosUsuario.disponibilidade === undefined
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoUsuario = await userDAO.insertUsuario(dadosUsuario)

                let lastId = await userDAO.selectLastId()

                dadosUsuario.id = Number(lastId[0].id)

                if (novoUsuario) {
                    resultDadosUsuario.status = message.CREATED_ITEM.status
                    resultDadosUsuario.status_code = message.CREATED_ITEM.status_code
                    resultDadosUsuario.message = message.CREATED_ITEM.message
                    resultDadosUsuario.usuario = dadosUsuario

                    return resultDadosUsuario

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro ao tentar inserir usuário: " + error);

        return message.ERROR_INTERNAL_SERVER
    }
}

const getBuscarUsuario = async (id) => {

    try {

        let id_usuario = id
        let usuarioJSON = {}

        if (id_usuario == '' || id_usuario == undefined || isNaN(id_usuario)) {
            return message.ERROR_INVALID_ID // 400
        } else {

            let dadosUsuario = await userDAO.selectByIdUsuarioAtivo(id_usuario)

            if (dadosUsuario) {
                if (dadosUsuario.length > 0) {

                    usuarioJSON.usuario = dadosUsuario
                    usuarioJSON.status_code = 200

                    return usuarioJSON

                } else {
                    return message.ERROR_NOT_FOUND // 404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }
        }
    } catch (error) {
        console.log(error);
        message.ERROR_INTERNAL_SERVER // 500
    }
}

const getFeed = async (id) => {

    try {

        let idUsuario = id
        let usuarioJSON = {}

        const userValidation = await getBuscarUsuario(idUsuario)

        if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario) || userValidation.status_code != 200) {
            return message.ERROR_INVALID_ID // 400
        } else {

            let dadosFeed = await userDAO.selectFeed(idUsuario)

            if (dadosFeed) {

                if (dadosFeed.length > 0) {

                    const promise = dadosFeed.map(async (post) => {

                        let usuario = await getBuscarUsuario(post.id_dono_publicacao)
                        post.dono_publicacao = usuario.usuario[0]

                        let images = await getBuscarImages(post.id_publicacao, post.tipo)
                        post.imagens = images.imagens

                    })

                    await Promise.all(promise)

                    usuarioJSON.feed = dadosFeed
                    usuarioJSON.status_code = 200
                    usuarioJSON.quantidade = dadosFeed.length

                    return usuarioJSON

                } else {
                    return message.ERROR_NOT_FOUND // 404
                }

            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }
        }
    } catch (error) {
        console.log(error);
        message.ERROR_INTERNAL_SERVER // 500
    }
}

const getListarUsuarios = async () => {

    try {

        let usuarioJSON = {}
        let dadosUsuario = await userDAO.selectAllUsuarios()

        if (dadosUsuario) {

            if (dadosUsuario.length > 0) {

                usuarioJSON.usuarios = dadosUsuario
                usuarioJSON.quantidade = dadosUsuario.length
                usuarioJSON.status_code = 200
                return usuarioJSON

            } else {

                console.log(dadosUsuario);
                return message.ERROR_NOT_FOUND // 404
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }

    } catch (error) {
        console.log(error);
        message.ERROR_INTERNAL_SERVER // 500
    }

}

const getBuscarImages = async (id, postType) => {

    try {

        let imagemJSON = {}

        if (id == '' || id == undefined || isNaN(id) ||
            postType != 'postagem' && postType != 'produto') {
            return message.ERROR_INVALID_ID // 400
        } else {

            let dadosImages = await userDAO.selectImages(id, postType)

            if (dadosImages) {

                if (dadosImages.length > 0) {

                    imagemJSON.imagens = dadosImages
                    imagemJSON.status_code = 200
                    imagemJSON.quantidade = dadosImages.length

                    return imagemJSON

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

const setAtualizarUsuario = async (dadosUsuario, contentType, id_usuario) => {
    if (String(contentType).toLowerCase() == 'application/json') {

        let updateUsuarioJson = {}
        try {

            const validaId = await getBuscarUsuario(id_usuario)

            if (validaId.status != false) {

                let id_user = id_usuario
                let nome = dadosUsuario.nome
                let nome_usuario = dadosUsuario.nome_usuario
                let foto_usuario = dadosUsuario.foto_usuario
                let descricao = dadosUsuario.descricao
                let email = dadosUsuario.email
                let senha = dadosUsuario.senha
                let cpf = dadosUsuario.cpf
                let data_nascimento = dadosUsuario.data_nascimento
                let telefone = dadosUsuario.telefone
                let avaliacao = dadosUsuario.avaliacao
                let disponibilidade = dadosUsuario.disponibilidade

                if (
                    nome != '' &&
                    nome != undefined &&
                    nome != null &&
                    nome.length < 150
                ) {
                    updateUsuarioJson.nome = nome.replace(/'/g, "|")
                } else if (
                    nome == '' &&
                    nome == undefined &&
                    nome == null
                ) { }

                if (
                    nome_usuario != '' &&
                    nome_usuario != undefined &&
                    nome_usuario != null &&
                    nome_usuario.length < 150
                ) {

                    updateUsuarioJson.nome_usuario = nome_usuario.replace(/'/g, "|")
                } else if (
                    nome_usuario == '' &&
                    nome_usuario == undefined &&
                    nome_usuario == null
                ) { }

                if (
                    foto_usuario != '' &&
                    foto_usuario != undefined &&
                    foto_usuario != null &&
                    foto_usuario.length <= 300
                ) {
                    updateUsuarioJson.foto_usuario = foto_usuario
                } else if (
                    foto_usuario == '' &&
                    foto_usuario == undefined &&
                    foto_usuario == null
                ) { }

                if (
                    descricao != '' &&
                    descricao != undefined &&
                    descricao != null &&
                    descricao.length <= 300
                ) {
                    updateUsuarioJson.descricao = descricao.replace(/'/g, "|")
                } else if (
                    descricao == '' &&
                    descricao == undefined &&
                    descricao == null
                ) { }

                if (
                    email != '' &&
                    email != undefined &&
                    email != null &&
                    email.length == 50
                ) {
                    updateUsuarioJson.email = email
                } else if (
                    email == '' &&
                    email == undefined &&
                    email == null
                ) { }

                if (
                    senha != '' &&
                    senha != undefined &&
                    senha != null &&
                    senha.length < 16
                ) {
                    updateUsuarioJson.senha = senha
                } else if (
                    senha == '' &&
                    senha == undefined &&
                    senha == null
                ) { }

                if (
                    cpf != '' &&
                    cpf != undefined &&
                    cpf != null &&
                    cpf.length == 11
                ) {
                    updateUsuarioJson.cpf = cpf
                } else if (
                    cpf == '' &&
                    cpf == undefined &&
                    cpf == null
                ) { }

                if (
                    data_nascimento != '' &&
                    data_nascimento != undefined &&
                    data_nascimento != 10
                ) {
                    updateUsuarioJson.data_nascimento = data_nascimento
                } else if (
                    data_nascimento == '' &&
                    data_nascimento == undefined &&
                    data_nascimento == null
                ) { }

                if (
                    telefone != '' &&
                    telefone != undefined &&
                    telefone != null &&
                    telefone.length == 11
                ) {
                    updateUsuarioJson.telefone = telefone
                } else if (
                    telefone == '' &&
                    telefone == undefined &&
                    telefone == null
                ) { }

                if (
                    disponibilidade !== '' &&
                    disponibilidade !== undefined
                ) {
                    updateUsuarioJson.disponibilidade = disponibilidade
                } else if (
                    disponibilidade === '' &&
                    disponibilidade === undefined
                ) { }

                if (
                    avaliacao != '' &&
                    avaliacao != undefined &&
                    avaliacao != null
                ) {
                    updateUsuarioJson.avaliacao = avaliacao
                } else if (
                    avaliacao == '' &&
                    avaliacao == undefined &&
                    avaliacao == null &&
                    isNaN(avaliacao)
                ) { }

                const usuarioAtualizado = await userDAO.updateUsuario(id_user, updateUsuarioJson)

                let updatedUserJson = {}

                if (usuarioAtualizado) {

                    updatedUserJson.id = id_user
                    updatedUserJson.status = message.UPDATED_ITEM.status
                    updatedUserJson.status_code = message.UPDATED_ITEM.status_code
                    updatedUserJson.message = message.UPDATED_ITEM.message
                    updatedUserJson.usuario = id_user

                    return updatedUserJson
                } else {

                    return message.ERROR_INTERNAL_SERVER_DB
                }
            } else {
                return message.ERROR_NOT_FOUND
            }

        } catch (error) {

            console.log(error, "model/DAO/controller-user.js => setAtualizarUsuario");

            return message.ERROR_INTERNAL_SERVER_DB
        }
    } else {
        return message.ERROR_CONTENT_TYPE
    }
}

const getValidarUsuarioNome = async (nomeUsuario, senhaUsuario, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let nome = nomeUsuario
            let senha = senhaUsuario
            let usuarioJSON = {}

            if (nome == '' || nome == undefined || senha == '' || senha == undefined) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let dadosUsuario = await userDAO.selectValidacaoUsuarioNome(nome, senha)

                if (dadosUsuario) {
                    if (dadosUsuario.length > 0) {
                        let usuario = dadosUsuario

                        usuarioJSON.status = message.VALIDATED_ITEM.status
                        usuarioJSON.status_code = message.VALIDATED_ITEM.status_code
                        usuarioJSON.message = message.VALIDATED_ITEM.message
                        usuarioJSON.usuario = usuario

                        return usuarioJSON
                    } else {
                        return message.ERROR_NOT_FOUND
                    }
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getValidarUsuarioEmail = async (emailUsuario, senhaUsuario, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let email = emailUsuario
            let senha = senhaUsuario
            let usuarioJSON = {}

            if (email == '' || email == undefined || senha == '' || senha == undefined) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let dadosUsuario = await userDAO.selectValidacaoUsuarioEmail(email, senha)

                if (dadosUsuario) {
                    if (dadosUsuario.length > 0) {
                        let usuario = dadosUsuario

                        usuarioJSON.status = message.VALIDATED_ITEM.status
                        usuarioJSON.status_code = message.VALIDATED_ITEM.status_code
                        usuarioJSON.message = message.VALIDATED_ITEM.message
                        usuarioJSON.usuario = usuario

                        return usuarioJSON
                    } else {
                        return message.ERROR_NOT_FOUND
                    }
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getEmailCadastrado = async (emailUsuario, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let email = emailUsuario
            let usuarioJSON = {}

            if (!email || email === '') {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let dadosUsuario = await userDAO.selectEmailCadastrado(email)

                if (dadosUsuario) {
                    if (dadosUsuario.length > 0) {
                        let usuario = dadosUsuario

                        usuarioJSON.status = message.VALIDATED_ITEM.status
                        usuarioJSON.status_code = message.VALIDATED_ITEM.status_code
                        usuarioJSON.message = message.VALIDATED_ITEM.message
                        usuarioJSON.usuario = usuario

                        return usuarioJSON
                    } else {
                        return message.ERROR_NOT_FOUND
                    }
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const setExcluirUsuario = async function (id) {
    try {

        let id_usuario = id;
        let deleteUsuarioJson = {}


        if (id_usuario == '' || id_usuario == undefined || isNaN(id_usuario)) {
            return message.ERROR_INVALID_ID;
        } else {
            const validaId = await userDAO.selectByIdUsuarioAtivo(id_usuario)

            console.log(validaId);


            if (validaId.length > 0) {

                let usuario_status = "0"

                deleteUsuarioJson.usuario_status = usuario_status

                let dadosUsuario = await userDAO.updateUsuario(id_usuario, deleteUsuarioJson)

                if (dadosUsuario) {
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

const setReativarUsuario = async function (id) {
    try {

        let id_usuario = id;
        let reativarUsuarioJson = {}


        if (id_usuario == '' || id_usuario == undefined || isNaN(id_usuario)) {
            return message.ERROR_INVALID_ID;
        } else {
            const validaId = await userDAO.selectByIdUsuarioInativo(id_usuario)

            console.log(validaId);


            if (validaId.length > 0) {

                let usuario_status = "1"

                reativarUsuarioJson.usuario_status = usuario_status

                let dadosUsuario = await userDAO.updateUsuario(id_usuario, reativarUsuarioJson)

                if (dadosUsuario) {
                    return message.REACTIVATED_ITEM
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

const setAtualizarSenha = async (dadosUsuario, contentType, id_usuario) => {
    if (String(contentType).toLowerCase() == 'application/json') {

        let id_user = id_usuario
        let updateSenhaJSON = {}
        try {

            const validaId = await userDAO.selectByIdUsuarioAtivo(id_user)

            if (validaId) {

                let senha = dadosUsuario.senha

                if (
                    senha != '' &&
                    senha != undefined &&
                    senha != null &&
                    senha.length < 100
                ) {
                    updateSenhaJSON.senha = senha
                } else if (
                    senha == '' &&
                    senha == undefined &&
                    senha == null
                ) { }



                console.log(updateSenhaJSON);

                const senhaUpdate = await userDAO.updateUsuario(id_user, updateSenhaJSON)

                console.log(senhaUpdate);

                if (senhaUpdate != false) {
                    updateSenhaJSON.id = validaId
                    updateSenhaJSON.status = message.UPDATED_ITEM.status
                    updateSenhaJSON.status_code = message.UPDATED_ITEM.status_code
                    updateSenhaJSON.message = message.UPDATED_ITEM.message
                    updateSenhaJSON.senha = senhaUpdate

                    return updateSenhaJSON
                } else {

                    console.log(senhaUpdate);

                    return message.ERROR_INTERNAL_SERVER_DB
                }
            } else {
                return message.ERROR_NOT_FOUND
            }

        } catch (error) {

            console.log(error, "model/DAO/controller-user.js => setAtualizarSenha");

            return message.ERROR_INTERNAL_SERVER_DB
        }
    } else {
        return message.ERROR_CONTENT_TYPE
    }
}

const getBuscarApelido = async (nomeUsuario, cliente) => {
    try {

        let nome_usuario = nomeUsuario
        let usuarioJSON = {}

        if (nome_usuario == '' || nome_usuario == undefined) {
            console.log(nome_usuario);
            return message.ERROR_REQUIRED_FIELDS

        } else {

            let dadosUsuario = await userDAO.selectUserByNickname(nome_usuario, cliente)

            if (dadosUsuario) {

                if (dadosUsuario.length > 0) {

                    let postagensUsuario = await userDAO.selectPostsByUserId(dadosUsuario[0].id, cliente)
                    let pastasUsuario = await userDAO.selectFoldersByUser(dadosUsuario[0].id)

                    if (postagensUsuario) {
                        dadosUsuario[0].publicacoes = postagensUsuario
                    }

                    if (pastasUsuario) {
                        dadosUsuario[0].pastas = pastasUsuario
                    }

                    const promise = postagensUsuario.map(async (post) => {

                        let images = await getBuscarImages(post.id_publicacao, post.tipo)
                        post.imagens = images.imagens

                    })

                    await Promise.all(promise)

                    usuarioJSON.status = message.VALIDATED_ITEM.status
                    usuarioJSON.status_code = message.VALIDATED_ITEM.status_code
                    usuarioJSON.message = message.VALIDATED_ITEM.message
                    usuarioJSON.usuario = dadosUsuario[0]

                    return usuarioJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getBuscarFavoritos = async (idUsuario) => {
    try {
        let id_usuario = idUsuario;
        let itensFavoritosJson = {};

        if (!id_usuario) {
            console.log(id_usuario);
            return message.ERROR_REQUIRED_FIELDS;
        } else {

            // Busca o ID do usuário com o nome de usuário
            let itensFavoritos = await userDAO.selectFavoriteById(id_usuario);

            if (itensFavoritos && itensFavoritos.length > 0) {

                // Mapeia favoritos para buscar imagens, se necessário
                const promise = itensFavoritos.map(async (fav) => {

                    let usuario = await getBuscarUsuario(fav.id_dono_publicacao)
                    fav.dono_publicacao = usuario.usuario[0]

                    let images = await getBuscarImages(fav.id_publicacao, fav.tipo);
                    fav.imagens = images.imagens;

                })

                await Promise.all(promise);

                // Monta a resposta JSON final
                itensFavoritosJson.status = message.VALIDATED_ITEM.status;
                itensFavoritosJson.status_code = message.VALIDATED_ITEM.status_code;
                itensFavoritosJson.message = message.VALIDATED_ITEM.message;
                itensFavoritosJson.itens = itensFavoritos;

                return itensFavoritosJson;

            } else {
                return message.ERROR_NOT_FOUND;
            }
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

const getUserFolders = async (idUsuario) => {
    try {

        let pastasJSON = {};

        if (!idUsuario) {
            return message.ERROR_REQUIRED_FIELDS;
        } else {

            let pastas = await userDAO.selectFoldersByUser(idUsuario);

            if (pastas) {

                pastasJSON.status = message.VALIDATED_ITEM.status;
                pastasJSON.status_code = message.VALIDATED_ITEM.status_code;
                pastasJSON.message = message.VALIDATED_ITEM.message;
                pastasJSON.pastas = pastas;

                return pastasJSON;

            } else {
                return message.ERROR_NOT_FOUND;
            }
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};


module.exports = {
    setNovoUsuario,
    setAtualizarUsuario,
    setExcluirUsuario,
    getBuscarUsuario,
    getListarUsuarios,
    getValidarUsuarioNome,
    getValidarUsuarioEmail,
    setReativarUsuario,
    getEmailCadastrado,
    setAtualizarSenha,
    getFeed,
    getBuscarImages,
    getBuscarApelido,
    getBuscarFavoritos,
    getBuscarItensByText,
    getUserFolders
}
