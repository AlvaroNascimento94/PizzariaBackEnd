import prismaClient from "../../prisma";

class ListOrdersService{
    async execute(){
        const order = prismaClient.order.findMany({
            where:{
                status:false,
                draft:false
                
            },
            orderBy:{
                createdAt:'desc'
            }
        })
        return order
    }
}

export{ListOrdersService}