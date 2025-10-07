import prismaClient from "../../prisma";

interface ISendOrder {
  id: string;
}

class SendOrderService {
  async execute({ id }: ISendOrder) {
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
