import prismaClient from "../../prisma";

interface IDetailOrder {
  id: string;
}

class DetailOrderService {
  async execute({ id }: IDetailOrder) {

    const order = await prismaClient.order.findUnique({
      where: {
        id,
      },
      include: {
        orderProducts: {
          include: {
            product: true,
          },
        },
        tables: true,
        orderStatus: true,
        waiter: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (!order.orderProducts || order.orderProducts.length === 0) {
      throw new Error("Este pedido não possui itens");
    }

    return order;
  }
}

export { DetailOrderService };
