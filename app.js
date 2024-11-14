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
 * 
 *
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
const controllerPreferencias = require('./controller/controller-preferencias-usuario.js')
const controllerPasta = require('./controller/controller-pastas.js')
const controllerConversas = require('./controller/controller-chats.js')
const controllerCarrinho = require('./controller/controller-carrinho.js')

// #region Usuários
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

    let userInfo = await controllerUsuarios.getBuscarUsuario(id)

    response.json(userInfo)
    response.status(userInfo.status_code)
})

app.get('/v1/aquarela/feed/:id', cors(), async function (request, response, next) {

    let id = request.params.id

    let userInfo = await controllerUsuarios.getFeed(id)

    response.json(userInfo)
    response.status(userInfo.status_code)
})


app.get('/v1/aquarela/users', cors(), async function (request, response, next) {

    let userInfo = await controllerUsuarios.getListarUsuarios()

    response.json(userInfo)
    response.status(userInfo.status_code)
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

app.post('/v1/aquarela/authentication/user/email/registered', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerUsuarios.getEmailCadastrado(dadosBody.email, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})

app.put('/v1/aquarela/user/password/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerUsuarios.setAtualizarSenha(dadosBody, contentType, id_usuario)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

app.get('/v1/aquarela/nickname/user/', cors(), bodyParserJson, async (request, response, next) => {

    let nickname = request.query.nickname
    let userClient = request.query.client
    let dadosUsuario = await controllerUsuarios.getBuscarApelido(nickname, userClient)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})

// #region Preferência-Usuário
/******************************************************** Endpoints Preferência-Usuário ********************************************************/

app.get('/v1/aquarela/preferences/user', cors(), bodyParserJson, async (request, response, next) => {

    let listarPreferencias = await controllerPreferencias.getListPreferences()

    response.json(listarPreferencias)
    response.status(listarPreferencias.status_code)
})

app.post('/v1/aquarela/preferences/user', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerPreferencias.adicionarPreferencias(dadosBody, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)
})

app.put('/v1/aquarela/preferences/user/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_preferencia = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerPreferencias.setExcluirPreferencias(dadosBody, contentType, id_preferencia)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

app.put('/v1/aquarela/delete/preferences/user/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_preferencia = request.params.id

    let resultDados = await controllerPreferencias.setExcluirPreferencias(id_preferencia);

    response.status(resultDados.status_code);
    response.json(resultDados);
})


// #region Endereço
/******************************************************** Endpoints Endereço ********************************************************/

app.get('/v1/aquarela/address/user/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id

    let searchUserAddresses = await controllerAddress.getSearchUserAddresses(id_usuario)

    response.json(searchUserAddresses)
    response.status(searchUserAddresses.status_code)
})

app.get('/v1/aquarela/address', cors(), bodyParserJson, async (request, response, next) => {

    let searchAddress = await controllerAddress.getListAddres()

    response.json(searchAddress)
    response.status(searchAddress.status_code)

})

app.post('/v1/aquarela/address', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultdataAddress = await controllerAddress.setNewAddress(dadosBody, contentType)
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

    response.status(infoAddress.status_code);
    response.json(infoAddress);
})

app.put('/v1/aquarela/delete/address/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_address = request.params.id

    let resultDados = await controllerAddress.setExcluirEndereco(id_address);

    response.status(resultDados.status_code);
    response.json(resultDados);
})

app.put('/v1/aquarela/reactivate/address/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_usuario = request.params.id

    let resultDados = await controllerUsuarios.setReativarUsuario(id_usuario);

    response.status(resultDados.status_code);
    response.json(resultDados);
})

// #region Produtos
/******************************************************** Endpoints Produtos ********************************************************/

app.get('/v1/aquarela/products', cors(), bodyParserJson, async (request, response, next) => {

    let searchProducts = await controllerProduto.getListProducts()

    response.json(searchProducts)
    response.status(searchProducts.status_code)

})

