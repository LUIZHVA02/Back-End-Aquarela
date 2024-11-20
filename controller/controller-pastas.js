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

                let novaPasta = await pastasDAO.insertNovaPasta(dadosPasta)

                if (novaPasta) {

                    const idPasta = await pastasDAO.selectLastId()
                    dadosPasta.id_pasta = Number(idPasta[0].id)

                    resultDadosPasta.status = message.CREATED_ITEM.status
                    resultDadosPasta.status_code = message.CREATED_ITEM.status_code
                    resultDadosPasta.status = message.CREATED_ITEM.message
                    resultDadosPasta.pasta = dadosPasta

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
                pastaJSON.folders = dadosPasta
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

                    updatePastaJson.id = id_pasta
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

const setExcluirPasta = async function (id) {
    try {

        let id_pasta = id;
        let deletePastaJson = {}


        if (id_pasta == '' || id_pasta == undefined) {
            return message.ERROR_INVALID_ID;
        } else {
            const validaId = await pastasDAO.selectByIdPasta(id_pasta)

            console.log(validaId);


            if (validaId.length > 0) {

                let pasta_status = "0"

                deletePastaJson.pasta_status = pasta_status

                let dadosPasta = await pastasDAO.updatePasta(id_pasta, deletePastaJson)

                if (dadosPasta) {
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
    setNovaPasta,
    getListPastas,
    setUpdatePasta,
    setExcluirPasta
}