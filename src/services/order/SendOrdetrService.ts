import prismaClient from "../../prisma";

interface ISendOrder {
  id: string;
}

class SendOrderService {
  async execute({ id }: ISendOrder) {

    const orderSend = await prismaClient.order.findFirst({
      where:{
        id
      }
    }) 

    if(orderSend.draft == false) throw new Error("Pedido ja enviado")

    const order = await prismaClient.order.update({
      where: {
        id,
      },
      data: {
        draft: false,
      },
    });

    return order;
  }
}

export { SendOrderService };
