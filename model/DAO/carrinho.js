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
        console.log(sql);
        let resultStatus = await prisma.$executeRawUnsafe(sql);

        if (resultStatus) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro ao inserir carrinho: ", error);
        console.log(error + "aqui");

        return false;
    }
};

const insertNovoItemCarrinho = async (dadosItemCarrinho) => {
    try {
        let sql = `insert into tbl_item_carrinho (   
                                                id_item_carrinho,
                                                quantidade,
                                                id_produto,
                                                id_carrinho_compra
                                                item_carrinho_status
                                            ) 
                                            values 
                                            (   
                                                '${dadosItemCarrinho.id_item_carrinho}',
                                                '${dadosItemCarrinho.quantidade}',
                                                '${dadosItemCarrinho.id_produto}',
                                                '${dadosItemCarrinho.id_carrinho_compra}',
                                                true
                                            )`;
        console.log(sql);
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
        let sql = ``;

        let resultStatus = await prisma.$queryRawUnsafe(sql);
        console.log(resultStatus);
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


const selectAllItensCarrinhos = async () => {
    try {
        let sql = ``;

        let resultStatus = await prisma.$queryRawUnsafe(sql);
        console.log(resultStatus);
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

module.exports = {
    insertNovoCarrinho,
    insertNovoItemCarrinho,
    selectAllCarrinhos,
    selectAllItensCarrinhos
}