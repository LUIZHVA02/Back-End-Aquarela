const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const insertNovoCarrinho = async (dadosCarrinho) => {
    try {
        let sql = `insert into tbl_carrinho_compra (   
                                                  id_usuario,
                                                  carrinho_compra_status
                                              ) 
                                              values 
                                              (
                                                  '${dadosCarrinho.id_usuario}',
                                                  true
                                              )`;
        
        let resultStatus = await prisma.$executeRawUnsafe(sql);

        if (resultStatus) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro ao inserir carrinho: ", error);
        console.log(error);

        return false;
    }
};

const insertNovoItemCarrinho = async (dadosItemCarrinho) => {
    try {
        let sql = `insert into tbl_item_carrinho (   
                                                quantidade,
                                                id_produto,
                                                id_carrinho_compra,
                                                item_carrinho_status
                                            ) 
                                            values 
                                            (   
                                                '${dadosItemCarrinho.quantidade}',
                                                '${dadosItemCarrinho.id_produto}',
                                                '${dadosItemCarrinho.id_carrinho_compra}',
                                                true
                                            );`                                            

        let resultStatus = await prisma.$executeRawUnsafe(sql);

        if (resultStatus) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro ao inserir Itens no carrinho: ", error);
        console.log(error + "aqui");

        return false;
    }
};

const selectAllCarrinhos = async () => {
    try {
        let sql = `select tbl_usuario.id_usuario, tbl_usuario.nome, 
                    tbl_usuario.nome_usuario, tbl_usuario.email, 
                    tbl_carrinho_compra.id_carrinho_compra 
                    from tbl_carrinho_compra inner join 
                    tbl_usuario on tbl_usuario.id_usuario = 
                    tbl_carrinho_compra.id_usuario where 
                    carrinho_compra_status = 1;`;

        let resultStatus = await prisma.$queryRawUnsafe(sql);
        if (resultStatus) {
            return resultStatus;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro ao listar carrinhos: ", error);
        return false;
    }
};

const selectCarrinhoByIdusuario = async (id) => {
    try {
        let sql = `select id_carrinho_compra, id_usuario from tbl_carrinho_compra where id_usuario = ${id}`;

        let resultStatus = await prisma.$queryRawUnsafe(sql);

        if (resultStatus) {
            return resultStatus;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro ao listar carrinhos: ", error);
        return false;
    }
};


const selectAllItensCarrinho = async (id_carrinho_compra) => {
    try {
        let sql = `select * from tbl_item_carrinho where id_carrinho_compra = ${id_carrinho_compra}`;

        let resultStatus = await prisma.$queryRawUnsafe(sql);

        if (resultStatus) {
            return resultStatus;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro ao listar os Itens do carrinho: ", error);
        return false;
    }
};

const selectLastIdCarrinho = async () => {

    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_carrinho_compra limit 1'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

const selectLastIdItemCarrinho = async (id_carrinho) => {

    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_item_carrinho 
                    where id_carrinho_compra = ${id_carrinho} limit 1`
                    
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        console.log(error);
        return false
    }

}

module.exports = {
    insertNovoCarrinho,
    insertNovoItemCarrinho,
    selectAllCarrinhos,
    selectCarrinhoByIdusuario,
    selectAllItensCarrinho,
    selectLastIdCarrinho,
    selectLastIdItemCarrinho
}