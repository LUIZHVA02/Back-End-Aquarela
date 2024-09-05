const usuarioDAO = require('../model/DAO/usuario.js')
const message = require('../modulo/config.js')

const setNovoUsuario = async (dadosUsuario, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosUsuario = {}

            if (
                dadosUsuario.nome == '' || dadosUsuario.nome == undefined || dadosUsuario.nome.lenght > 150 ||
                dadosUsuario.nome_usuario == '' || dadosUsuario.nome_usuario == undefined || dadosUsuario.nome_usuario > 150 ||
                dadosUsuario.foto_usuario == '' || dadosUsuario.foto_usuario == undefined || dadosUsuario.foto_usuario > 300 ||
                dadosUsuario.descricao == '' || dadosUsuario.descricao == undefined || dadosUsuario.descricao.lenght > 300 ||

                dadosUsuario.email == '' || dadosUsuario.email == undefined || dadosUsuario.email.lenght > 50 ||
                dadosUsuario.senha == '' || dadosUsuario.senha == undefined || dadosUsuario.senha.lenght > 16 ||
                dadosUsuario.cpf == '' || dadosUsuario.cpf == undefined || dadosUsuario.cpf.lenght != 11 ||
                dadosUsuario.data_nascimento == '' || dadosUsuario.data_nascimento == undefined || dadosUsuario.data_nascimento != 10 ||
                dadosUsuario.telefone == '' || dadosUsuario.telefone == undefined || dadosUsuario.telefone.lenght != 11 ||
                dadosUsuario.disponibilidade == '' || dadosUsuario.disponibilidade == undefined
            ) {

                return message.ERROR_REQUIRED_FIELDS

            } else {
                let novoUsuario = await usuarioDAO.insertUsuario(dadosUsuario)

                let id = await usuarioDAO.selectLastId()

                dadosUsuario.id = Number(id[0].id)

                if (novoUsuario) {
                    resultDadosUsuario.status == message.CREATED_ITEM.status
                    resultDadosUsuario.status_code == message.CREATED_ITEM.status_code
                    resultDadosUsuario.status == message.CREATED_ITEM.message
                    resultDadosUsuario.usuario == dadosUsuario
                    return dadosUsuario

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

const setAtualizarUsuario = async (dadosUsuario, contentType, id_usuario) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let resultDadosUsuario = {}

            if (
                id_usuario == '' || id_usuario == undefined ||
                dadosUsuario.nome == '' || dadosUsuario.nome == undefined || dadosUsuario.nome.lenght > 150 ||
                dadosUsuario.nome_usuario == '' || dadosUsuario.nome_usuario == undefined || dadosUsuario.nome_usuario.lenght > 150 ||
                dadosUsuario.foto_usuario == '' || dadosUsuario.foto_usuario == undefined || dadosUsuario.foto_usuario.lenght > 300 ||
                dadosUsuario.descricao == '' || dadosUsuario.descricao == undefined || dadosUsuario.descricao.lenght > 300 ||
                dadosUsuario.email == '' || dadosUsuario.email == undefined || dadosUsuario.email.lenght > 50 ||
                dadosUsuario.senha == '' || dadosUsuario.senha == undefined || dadosUsuario.senha.lenght > 16 ||
                dadosUsuario.data_nascimento == '' || dadosUsuario.data_nascimento == undefined || dadosUsuario.data_nascimento.lenght != 11
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let usuarioAtualizado = await usuarioDAO.updateUsuario(dadosUsuario, id_usuario)

                dadosUsuario.id = id_usuario

                if (usuarioAtualizado) {
                    resultDadosUsuario.status == message.UPDATED_ITEM.status
                    resultDadosUsuario.status_code == message.UPDATED_ITEM.status_code
                    resultDadosUsuario.status == message.UPDATED_ITEM.message
                    resultDadosUsuario.usuario == dadosUsuario
                    return dadosUsuario
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

const setAtualizarUsuarioSenha = async(dadosUsuario, contentType, id_usuario) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosUsuario = {}
        
            if( 
                id_usuario == ''          || id_usuario == undefined          ||
                dadosUsuario.nome == ''  || dadosUsuario.nome == undefined  || dadosUsuario.nome.length > 100  ||
                dadosUsuario.email == '' || dadosUsuario.email == undefined || dadosUsuario.email.length > 100 ||
                dadosUsuario.senha == '' || dadosUsuario.senha == undefined || dadosUsuario.senha.length > 50 
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let usuarioAtualizado = await usuarioDAO.updateUsuarioSenha(dadosUsuario, id_usuario)
                                        
                dadosUsuario.id = id_usuario

                if(usuarioAtualizado){
                    resultDadosUsuario.status = message.UPDATED_ITEM.status
                    resultDadosUsuario.status_code = message.UPDATED_ITEM.status_code
                    resultDadosUsuario.message = message.UPDATED_ITEM.message
                    resultDadosUsuario.usuario = dadosUsuario
                    return resultDadosUsuario
                }else {

                    return message.ERROR_INTERNAL_SERVER_DB // 500

                }
                
            }
    
        }else{
            return message.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

// const setExcluirUsuario = async(id) => {
//     try {
//         let id_usuario = id 
//         let validacaoUsuario = 
//     } catch (error) {

//     }
// }

const getValidarUsuario = async (email, senha, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let emailUsuario = email
            let senhaUsuario = senha
            let usuarioJSON = {}

            if (emailUsuario == '' || emailUsuario == undefined || senhaUsuario == '' || senhaUsuario == undefined) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let dadosUsuario = await usuarioDAO.selectValidacaoUsuario(emailUsuario, senhaUsuario)

                if (dadosUsuario) {
                    if (dadosUsuario.lenght > 0) {
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
        } else{
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    setNovoUsuario,
    setAtualizarUsuario,
    getValidarUsuario
}