app.post('/v1/aquarela/product', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDataProduct = await controllerProduto.setNovoProduto(dadosBody, contentType)
    response.status(resultDataProduct.status_code)
    response.json(resultDataProduct)

})

app.put('/v1/aquarela/product/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_produto = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerProduto.setUpdateProducts(dadosBody, contentType, id_produto)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

app.put('/v1/aquarela/products/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_produto = request.params.id

    let resultDados = await controllerProduto.setExcluirProduto(id_produto);

    response.status(resultDados.status_code);
    response.json(resultDados);
})

app.post('/v1/aquarela/like/product', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosProduto = await controllerProduto.setCurtirProduto(dadosBody, contentType)

    response.status(resultDadosProduto.status_code)
    response.json(resultDadosProduto)

})

app.post('/v1/aquarela/favorite/product', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosProduto = await controllerProduto.setFavoritarProduto(dadosBody, contentType)

    response.status(resultDadosProduto.status_code)
    response.json(resultDadosProduto)

})

app.post('/v1/aquarela/vizualizer/product', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosProduto = await controllerProduto.setVisualizarProduto(dadosBody, contentType)

    response.status(resultDadosProduto.status_code)
    response.json(resultDadosProduto)

})

app.post('/v1/aquarela/folders/products', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosProduto = await controllerProduto.setAdicionarProdutoPasta(dadosBody, contentType)

    response.status(resultDadosProduto.status_code)
    response.json(resultDadosProduto)

})

// #region Carrinho
/********************************************************* Endpoints Carrinho *********************************************************/

app.post('/v1/aquarela/cart/user/', cors(), async (request, response, next) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let carrinhoData = await controllerCarrinho.setNovoCarrinho(dadosBody,contentType)
    response.status(carrinhoData.status_code)
    response.json(carrinhoData)
})

app.get('/v1/aquarela/cart/users/', cors(), async (request, response, next) => {
    let carrinhoData = await controllerCarrinho.getListCarrinho()
    response.status(carrinhoData.status_code)
    response.json(carrinhoData)
})

// #region Categorias
/******************************************************** Endpoints Categorias ********************************************************/

app.post('/v1/aquarela/category', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDataCategoria = await controllerCategoria.setNovaCategoria(dadosBody, contentType)
    response.status(resultDataCategoria.status_code)
    response.json(resultDataCategoria)

})

app.get('/v1/aquarela/categories', cors(), async (request, response, next) => {

    let categoryData = await controllerCategoria.getListCategories()
    response.status(categoryData.status_code)
    response.json(categoryData)

})

app.get('/v1/aquarela/category/:id', cors(), async (request, response, next) => {

    let categoryData = await controllerCategoria.getCategoriesById(id)
    response.status(categoryData.status_code)
    response.json(categoryData)

})

// #region Seguidores
/******************************************************** Endpoints Seguidores ********************************************************/

app.get('/v1/aquarela/followers', cors(), async function (request, response, next) {

    let infoSeguidor = await controllerSeguidores.getListFollowers()

    response.json(infoSeguidor)
    response.status(infoSeguidor.status_code)
})

app.post('/v1/aquarela/follower', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosSeguidores = await controllerSeguidores.setNovoSeguidor(dadosBody, contentType)
    console.log(resultDadosSeguidores)
    response.status(resultDadosSeguidores.status_code)
    response.json(resultDadosSeguidores)

})


app.put('/v1/aquarela/follower/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_seguidores = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerSeguidores.setExcluirSeguidor(dadosBody, contentType, id_seguidores)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

app.post('/v1/aquarela/follower/user', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosSeguidores = await controllerSeguidores.setSeguir(dadosBody, contentType)

    response.status(resultDadosSeguidores.status_code)
    response.json(resultDadosSeguidores)

})

// #region Postagem
/******************************************************** Endpoints Postagem ********************************************************/

