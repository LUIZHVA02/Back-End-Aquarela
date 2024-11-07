const userPreferencesDAO = require("../model/DAO/preferencias-usuario");
const categoriesDAO = require("../model/DAO/categoria");
const message = require("../modulo/config.js");

const adicionarPreferencias = async function (dadosPreferenciasUsuario, contentType) {
  try {
    if (String(contentType).toLowerCase() === "application/json") {
      let resultDadosPreferenciasUsuario = {};

      if (
        !dadosPreferenciasUsuario.preferencias ||
        !dadosPreferenciasUsuario.id_usuario ||
        isNaN(dadosPreferenciasUsuario.id_usuario)
      ) {
        return message.ERROR_REQUIRED_FIELDS;
      } else {
        let categoriasArray = [];

        // Inserir preferências e esperar todas as promessas serem resolvidas
        await Promise.all(
          dadosPreferenciasUsuario.preferencias.map(async (preferencia) => {
            await userPreferencesDAO.insertNovaPreferencia(dadosPreferenciasUsuario.id_usuario, preferencia);
          })
        );

        // Obter categorias
        await Promise.all(
          dadosPreferenciasUsuario.preferencias.map(async (preferencia) => {
            let dadosCategoria = await categoriesDAO.selectCategoriesById(preferencia);
            if (dadosCategoria.length > 0) {
              categoriasArray.push({ categoria: dadosCategoria[0].categoria });
            }
          })
        );

        resultDadosPreferenciasUsuario.status = message.CREATED_ITEM.status;
        resultDadosPreferenciasUsuario.status_code = message.CREATED_ITEM.status_code;
        resultDadosPreferenciasUsuario.message = message.CREATED_ITEM.message;
        resultDadosPreferenciasUsuario.usuario = dadosPreferenciasUsuario.id_usuario;
        resultDadosPreferenciasUsuario.preferencias = categoriasArray;

        console.log(categoriasArray); // Log no terminal para debug

        return resultDadosPreferenciasUsuario;
      }
    } else {
      return message.ERROR_CONTENT_TYPE;
    }
  } catch (error) {
    console.error("Erro ao tentar inserir preferências: " + error);
    return message.ERROR_INTERNAL_SERVER;
  }
};

const getListPreferences = async () => {
  try {
    let preferenciasJSON = {};
    let usersArray = []
    let userPreferencesJSON = {}
    let userPreferencesARRAY = []

    let dadosPreferenciasUsuario =
      await userPreferencesDAO.selectAllPreferences();

    console.log(dadosPreferenciasUsuario);


    if (dadosPreferenciasUsuario) {
      if (dadosPreferenciasUsuario.length > 0) {

        // Eu preciso que essas informações:

        // [
        //   {
        //     id_usuario: 1,
        //     nome: 'mats',
        //     nome_usuario: 'matheus',
        //     id_categoria: 142,
        //     categoria: 'Arte e Questões Sociais'
        //   },
        //   {
        //     id_usuario: 1,
        //     nome: 'mats',
        //     nome_usuario: 'matheus',
        //     id_categoria: 141,
        //     categoria: 'Arte e Política'
        //   },
        //   {
        //     id_usuario: 1,
        //     nome: 'mats',
        //     nome_usuario: 'matheus',
        //     id_categoria: 142,
        //     categoria: 'Arte e Questões Sociais'
        //   },
        //   {
        //     id_usuario: 2,
        //     nome: 'mats',
        //     nome_usuario: 'matheus',
        //     id_categoria: 121,
        //     categoria: 'Álbum de Fotos'
        //   },
        //   {
        //     id_usuario: 2,
        //     nome: 'mats',
        //     nome_usuario: 'matheus',
        //     id_categoria: 121,
        //     categoria: 'Álbum de Fotos'
        //   },
        //   {
        //     id_usuario: 2,
        //     nome: 'mats',
        //     nome_usuario: 'matheus',
        //     id_categoria: 121,
        //     categoria: 'Álbum de Fotos'
        //   }
        // ];

        // se organizem deste jeito:

        // [
        //   {
        //     id_usuario: 1,
        //     nome: 'mats',
        //     nome_usuario: 'matheus',
        //     preferencias: [
        //       {
        //         id_categoria: 142,
        //         categoria: 'Arte e Questões Sociais'
        //       },
        //       {
        //         id_categoria: 141,
        //         categoria: 'Arte e Política'
        //       },
        //       {
        //         id_categoria: 142,
        //         categoria: 'Arte e Questões Sociais'
        //       }
        //     ]
        //   },
        //   {
        //     id_usuario: 2,
        //     nome: 'mats',
        //     nome_usuario: 'matheus',
        //     preferencias: [
        //       {
        //         id_categoria: 121,
        //         categoria: 'Álbum de Fotos'
        //       },
        //       {
        //         id_categoria: 121,
        //         categoria: 'Álbum de Fotos'
        //       },
        //       {
        //         id_categoria: 121,
        //         categoria: 'Álbum de Fotos'
        //       }
        //     ]
        //   }
        // ];

        const keys = Object.keys(dadosPreferenciasUsuario)

        keys.forEach(key => {

          let usuarioExistente = usersArray.find(usuario => usuario.id_usuario === key.id_usuario);

          if (!usuarioExistente) {
            usuarioExistente = {
              id_usuario: key.id_usuario,
              nome: key.nome,
              nome_usuario: key.nome_usuario,
              preferencias: []
            };
            console.log(usuarioExistente);
            
            usersArray.push(usuarioExistente);
          }

          usuarioExistente.preferencias.push({
            id_categoria: key.id_categoria,
            categoria: key.categoria
          });
        });

        preferenciasJSON.usuarios = usersArray;
        preferenciasJSON.quantity = dadosPreferenciasUsuario.length;
        preferenciasJSON.status_code = 200;
        return preferenciasJSON;
      } else {
        return message.ERROR_NOT_FOUND;
      }
    } else {
      return message.ERROR_INTERNAL_SERVER_DB;
    }
  } catch (error) {
    console.log(error);

    message.ERROR_INTERNAL_SERVER;
  }
};

const setExcluirPreferencias = async function (id) {
  try {
    let id_preferencia = id;
    let deletePreferenciaJSON = {};

    if (
      id_preferencia == "" ||
      id_preferencia == undefined ||
      isNaN(id_preferencia)
    ) {
      return message.ERROR_INVALID_ID;
    } else {
      let validaId = await userPreferencesDAO.selectByIdPreferences(
        id_preferencia
      );

      if (validaId.length > 0) {
        let preferencia_status = "0";

        deletePreferenciaJSON.preferencia_status = preferencia_status;

        let dadosPreferenciasUsuario =
          await userPreferencesDAO.updatePreferencias(
            id_preferencia,
            deletePreferenciaJSON
          );

        if (dadosPreferenciasUsuario) {
          return message.DELETED_ITEM;
        } else {
          return message.ERROR_INTERNAL_SERVER_DB;
        }
      } else {
        return message.ERROR_NOT_FOUND;
      }
    }
  } catch (error) {
    console.log(error);

    return message.ERROR_INTERNAL_SERVER;
  }
};

module.exports = {
  adicionarPreferencias,
  getListPreferences,
  setExcluirPreferencias,
};