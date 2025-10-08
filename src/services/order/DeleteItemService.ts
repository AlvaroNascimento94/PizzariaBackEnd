import prismaClient from "../../prisma";

interface IDeleteItem{
    itemId: string
}

class DeleteItemService{
    async execute({itemId}: IDeleteItem){
        const order = await prismaClient.item.delete({
            where: {
                id: itemId
            }
        })
        return order
    }
}
export{DeleteItemService}