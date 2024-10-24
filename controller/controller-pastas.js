const pastasDAO = require('../model/DAO/pastas.js')
const message = require('../modulo/config.js')

const setNovaPasta = async (dadosPasta, contentType) => {
    try {
        console.log(dadosPasta);
        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosPasta = {}

            if (
                dadosPasta.nome == '' || dadosPasta.nome == undefined || dadosPasta.nome == null ||
                isNaN(dadosPasta.id_usuario) || dadosPasta.id_usuario == undefined || dadosPasta.id_usuario == null
            ) {
                console.log(dadosPasta);

                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoProduto = await pastasDAO.insertNovaPasta(dadosPasta)

                if (novoProduto) {
                    resultDadosPasta.status = message.CREATED_ITEM.status
                    resultDadosPasta.status_code = message.CREATED_ITEM.status_code
                    resultDadosPasta.status = message.CREATED_ITEM.message
                    resultDadosPasta.produto = dadosPasta

                    return resultDadosPasta

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("Erro ao tentar inserir pasta: " + error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListPastas = async () => {
    try {

        let pastaJSON = {}
        let dadosPasta = await pastasDAO.selectAllPasta()

        if (dadosPasta) {

            if (dadosPasta.length > 0) {
                pastaJSON.address = dadosPasta
                pastaJSON.quantity = dadosPasta.length
                pastaJSON.status_code = 200
                return pastaJSON
            } else {
                console.log(dadosPasta.length, "getListPastas");

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

const setUpdatePasta = async (dadosPasta, contentType, id_folder) => {
    if (String(contentType).toLowerCase() == 'application/json') {

        let updatePastaJson = {}

        try {
            
            let id_pasta = id_folder

            const validaId = await pastasDAO.selectByIdPasta(id_pasta)

            if (validaId.status != false) {

                let nome = dadosPasta.nome

                if (
                    nome != '' &&
                    nome != undefined &&
                    nome != null &&
                    nome.length < 100
                ) {
                    updatePastaJson.nome = nome.replace(/'/g, "|")
                } else if (
                    nome == '' &&
                    nome == undefined &&
                    nome == null
                ) { }      

                
            
                const pastaUpdate = await pastasDAO.updatePasta(id_pasta, updatePastaJson)

                if (pastaUpdate) {

                    updatePastaJson.id = id_produto
                    updatePastaJson.status = message.UPDATED_ITEM.status
                    updatePastaJson.status_code = message.UPDATED_ITEM.status_code
                    updatePastaJson.message = message.UPDATED_ITEM.message
                    updatePastaJson.pasta = pastaUpdate

                    return updatePastaJson
                } else {

                    console.log(pastaUpdate);

                    return message.ERROR_INTERNAL_SERVER_DB
                }
            } else {
                return message.ERROR_NOT_FOUND
            }

        } catch (error) {

            console.log(error, "model/DAO/controller-produto.js => setUpdatepastas");

            return message.ERROR_INTERNAL_SERVER_DB
        }
    } else {
        return message.ERROR_CONTENT_TYPE
    }
}

// const setExcluirProduto = async function (id) {
//     try {

//         let id_produto = id;
//         let deleteProdutoJson = {}


//         if (id_produto == '' || id_produto == undefined) {
//             return message.ERROR_INVALID_ID;
//         } else {
//             const validaId = await produtoDAO.selectByIdpastas(id_produto)

//             console.log(validaId);


//             if (validaId.length > 0) {

//                 let produto_status = "0"

//                 deleteProdutoJson.produto_status = produto_status

//                 let dadosPasta = await produtoDAO.updatepasta(id_produto, deleteProdutoJson)

//                 if (dadosPasta) {
//                     return message.DELETED_ITEM
//                 } else {
//                     return message.ERROR_INTERNAL_SERVER_DB
//                 }

//             } else {
//                 return message.ERROR_NOT_FOUND
//             }
//         }
//     } catch (error) {
//         return message.ERROR_INTERNAL_SERVER
//     }

// }

module.exports = {
    setNovaPasta,
    getListPastas,
    setUpdatePasta
}