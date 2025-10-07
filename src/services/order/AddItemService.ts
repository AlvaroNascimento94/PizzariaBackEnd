import prismaClient from "../../prisma";

interface IAddItem{
    orderId: string,
    productId: string,
    amount: number
}

class AddItemService{
    async execute({orderId, productId, amount}: IAddItem){
        const order = await prismaClient.item.create({
            data:{
                orderId,
                productId,
                amount
            }
        })

        return order
    }
}
export {AddItemService}