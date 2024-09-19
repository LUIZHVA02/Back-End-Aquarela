const userDAO = require('../model/DAO/user.js')
const message = require('../modulo/config.js')

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
                dadosUsuario.disponibilidade == '' || dadosUsuario.disponibilidade == undefined
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoUsuario = await userDAO.insertUsuario(dadosUsuario)

                let id = await userDAO.selectLastId()

                dadosUsuario.id = Number(id[0].id)

                if (novoUsuario) {
                    resultDadosUsuario.status = message.CREATED_ITEM.status
                    resultDadosUsuario.status_code = message.CREATED_ITEM.status_code
                    resultDadosUsuario.status = message.CREATED_ITEM.message
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
                let disponibilidade = dadosUsuario.disponibilidade
                let user_status = dadosUsuario.user_status

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
                    foto_usuario.length == 300
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
                    descricao.length == 300
                ) {
                    updateUsuarioJson.descricao = descricao
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
                    cpf.length < 11
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
                    telefone.length < 11
                ) {
                    updateUsuarioJson.telefone = telefone
                } else if (
                    telefone == '' &&
                    telefone == undefined &&
                    telefone == null
                ) { }

                if (
                    disponibilidade != '' &&
                    disponibilidade != undefined &&
                    disponibilidade != null
                ) {
                    updateUsuarioJson.disponibilidade = disponibilidade
                } else if (
                    disponibilidade == '' &&
                    disponibilidade == undefined &&
                    disponibilidade == null
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

                const usuarioAtualizado = await userDAO.updateUsuario(id_user, updateUsuarioJson)

                let updatedUserJson = {}

                if (usuarioAtualizado) {

                    updatedUserJson.id = id_user
                    updatedUserJson.status = message.UPDATED_ITEM.status
                    updatedUserJson.status_code = message.UPDATED_ITEM.status_code
                    updatedUserJson.message = message.UPDATED_ITEM.message
                    updatedUserJson.usuario = usuarioAtualizado

                    return updatedUserJson
                } else {

                    console.log(usuarioAtualizado);

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

const getBuscarUsuario = async (id) => {

    try {

        let id_usuario = id
        let usuarioJSON = {}

        if (id_usuario == '' || id_usuario == undefined || isNaN(id_usuario)) {

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosUsuario = await userDAO.selectByIdUsuario(id_usuario)

            if (dadosUsuario) {

                if (dadosUsuario.length > 0) {

                    usuarioJSON.usuario = dadosUsuario
                    usuarioJSON.status_code = 200

                    

                    // let arraysDadosTratado = []
                    // let jsonDadosTratados = {}

                    // let id_user = id
                    // let nome = rsUsuario[0].nome
                    // let nome_usuario = rsUsuario[0].nome_usuario
                    // let foto_usuario = rsUsuario[0].foto_usuario
                    // let descricao = rsUsuario[0].descricao
                    // let email = rsUsuario[0].email
                    // let senha = rsUsuario[0].senha
                    // let cpf = rsUsuario[0].cpf
                    // let data_nascimento = rsUsuario[0].data_nascimento
                    // let telefone = rsUsuario[0].telefone
                    // let disponibilidade = rsUsuario[0].disponibilidade
                    // let user_status = rsUsuario[0].user_status


                    // tratado = id_user
                    // tratado = nome
                    // tratado = nome_usuario
                    // tratado = foto_usuario
                    // tratado = descricao
                    // tratado = email
                    // tratado = senha
                    // tratado = cpf
                    // tratado = tratarDataBACK(data_nascimento)
                    // tratado = telefone
                    // tratado = disponibilidade
                    // tratado = user_status

                    return usuarioJSON

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
        message.ERROR_INTERNAL_SERVER // 500
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
        console.log(error);
        
        return message.ERROR_INTERNAL_SERVER
    }
}

const setExcluirUsuario = async function (id) {
    try {

        let id_usuario = id;

        if (id_usuario == '' || id_usuario == undefined || isNaN(id_usuario)) {
            return message.ERROR_INVALID_ID;
        } else {
            let user = await userDAO.selectByIdUsuario(id_usuario)

            if (user.length > 0) {
                let dadosUsuario = await userDAO.deleteUsuarioById(id)

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
        return message.ERROR_INTERNAL_SERVER
    }

}

module.exports = {
    setNovoUsuario,
    setAtualizarUsuario,
    setExcluirUsuario,
    getBuscarUsuario,
    getListarUsuarios,
    getValidarUsuarioNome,
    getValidarUsuarioEmail
}