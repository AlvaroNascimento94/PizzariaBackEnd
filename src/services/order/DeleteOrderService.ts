import prismaClient from "../../prisma";

interface IOrder {
  id: string;
}

class DeleteOrderService {
  async execute({ id }: IOrder) {
    const order = await prismaClient.order.delete({
        where:{
            id
        }
    })

    return order
  }
}

export { DeleteOrderService };
