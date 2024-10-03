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
const controllerProduto = require('./controller/controller-produto.js')
const controllerCategoria = require('./controller/controller-categoria.js')
const controllerSeguidores = require('./controller/controller-seguidores.js')
const controllerPostagem = require('./controller/controller-postagem.js')
/******************************************************** Endpoints Usuários ********************************************************/

app.post('/v1/aquarela/user', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosUsuario = await controllerUsuarios.setNovoUsuario(dadosBody, contentType)
    response.status(resultDadosUsuario.status_code)
    
    console.log(resultDadosUsuario);

    response.json(resultDadosUsuario)
    
})

app.get('/v1/aquarela/user/:id', cors(), async function (request, response, next) {

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

app.get('/v1/aquarela/users', cors(), async function (request, response, next) {

    let infoFilmes = await controllerUsuarios.getListarUsuarios()

    if (infoFilmes) {
        response.json(infoFilmes)
        response.status(200)
    } else {
        response.status(404)
        response.json({ erro: 'Não foi possível encontrar um item!' })
    }
})

app.put('/v1/aquarela/user/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerUsuarios.setAtualizarUsuario(dadosBody, contentType, id_usuario)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

app.put('/v1/aquarela/delete/user/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id

    let resultDados = await controllerUsuarios.setExcluirUsuario(id_usuario);

    response.status(resultDados.status_code);
    response.json(resultDados);
})

app.put('/v1/aquarela/reactivate/user/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id

    let resultDados = await controllerUsuarios.setReativarUsuario(id_usuario);

    response.status(resultDados.status_code);
    response.json(resultDados);
})

app.post('/v1/aquarela/authentication/user/name', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerUsuarios.getValidarUsuarioNome(dadosBody.nome, dadosBody.senha, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})

app.post('/v1/aquarela/authentication/user/email', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerUsuarios.getValidarUsuarioEmail(dadosBody.email, dadosBody.senha, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})

app.post('/v1/aquarela/user/preferences', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerUsuarios.getValidarUsuarioEmail(dadosBody, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})


/******************************************************** Endpoints Endereço ********************************************************/

app.get('/v1/aquarela/address', cors(), bodyParserJson, async (request, response, next) => {

    let searchAddress = await controllerAddress.getListAddres()

    if (searchAddress) {
        response.json(searchAddress)
        response.status(searchAddress.status_code)
    } else {
        response.status(searchAddress.status_code)
        response.json(searchAddress)
    }
})

app.post('/v1/aquarela/address', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultdataAddress = await controllerAddress.setNewAddress(dadosBody, contentType)
    console.log(resultdataAddress)
    response.status(resultdataAddress.status_code)
    
    response.json(resultdataAddress)
    
})

app.put('/v1/aquarela/address/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_endereco = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerAddress.setUpdateAddress(dadosBody, contentType, id_endereco)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

app.get('/v1/aquarela/address/:id', cors(), async function (request, response, next) {

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

app.put('/v1/aquarela/delete/address/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id

    let resultDados = await controllerUsuarios.setExcluirUsuario(id_usuario);

    response.status(resultDados.status_code);
    response.json(resultDados);
})

app.put('/v1/aquarela/reactivate/address/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id

    let resultDados = await controllerUsuarios.setReativarUsuario(id_usuario);

    response.status(resultDados.status_code);
    response.json(resultDados);
})


/******************************************************** Endpoints Produtos ********************************************************/

app.get('/v1/aquarela/searchProducts', cors(), bodyParserJson, async (request, response, next) => {

    let searchProducts = await controllerProduto.getListProducts()

    if (searchProducts) {
        response.json(searchProducts)
        response.status(searchProducts.status_code)
    } else {
        response.status(searchProducts.status_code)
        response.json(searchProducts)
    }
})

app.post('/v1/aquarela/insertNewProduct', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDataProduct = await controllerProduto.setNovoProduto(dadosBody, contentType)
    console.log(resultDataProduct)
    response.status(resultDataProduct.status_code)
    

    response.json(resultDataProduct)    
    
})

app.put('/v1/aquarela/updateProduct/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_produto = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerProduto.setUpdateProducts(dadosBody, contentType, id_produto)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

/******************************************************** Endpoints Categorias ********************************************************/

app.post('/v1/aquarela/insertNewCategory', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDataCategoria = await controllerCategoria.setNovaCategoria(dadosBody, contentType)
    console.log(resultDataCategoria)
    response.status(resultDataCategoria.status_code)
    

    response.json(resultDataCategoria)    
    
})

/******************************************************** Endpoints Seguidores ********************************************************/

app.get('/v1/aquarela/searchFollowers', cors(), async function (request, response, next) {

    let infoSeguidor = await controllerSeguidores.getListFollowers()

    if (infoSeguidor) {
        response.json(infoSeguidor)
        response.status(200)
    } else {
        response.status(404)
        response.json({ erro: 'Não foi possível encontrar um item!' })
    }
})

app.post('/v1/aquarela/insertNewFollower', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosSeguidores = await controllerSeguidores.setNovoSeguidor(dadosBody, contentType)
    console.log(resultDadosSeguidores)
    response.status(resultDadosSeguidores.status_code)
    

    response.json(resultDadosSeguidores)    
    
})

/******************************************************** Endpoints Postagem ********************************************************/

app.get('/v1/aquarela/searchPosts', cors(), async function (request, response, next) {

    let searchPosts = await controllerPostagem.getListarPostagens()

    if (searchPosts) {
        response.json(searchPosts)
        response.status(200)
    } else {
        response.status(404)
        response.json({ erro: 'Não foi possível encontrar um item!' })
    }
})

app.post('/v1/aquarela/insertNewPost', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosPostagem = await controllerPostagem.setNovaPostagem(dadosBody, contentType)
    console.log(resultDadosPostagem)
    response.status(resultDadosPostagem.status_code)
    

    response.json(resultDadosPostagem)    
    
})

app.get('/v1/aquarela/searchPosts/:id', cors(), async function (request, response, next) {

    let id = request.params.id

    let searchPosts = await controllerPostagem.getBuscarPostagem(id)

    if (searchPosts) {
        response.json(searchPosts)
        response.status(200)
    } else {
        response.status(404)
        response.json({ erro: 'Não foi possível encontrar um item!' })
    }
})

app.put('/v1/aquarela/updatePosts/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_postagem = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerPostagem.setAtualizarPostagem(dadosBody, contentType, id_postagem)
    response.status(resultDados.status_code);
    response.json(resultDados)
})


const port = process.env.PORT || 8080
app.listen(port, () => {console.log('API funcionando na porta ' + port)})