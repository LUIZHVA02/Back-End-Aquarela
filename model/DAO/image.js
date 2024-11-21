const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const insertImage = async(url) => {
    try {

        let sql = `
            INSERT INTO tbl_imagem (url, imagem_status)
            VALUES
            ('${url}', TRUE)
        `

        let resultStatus = await prisma.$executeRawUnsafe(sql);

        if (resultStatus) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error(error)
        return false
    }
}

const selectLastId = async () => {

    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_imagem limit 1'
        let rsProduto = await prisma.$queryRawUnsafe(sql)
        return rsProduto
    } catch (error) {
        return false
    }
  
}


const selectByIdImagem = async (id) => {

    try {
        let sql = `select id_imagem, url from tbl_imagem where id_imagem = ${id} and imagem_status = "1"`    
        
        let rsImagem = await prisma.$queryRawUnsafe(sql)
        return rsImagem
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = {
    insertImage,
    selectLastId,
    selectByIdImagem
}