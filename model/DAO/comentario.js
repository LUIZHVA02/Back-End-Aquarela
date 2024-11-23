const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updateComentario = async (id, dadosComentario) => {

    try {
      let sql = `UPDATE tbl_comentario SET mensagem = '${dadosComentario.mensagem}', id_usuario = ${dadosComentario.id_usuario}, id_resposta = ${dadosComentario.id_resposta} WHERE id_comentario = ${id}`;
      
      let result = await prisma.$executeRawUnsafe(sql);  
      return result;

    } catch (error) {
      console.log(error);
      return false
    }
  
  }

const deleteComentario = async(idComentario) => {
    try {
        let sql = `
                    UPDATE tbl_comentario
                    SET comentario_status = false
                    WHERE id_comentario = ${idComentario}
                `
        let resultStatus = await prisma.$executeRawUnsafe(sql);
        if (resultStatus) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Erro ao deletar comentário: ", error);  
        console.log(error + "aqui");
        return false;
      }
}

const selectComentarioById = async(id) => {
    try {
        let sql = `select * from tbl_comentario where id_comentario = ${id}`;
        let rsComentario = await prisma.$queryRawUnsafe(sql);
        return rsComentario
      } catch (error) {
        console.log(error);
        return false;
      }
}

module.exports = {
    updateComentario,
    deleteComentario,
    selectComentarioById
}