app.get('/v1/aquarela/posts', cors(), async function (request, response, next) {

    let searchPosts = await controllerPostagem.getListarPostagens()

    response.json(searchPosts)
    response.status(searchPosts.status_code)
})

app.get('/v1/aquarela/post/:id', cors(), async function (request, response, next) {

    let id = request.params.id

    let searchPosts = await controllerPostagem.getBuscarPostagem(id)

    response.json(searchPosts)
    response.status(searchPosts.status_code)
})

app.post('/v1/aquarela/post', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosPostagem = await controllerPostagem.setNovaPostagem(dadosBody, contentType)

    response.status(resultDadosPostagem.status_code)
    response.json(resultDadosPostagem)

})

app.put('/v1/aquarela/post/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_postagem = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerPostagem.setAtualizarPostagem(dadosBody, contentType, id_postagem)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

app.put('/v1/aquarela/delete/post/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_postagem = request.params.id

    let resultDados = await controllerPostagem.setExcluirPostagem(id_postagem);

    response.status(resultDados.status_code);
    response.json(resultDados);
})

app.post('/v1/aquarela/favorite/posts', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosPostagem = await controllerPostagem.setFavoritarPostagem(dadosBody, contentType)

    response.status(resultDadosPostagem.status_code)
    response.json(resultDadosPostagem)

})

app.post('/v1/aquarela/like/posts', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosPostagem = await controllerPostagem.setCurtirPostagem(dadosBody, contentType)

    response.status(resultDadosPostagem.status_code)
    response.json(resultDadosPostagem)

})

app.post('/v1/aquarela/vizualizer/posts', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosPostagem = await controllerPostagem.setVisualizarPostagem(dadosBody, contentType)

    response.status(resultDadosPostagem.status_code)
    response.json(resultDadosPostagem)

})

app.post('/v1/aquarela/coment/post', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosPostagem = await controllerPostagem.setComentarPostagem(dadosBody, contentType)

    response.status(resultDadosPostagem.status_code)
    response.json(resultDadosPostagem)

})

app.post('/v1/aquarela/folders/posts', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosPostagem = await controllerPostagem.setAdicionarPostagemPasta(dadosBody, contentType)

    response.status(resultDadosPostagem.status_code)
    response.json(resultDadosPostagem)

})

// #region Pastas
/******************************************************** Endpoints Pasta ********************************************************/

app.get('/v1/aquarela/folders', cors(), async function (request, response, next) {

    let searchPastas = await controllerPasta.getListPastas()

    response.json(searchPastas)
    response.status(searchPastas.status_code)
})

app.post('/v1/aquarela/folder', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosPasta = await controllerPasta.setNovaPasta(dadosBody, contentType)

    response.status(resultDadosPasta.status_code)
    response.json(resultDadosPasta)

})

app.put('/v1/aquarela/folder/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_pasta = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerPasta.setUpdatePasta(dadosBody, contentType, id_pasta)
    response.status(resultDados.status_code);
    response.json(resultDados)
})

app.put('/v1/aquarela/folders/:id', cors(), bodyParserJson, async (request, response, next) => {

    let id_pasta = request.params.id

    let resultDados = await controllerPasta.setExcluirPasta(id_pasta);

    response.status(resultDados.status_code);
    response.json(resultDados);
})

// #region Conversas

/************************************************ EndPoins Conversas ************************************************/

app.post('/v1/aquarela/chat/user/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDadosPasta = await controllerConversas.setNovaConversa(dadosBody, contentType)

    response.status(resultDadosPasta.status_code)
    response.json(resultDadosPasta)

})

app.get('/v1/aquarela/chats', cors(), async function (request, response, next) {

    let searchConversas = await controllerConversas.getListConversas()

    response.json(searchConversas)
    response.status(searchConversas.status_code)
})

const port = process.env.PORT || 8080
app.listen(port, () => { console.log('API funcionando na porta ' + port) })