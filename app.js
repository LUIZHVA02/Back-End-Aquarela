/****************************************************************************************************************************************************
* Objetivo: Cria uma API para respoder os dados de cadastro
* Data: 05/09/2024
* Autor: Luiz Vidal, Luan Oliveira, Pedro Barbosa, Ryan Alves & Vitória Azevedo
* Versão: 1.0
****************************************************************************************************************************************************/

/** Instalações da dependência para criação da API
 *  
 *  npm         -  "Comandos de instalação"
 *                  "npm install"
 *                  "npm run build --if-present"
 *                  "npm run test --if-present"
 *
 *              -  "Comando de update"
 *                  "npm install -g npm@latest"
 * 
 *  express     - "npm install express --save"  
 *      {
 *          Dependência do node para auxiliar na criação da API
 *      }
 * 
 *  cors        - "npm install cors --save" 
 *      {
 *          [Dependência para manipular recursos de acesso, permissões, etc da API]
 *          [Trabalha com as informações no Head(Front-End - html)]
 *      }
 * 
 *  body-parser - "npm install body-parser --save" 
 *      {
 *          [É uma dependência para auxiliar na chegada de dados na API]
 *          [Trabalha com as informações no Body(Front-End - html)]
 *      }
 * 
 * instalação do PRISMA ORM
 *          npm install prisma --save (É quem realiza a conexão com o banco de dados)
 *          npm install @prisma/client --save (É quem executa os scripts SQL no BD)
 * 
 *      Após as intalações devemos rodar o comando:
 *          npx prisma init (Esse comando inicializa a utilização do projeto)
 *          npx prisma db pull
 *          npx prisma generate
 * 
 *      Caso ocorra algum problema, execute:
 *          npm i 
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use((request, response, next) => {

    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,OPTIONS')

    app.use(cors())

    next()
})

const bodyParserJson = bodyParser.json()

/**************************** Imports de arquivos e bibliotecas do Projeto ******************************/
const controllerUsuarios = require('./controller/controller-user.js')
const controllerAddress = require('./controller/controller-address.js')
/********************************************************************************************************/

app.get('/v1/aquarela/buscarUsuarios', cors(), async function (request, response, next) {

    let infoFilmes = await controllerUsuarios.getListarUsuarios()

    if (infoFilmes) {
        response.json(infoFilmes)
        response.status(200)
    } else {
        response.status(404)
        response.json({ erro: 'Não foi possível encontrar um item!' })
    }
})

app.get('/v1/aquarela/buscarUsuario/:id', cors(), async function (request, response, next) {

    let id = request.params.id

    let infoFilmes = await controllerUsuarios.getBuscarUsuario(id)

    if (infoFilmes) {
        response.json(infoFilmes)
        response.status(200)
    } else {
        response.status(404)
        response.json({ erro: 'Não foi possível encontrar um item!' })
    }
})

app.post('/v1/aquarela/inserirUsuarios', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosUsuario = await controllerUsuarios.setNovoUsuario(dadosBody, contentType)
    response.status(resultDadosUsuario.status_code)
    
    console.log(resultDadosUsuario);

    response.json(resultDadosUsuario)
    
})

app.put('/v1/aquarela/updateUsuario/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerUsuarios.setAtualizarUsuario(dadosBody, contentType, id_usuario)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

app.put('/v1/aquarela/deleteUsuario/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id

    let resultDados = await controllerUsuarios.setExcluirUsuario(id_usuario);

    response.status(resultDados.status_code);
    response.json(resultDados);
})

app.put('/v1/aquarela/reativarUsuario/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id

    let resultDados = await controllerUsuarios.setReativarUsuario(id_usuario);

    response.status(resultDados.status_code);
    response.json(resultDados);
})

app.post('/v1/aquarela/validacao/usuario/nome', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerUsuarios.getValidarUsuarioNome(dadosBody.nome, dadosBody.senha, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})

app.post('/v1/aquarela/validacao/usuario/email', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerUsuarios.getValidarUsuarioEmail(dadosBody.email, dadosBody.senha, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})


/******************************************************** Endpoints Endereço ********************************************************/

app.get('/v1/aquarela/searchAddress', cors(), bodyParserJson, async (request, response, next) => {

    let searchAddress = await controllerAddress.getListAddres()

    if (searchAddress) {
        response.json(searchAddress)
        response.status(searchAddress.status_code)
    } else {
        response.status(searchAddress.status_code)
        response.json(searchAddress)
    }
})

app.post('/v1/aquarela/insertAddress', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultdataAddress = await controllerAddress.setNewAddress(dadosBody, contentType)
    console.log(resultdataAddress)
    response.status(resultdataAddress.status_code)
    

    response.json(resultdataAddress)
    
})

app.put('/v1/aquarela/updateAddress/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_endereco = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerAddress.setUpdateAddress(dadosBody, contentType, id_endereco)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

app.get('/v1/aquarela/searchAddress/:id', cors(), async function (request, response, next) {

    let id = request.params.id

    let infoAddress = await controllerAddress.getSearchAddress(id)

    if (infoAddress) {
        response.json(infoAddress)
        response.status(200)
    } else {
        response.status(404)
        response.json({ erro: 'Não foi possível encontrar um item!' })
    }
})

app.delete('/v1/aquarela/deleteAddress/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_address = request.params.id

    let resultDados = await controllerAddress.setDeleteAddress(id_address);

    response.status(resultDados.status_code);
    response.json(resultDados);
})


const port = process.env.PORT || 8080
app.listen(port, () => {console.log('API funcionando na porta ' + port)})