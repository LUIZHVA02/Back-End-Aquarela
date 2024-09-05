/****************************************************************************************************************************************************
* Objetivo: Cria uma API para respoder os dados de cadastro
* Data: 05/09/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

/**************************** Imports de arquivos e bibliotecas do Projeto ******************************/
const controllerUsuarios = require('./controller/controller-user')
/********************************************************************************************************/

const app = express()
const bodyParserJson = bodyParser.json()

app.use((request, response, next) => {

    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', '*')
    app.use(cors())
    next()

})

app.get('/v1/aquarela/usuario/:id', cors(), async (request, response, next) => {

    let id_usuario = request.params.id
    let dadosUsuario = await controllerUsuarios.getBuscarUsuario(id_usuario)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})

app.post('/v1/aquarela/usuario', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosUsuario = await controllerUsuarios.setNovoUsuario(dadosBody, contentType)
    response.status(resultDadosUsuario.status_code)
    response.json(resultDadosUsuario)
})

app.post('/v1/aquarela/usuario', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerUsuarios.getValidarUsuario(dadosBody.email, dadosBody.senha, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})

app.put('/v1/aquarela/usuario/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerUsuarios.setAtualizarUsuario(dadosBody, contentType, id_usuario)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

const port = process.env.PORT || 8080


app.listen(port, () => {console.log('API funcionando na porta ' + port)})