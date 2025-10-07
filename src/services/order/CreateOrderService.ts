import prismaClient from "../../prisma";

interface IOrder {
  table: number;
  name: string;
}

class CreateOrderService {
  async execute({ table, name }: IOrder) {
    const orderExist = await prismaClient.order.findFirst({
        where:{
            table
        }
    })
    
    if(orderExist) throw new Error("Mesa em uso");
    
    const order = await prismaClient.order.create({
      data: {
        table,
        name,
      },
    });
    return order;
  }
}

export { CreateOrderService };
